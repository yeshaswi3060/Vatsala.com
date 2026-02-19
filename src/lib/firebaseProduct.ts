
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ProductExtension {
    features: string[];
    specifications: { label: string; value: string }[];
}

export const fetchProductExtension = async (shopifyProductId: string): Promise<ProductExtension | null> => {
    try {
        // Shopify IDs often come as "gid://shopify/Product/123456", we just want "123456"
        const cleanId = shopifyProductId.replace('gid://shopify/Product/', '');

        const docRef = doc(db, 'product_extensions', cleanId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as ProductExtension;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching product extension:", error);
        return null;
    }
};

export const saveProductExtension = async (shopifyProductId: string, data: ProductExtension): Promise<boolean> => {
    try {
        const cleanId = shopifyProductId.replace('gid://shopify/Product/', '');

        await setDoc(doc(db, 'product_extensions', cleanId), {
            ...data,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        return true;
    } catch (error) {
        console.error("Error saving product extension:", error);
        return false;
    }
};
