
export default async function handler(req, res) {
    // 1. CORS Headers (important for local dev and cross-origin if needed)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request (browser pre-flight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    // 2. Get the Admin Token safely from server-side environment variables
    const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const SHOP_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'zw02bv-iq.myshopify.com';
    const ADMIN_API_VERSION = '2024-01';

    if (!ADMIN_ACCESS_TOKEN) {
        console.error('Missing SHOPIFY_ADMIN_ACCESS_TOKEN env var');
        res.status(500).json({ error: 'Server Misconfiguration: Missing Admin Token' });
        return;
    }

    // 3. Forward the query to Shopify
    try {
        const { query, variables } = req.body;

        const shopifyResponse = await fetch(`https://${SHOP_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
            },
            body: JSON.stringify({ query, variables }),
        });

        const data = await shopifyResponse.json();

        if (!shopifyResponse.ok) {
            console.error('Shopify API Error:', data);
            res.status(shopifyResponse.status).json(data);
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
