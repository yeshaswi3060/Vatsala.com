import { MongoClient } from 'mongodb';

let uri = process.env.mango_url || process.env.MONGODB_URI;

// Patch for Windows Node.js ECONNREFUSED DNS issues when resolving SRV records
if (uri && uri.startsWith('mongodb+srv://soniasingh3881446_db_user')) {
    const credsMatch = uri.match(/mongodb\+srv:\/\/(.*?)@/);
    if (credsMatch) {
        uri = `mongodb://${credsMatch[1]}@ac-iz5vtn8-shard-00-00.avmtp9k.mongodb.net:27017,ac-iz5vtn8-shard-00-01.avmtp9k.mongodb.net:27017,ac-iz5vtn8-shard-00-02.avmtp9k.mongodb.net:27017/?ssl=true&replicaSet=atlas-uxprow-shard-0&authSource=admin&retryWrites=true&w=majority&appName=allcloths`;
    }
}

let client;
let clientPromise;

if (!uri) {
    console.error('Please add your Mongo URI to .env');
} else {
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri);
            global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
    } else {
        client = new MongoClient(uri);
        clientPromise = client.connect();
    }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (!clientPromise) {
        return res.status(500).json({ error: 'Database connection failed. Missing URI.' });
    }

    try {
        const connectedClient = await clientPromise;
        const database = connectedClient.db('allcloths_cms');
        const extensionsCollection = database.collection('product_extensions');

        // GET: Fetch extensions for a specific product ID
        if (req.method === 'GET') {
            // Safely parse query parameters if req.query is undefined (like in local Vite dev server)
            let productId = req.query?.productId;
            if (!productId && req.url) {
                try {
                    // Fallback to manual URL parsing for local dev environments
                    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
                    productId = urlObj.searchParams.get('productId');
                } catch (e) {
                    console.error("Error parsing URL:", e);
                }
            }

            if (!productId) {
                return res.status(400).json({ error: 'Missing productId parameter' });
            }

            const cleanId = productId.replace('gid://shopify/Product/', '');
            const extension = await extensionsCollection.findOne({ _id: cleanId });

            if (!extension) {
                // Return defaults if not found so the frontend always has a valid object shape
                return res.status(200).json({
                    features: [],
                    specifications: [],
                    reviews: []
                });
            }

            return res.status(200).json(extension);
        }

        // POST: Save or update extensions for a specific product ID
        if (req.method === 'POST') {
            const { productId, data } = req.body;

            if (!productId || !data) {
                return res.status(400).json({ error: 'Missing productId or data in payload' });
            }

            const cleanId = productId.replace('gid://shopify/Product/', '');

            // Format document for insertion/update
            const documentToSave = {
                ...data,
                updatedAt: new Date().toISOString() // Tracking timestamp
            };

            // Delete _id string from data payload to prevent immutable MongoDB _id update errors
            delete documentToSave._id;

            await extensionsCollection.updateOne(
                { _id: cleanId },
                { $set: documentToSave },
                { upsert: true }
            );

            return res.status(200).json({ success: true, message: 'Product extension saved successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('MongoDB API Error in product-extensions:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
