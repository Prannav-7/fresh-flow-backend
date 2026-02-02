
import { db } from './firebaseConfig.js';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

const usersToPurge = [
    'prannavp803@gmail.com',
    'psujeeth02@gmail.com',
    'info.iyarkaivalari@gmail.com'
];

async function purgeUsers() {
    try {
        console.log('🚀 Starting purge of specific users from Firestore...');

        for (const email of usersToPurge) {
            console.log(`Checking for ${email}...`);
            const q = query(collection(db, 'users'), where('email', '==', email));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                console.log(`- ${email}: Not found in Firestore.`);
            } else {
                for (const userDoc of snapshot.docs) {
                    await deleteDoc(doc(db, 'users', userDoc.id));
                    console.log(`✅ ${email} (UID: ${userDoc.id}) removed from Firestore.`);
                }
            }
        }

        console.log('\n✨ Purge complete!');
        process.exit(0);
    } catch (error) {
        console.error('💥 Error during purge:', error);
        process.exit(1);
    }
}

purgeUsers();
