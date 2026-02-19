// Shopify Admin API Client
// NOTE: This uses the Admin API Access Token. 
// SECURITY WARNING: In a production app, these calls should be made from a backend server 
// to avoid exposing the Admin Token to the browser. 
// For this local/demo setup, we use standard fetch with env variables.

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_ADMIN_ACCESS_TOKEN;
// SHOP_DOMAIN removed as it was unused and causing lint errors
const ADMIN_API_VERSION = '2024-01';

// Use local proxy path to avoid CORS issues
// The proxy in vite.config.ts maps '/api/shopify/admin' -> 'https://{shop}/admin/api'
const ADMIN_URL = `/api/shopify/admin/${ADMIN_API_VERSION}/graphql.json`;

async function shopifyAdminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    if (!ADMIN_ACCESS_TOKEN) {
        console.warn('Shopify Admin Token is missing. Please add VITE_SHOPIFY_ADMIN_ACCESS_TOKEN to .env');
        throw new Error('Missing Admin Token');
    }

    const response = await fetch(ADMIN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error('Shopify Admin API Error:', text);
        // Throwing text allows UI to capture it
        throw new Error(`API Error ${response.status}: ${text}`);
    }

    const json = await response.json();

    if (json.errors) {
        console.error('Shopify Admin GraphQL Errors:', json.errors);
        throw new Error(json.errors[0]?.message || 'Shopify Admin GraphQL error');
    }

    return json.data;
}

// --- Types ---

export interface AdminOrder {
    id: string;
    name: string; // Order #1001
    createdAt: string;
    totalPriceSet: {
        shopMoney: { amount: string; currencyCode: string; };
    };
    displayFulfillmentStatus: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
    } | null;
}

export interface SalesStat {
    totalSales: string; // Money string
    totalOrders: number;
}

// --- Queries ---

export async function fetchRecentOrders(first: number = 10): Promise<AdminOrder[]> {
    const query = `
        query GetRecentOrders($first: Int!) {
            orders(first: $first, sortKey: CREATED_AT, reverse: true) {
                edges {
                    node {
                        id
                        name
                        createdAt
                        displayFulfillmentStatus
                        totalPriceSet {
                            shopMoney {
                                amount
                                currencyCode
                            }
                        }
                        customer {
                            firstName
                            lastName
                            email
                        }
                    }
                }
            }
        }
    `;

    try {
        const data = await shopifyAdminFetch<{ orders: { edges: { node: AdminOrder }[] } }>(query, { first });
        return data.orders.edges.map(edge => edge.node);
    } catch (error) {
        console.error("Failed to fetch recent orders:", error);
        return [];
    }
}

export async function fetchShopStats(): Promise<SalesStat> {
    // Note: 'orders' count is available, but true 'Analytics' requires ShopifyQL (available in Plus)
    // or iterating all orders. For standard plans, we mock total sales by fetching a batch of orders 
    // or using the proper 'ordersCount' field if available on Shop. 
    // Here we will just sum the recent 50 orders for a "Recent Revenue" metric to be safe/fast.

    const query = `
        query GetShopStats {
            orders(first: 50) {
                edges {
                    node {
                        totalPriceSet {
                            shopMoney {
                                amount
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const data = await shopifyAdminFetch<{ orders: { edges: { node: { totalPriceSet: { shopMoney: { amount: string } } } }[] } }>(query);

        const orders = data.orders.edges;
        const totalRev = orders.reduce((sum: number, edge: any) => sum + parseFloat(edge.node.totalPriceSet.shopMoney.amount), 0);

        return {
            totalSales: totalRev.toFixed(2),
            totalOrders: orders.length // This is just sample size, ideal to enable true analytics
        };
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        return { totalSales: '0.00', totalOrders: 0 };
    }
}

// ... (existing code)



// ... (existing code)

export async function fetchShopDetails(): Promise<{ name: string; myshopifyDomain: string } | null> {
    const query = `
        query {
            shop {
                name
                myshopifyDomain
            }
        }
    `;

    try {
        const data = await shopifyAdminFetch<{ shop: { name: string; myshopifyDomain: string } }>(query);
        return data.shop;
    } catch (error) {
        console.error("Failed to fetch shop details:", error);
        return null;
    }
}

export interface AdminProduct {
    // ... (existing interface)
    id: string;
    title: string;
    handle: string;
    status: string;
    descriptionHtml?: string;
    totalInventory: number;
    priceRangeV2: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
    featuredImage: {
        url: string;
    } | null;
    vendor: string;
    productType: string;
}

export async function fetchAdminProducts(first: number = 20): Promise<AdminProduct[]> {
    const query = `
        query GetAdminProducts($first: Int!) {
            products(first: $first, sortKey: CREATED_AT, reverse: true) {
                edges {
                    node {
                        id
                        title
                        handle
                        status
                        totalInventory
                        vendor
                        productType
                        priceRangeV2 {
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        featuredImage {
                            url
                        }
                    }
                }
            }
        }
    `;

    try {
        const data = await shopifyAdminFetch<{ products: { edges: { node: AdminProduct }[] } }>(query, { first });
        return data.products.edges.map(edge => edge.node);
    } catch (error) {
        console.error("Failed to fetch admin products:", error);
        return [];
    }
}

export async function fetchAdminProduct(id: string): Promise<AdminProduct | null> {
    const query = `
        query GetAdminProduct($id: ID!) {
            product(id: $id) {
                id
                title
                handle
                status
                totalInventory
                vendor
                productType
                descriptionHtml
                priceRangeV2 {
                    minVariantPrice {
                        amount
                        currencyCode
                    }
                }
                featuredImage {
                    url
                }
            }
        }
    `;

    try {
        const data = await shopifyAdminFetch<{ product: AdminProduct }>(query, { id: `gid://shopify/Product/${id}` });
        return data.product;
    } catch (error) {
        console.error("Failed to fetch product:", error);
        return null;
    }
}

export async function updateProductDescription(id: string, descriptionHtml: string): Promise<boolean> {
    const query = `
        mutation productUpdate($input: ProductInput!) {
            productUpdate(input: $input) {
                product {
                    id
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

    try {
        const data = await shopifyAdminFetch<{ productUpdate: { product: { id: string } | null, userErrors: { message: string }[] } }>(query, {
            input: {
                id: `gid://shopify/Product/${id}`,
                descriptionHtml
            }
        });

        if (data.productUpdate.userErrors.length > 0) {
            console.error("Update Errors:", data.productUpdate.userErrors);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Failed to update product:", error);
        return false;
    }
}
