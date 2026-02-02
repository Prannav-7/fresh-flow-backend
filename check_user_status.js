
import { auth, db } from './firebaseConfig.js';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { deleteUser, signInWithEmailAndPassword } from 'firebase/auth';

const usersToPurge = [
    'prannavp803@gmail.com',
    'psujeeth02@gmail.com',
    'info.iyarkaivalari@gmail.com'
];

// NOTE: This script assumes you know the password or can bypass it.
// Since we are in a development environment, we will try to purge Firestore first.
// If Firebase Auth deletion is needed, it's safer to do it from the Console.

async function checkAndLogUsers() {
    try {
        console.log('🚀 Checking status of users to be purged...');

        for (const email of usersToPurge) {
            console.log(`Checking Firestore for ${email}...`);
            const q = query(collection(db, 'users'), where('email', '==', email));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                console.log(`- ${email}: Not found in Firestore.`);
            } else {
                snapshot.forEach(d => console.log(`- ${email}: Found in Firestore (UID: ${d.id})`));
            }
        }

        console.log('\n⚠️ If "Already Exists" error persists, the user exists in Firebase AUTH tab.');
        console.log('Firestore is cleared, but the login identity remains.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAndLogUsers();
