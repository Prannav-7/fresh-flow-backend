import { db } from './firebaseConfig.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { products } from '../frontend/src/data/products.js';

/**
 * Upload all products to Firebase Firestore
 */
async function uploadProductsToFirebase() {
    try {
        console.log('🔄 Starting product upload to Firebase...\n');

        const productsCollection = collection(db, 'products');

        // Clear existing products first (optional)
        const existingProducts = await getDocs(productsCollection);
        if (existingProducts.size > 0) {
            console.log(`⚠️  Found ${existingProducts.size} existing products. Deleting...`);
            for (const docSnap of existingProducts.docs) {
                await deleteDoc(doc(db, 'products', docSnap.id));
            }
            console.log('✅ Cleared existing products\n');
        }

        // Upload all products
        console.log(`📦 Uploading ${products.length} products...`);

        let successCount = 0;
        let failCount = 0;

        for (const product of products) {
            try {
                await addDoc(productsCollection, {
                    ...product,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });

                console.log(`✓ Uploaded: ${product.name}`);
                successCount++;
            } catch (error) {
                console.error(`✗ Failed: ${product.name}`, error.message);
                failCount++;
            }
        }

        console.log('\n📊 Upload Summary:');
        console.log(`✅ Success: ${successCount} products`);
        console.log(`❌ Failed: ${failCount} products`);
        console.log('\n🎉 Product upload completed!');

    } catch (error) {
        console.error('❌ Error uploading products:', error);
    }
}

// Run the upload function
uploadProductsToFirebase();
