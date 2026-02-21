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
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri);
            global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
    } else {
        // In production mode, it's best to not use a global variable.
        client = new MongoClient(uri);
        clientPromise = client.connect();
    }
}

const DEFAULT_SETTINGS = {
    hero: {
        imageUrl: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=1200',
        title: 'Wedding Collection 2024',
        subtitle: 'Handcrafted Elegance for Your Special Day'
    },
    side_banner: {
        imageUrl: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&auto=format&fit=crop&q=80',
        title: 'Designer Lehengas',
        subtitle: 'New Arrivals',
        linkUrl: '/shop?category=Lehengas'
    },
    categories: {
        sarees: {
            imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
            description: 'Handwoven masterpieces typically for weddings and festivals.'
        },
        lehengas: {
            imageUrl: 'https://images.unsplash.com/photo-1594951676644-2453e00787cb?w=600&auto=format&fit=crop&q=80',
            description: 'Intricate embroidery and royal silhouettes for your big day.'
        },
        suits: {
            imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
            description: 'Contemporary styles meeting traditional comfort.'
        }
    },
    category_rail: [
        { name: 'Sarees', imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=60', linkUrl: '/shop?category=Sarees' },
        { name: 'Lehengas', imageUrl: 'https://images.unsplash.com/photo-1583391733958-377742e970a9?w=400&auto=format&fit=crop&q=60', linkUrl: '/shop?category=Lehengas' },
        { name: 'Suits', imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&auto=format&fit=crop&q=60', linkUrl: '/shop?category=Suits' },
        { name: 'Jewelry', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&auto=format&fit=crop&q=60', linkUrl: '/shop?category=Jewelry' },
        { name: 'New In', imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&auto=format&fit=crop&q=60', linkUrl: '/shop?sort=newest' },
        { name: 'Sale', imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&auto=format&fit=crop&q=60', linkUrl: '/shop?sort=price_asc' }
    ]
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
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
        const settingsCollection = database.collection('homepage_settings');

        if (req.method === 'GET') {
            const settings = await settingsCollection.findOne({ _id: 'config' });
            if (!settings) {
                return res.status(200).json(DEFAULT_SETTINGS);
            }
            return res.status(200).json(settings);
        }

        if (req.method === 'POST') {
            const newSettings = req.body;
            delete newSettings._id; // Prevents _id mutability issues
            await settingsCollection.updateOne(
                { _id: 'config' },
                { $set: newSettings },
                { upsert: true }
            );
            return res.status(200).json({ success: true, message: 'Settings updated' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('MongoDB API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
