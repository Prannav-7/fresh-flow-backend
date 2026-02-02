
import { db } from './firebaseConfig.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

async function checkAdmins() {
    try {
        console.log('Checking for admin users in Firestore...');
        const q = query(collection(db, 'users'), where('role', '==', 'admin'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('No admin users found in Firestore.');
        } else {
            querySnapshot.forEach((doc) => {
                console.log(`- ${doc.data().email} (UID: ${doc.id})`);
            });
        }

        console.log('\nChecking Specific admin emails:');
        const emails = ['psujeeth02@gmail.com', 'prannavp803@gmail.com', 'info.iyarkaivalari@gmail.com'];
        for (const email of emails) {
            const eq = query(collection(db, 'users'), where('email', '==', email));
            const esnap = await getDocs(eq);
            if (esnap.empty) {
                console.log(`- ${email}: NOT FOUND in Firestore`);
            } else {
                const data = esnap.docs[0].data();
                console.log(`- ${email}: FOUND (UID: ${esnap.docs[0].id}, Role: ${data.role})`);
            }
        }
        process.exit(0);
    } catch (error) {
        console.error('Error checking admins:', error);
        process.exit(1);
    }
}

checkAdmins();
