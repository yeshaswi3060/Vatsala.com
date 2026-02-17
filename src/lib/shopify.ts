// Shopify Storefront API client
// Uses the Storefront API (public, safe for frontend) to fetch products, collections, and manage checkout

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const STOREFRONT_API_VERSION = '2024-01';

const STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`;

// ----- GraphQL Helper -----

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const response = await fetch(STOREFRONT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
        console.error('Shopify GraphQL Errors:', json.errors);
        throw new Error(json.errors[0]?.message || 'Shopify GraphQL error');
    }

    return json.data;
}

// ----- Types -----

export interface ShopifyImage {
    url: string;
    altText: string | null;
    width: number;
    height: number;
}

export interface ShopifyPrice {
    amount: string;
    currencyCode: string;
}

export interface ShopifyVariant {
    id: string;
    title: string;
    availableForSale: boolean;
    price: ShopifyPrice;
    compareAtPrice: ShopifyPrice | null;
    selectedOptions: { name: string; value: string }[];
    image: ShopifyImage | null;
}

export interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    descriptionHtml: string;
    productType: string;
    tags: string[];
    availableForSale: boolean;
    images: ShopifyImage[];
    variants: ShopifyVariant[];
    priceRange: {
        minVariantPrice: ShopifyPrice;
        maxVariantPrice: ShopifyPrice;
    };
    compareAtPriceRange: {
        minVariantPrice: ShopifyPrice;
        maxVariantPrice: ShopifyPrice;
    };
    options: { name: string; values: string[] }[];
}

export interface ShopifyCollection {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: ShopifyImage | null;
}

// ----- GraphQL Fragments -----

const PRODUCT_FRAGMENT = `
    fragment ProductFields on Product {
        id
        title
        handle
        description
        descriptionHtml
        productType
        tags
        availableForSale
        options {
            name
            values
        }
        priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
        }
        compareAtPriceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
        }
        images(first: 10) {
            edges {
                node {
                    url
                    altText
                    width
                    height
                }
            }
        }
        variants(first: 50) {
            edges {
                node {
                    id
                    title
                    availableForSale
                    price { amount currencyCode }
                    compareAtPrice { amount currencyCode }
                    selectedOptions { name value }
                    image {
                        url
                        altText
                        width
                        height
                    }
                }
            }
        }
    }
`;

// ----- Product Queries -----

export async function fetchAllProducts(first: number = 50): Promise<ShopifyProduct[]> {
    const query = `
        ${PRODUCT_FRAGMENT}
        query AllProducts($first: Int!) {
            products(first: $first) {
                edges {
                    node {
                        ...ProductFields
                    }
                }
            }
        }
    `;

    const data = await shopifyFetch<{
        products: { edges: { node: RawShopifyProduct }[] };
    }>(query, { first });

    return data.products.edges.map((edge) => normalizeProduct(edge.node));
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const query = `
        ${PRODUCT_FRAGMENT}
        query ProductByHandle($handle: String!) {
            product(handle: $handle) {
                ...ProductFields
            }
        }
    `;

    const data = await shopifyFetch<{ product: RawShopifyProduct | null }>(query, { handle });

    if (!data.product) return null;
    return normalizeProduct(data.product);
}

export async function fetchProductsByCollection(
    collectionHandle: string,
    first: number = 50
): Promise<ShopifyProduct[]> {
    const query = `
        ${PRODUCT_FRAGMENT}
        query CollectionProducts($handle: String!, $first: Int!) {
            collection(handle: $handle) {
                products(first: $first) {
                    edges {
                        node {
                            ...ProductFields
                        }
                    }
                }
            }
        }
    `;

    const data = await shopifyFetch<{
        collection: { products: { edges: { node: RawShopifyProduct }[] } } | null;
    }>(query, { handle: collectionHandle, first });

    if (!data.collection) return [];
    return data.collection.products.edges.map((edge) => normalizeProduct(edge.node));
}

// ----- Collection Queries -----

export async function fetchAllCollections(): Promise<ShopifyCollection[]> {
    const query = `
        query AllCollections {
            collections(first: 20) {
                edges {
                    node {
                        id
                        title
                        handle
                        description
                        image {
                            url
                            altText
                            width
                            height
                        }
                    }
                }
            }
        }
    `;

    const data = await shopifyFetch<{
        collections: { edges: { node: ShopifyCollection }[] };
    }>(query);

    return data.collections.edges.map((edge) => edge.node);
}

// ----- Checkout -----

export async function createCheckout(
    lineItems: { variantId: string; quantity: number }[]
): Promise<string> {
    const query = `
        mutation CreateCart($lines: [CartLineInput!]!) {
            cartCreate(input: { lines: $lines }) {
                cart {
                    id
                    checkoutUrl
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

    const variables = {
        lines: lineItems.map((item) => ({
            merchandiseId: item.variantId,
            quantity: item.quantity,
        })),
    };

    const data = await shopifyFetch<{
        cartCreate: {
            cart: { id: string; checkoutUrl: string } | null;
            userErrors: { field: string[]; message: string }[];
        };
    }>(query, variables);

    if (data.cartCreate.userErrors.length > 0) {
        throw new Error(data.cartCreate.userErrors[0].message);
    }

    if (!data.cartCreate.cart) {
        throw new Error('Failed to create cart');
    }

    return data.cartCreate.cart.checkoutUrl;
}

// ----- Normalization Helper -----

// The raw Shopify response uses edges/node pattern. We flatten it.
interface RawShopifyProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    descriptionHtml: string;
    productType: string;
    tags: string[];
    availableForSale: boolean;
    options: { name: string; values: string[] }[];
    priceRange: {
        minVariantPrice: ShopifyPrice;
        maxVariantPrice: ShopifyPrice;
    };
    compareAtPriceRange: {
        minVariantPrice: ShopifyPrice;
        maxVariantPrice: ShopifyPrice;
    };
    images: { edges: { node: ShopifyImage }[] };
    variants: { edges: { node: ShopifyVariant }[] };
}

function normalizeProduct(raw: RawShopifyProduct): ShopifyProduct {
    return {
        ...raw,
        images: raw.images.edges.map((e) => e.node),
        variants: raw.variants.edges.map((e) => e.node),
    };
}
