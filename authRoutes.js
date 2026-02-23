import { auth, db } from './firebaseConfig.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

/**
 * Validation helper functions
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return 'Email is required';
    }
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
};

const validatePassword = (password) => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return null;
};

const validateDisplayName = (name) => {
    if (!name) {
        return 'Display name is required';
    }
    if (name.trim().length < 2) {
        return 'Display name must be at least 2 characters long';
    }
    if (name.trim().length > 50) {
        return 'Display name must not exceed 50 characters';
    }
    // Allow letters, spaces, and basic punctuation like . - '
    if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
        return 'Display name can only contain letters, spaces, periods, hyphens, and apostrophes';
    }
    return null;
};

/**
 * Sign Up - Create new user account
 */
export async function signUp(email, password, displayName) {
    try {
        console.log(`Signup attempt: ${email}, ${displayName}`);

        // Validate inputs
        const emailError = validateEmail(email);
        if (emailError) {
            console.warn(`Signup validation failed (email): ${emailError}`);
            return {
                success: false,
                error: emailError,
                code: 'validation/invalid-email'
            };
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            console.warn(`Signup validation failed (password): ${passwordError}`);
            return {
                success: false,
                error: passwordError,
                code: 'validation/weak-password'
            };
        }

        const nameError = validateDisplayName(displayName);
        if (nameError) {
            console.warn(`Signup validation failed (name): ${nameError}`);
            return {
                success: false,
                error: nameError,
                code: 'validation/invalid-name'
            };
        }

        // Create user in Firebase Auth
        let userCredential;
        try {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } catch (fbError) {
            // Handle "Email Already In Use" specifically for "Deleted DB User" scenario
            if (fbError.code === 'auth/email-already-in-use') {
                console.log(`User ${email} already in Auth. Checking if DB record exists...`);
                try {
                    // Try to sign in to verify password ownership
                    const pendingCredential = await signInWithEmailAndPassword(auth, email, password);
                    const pendingUser = pendingCredential.user;

                    // Check if Firestore record exists
                    const docCheck = await getDoc(doc(db, 'users', pendingUser.uid));

                    if (!docCheck.exists()) {
                        console.log(`User ${email} exists in Auth but MISSING in DB. Recovering account...`);
                        userCredential = pendingCredential; // Use this credential to proceed with DB creation
                        // Continue to creation logic below...
                    } else {
                        // User exists in BOTH Auth and DB -> Real duplicate
                        throw fbError;
                    }
                } catch (recoveryError) {
                    console.warn(`Recovery failed: ${recoveryError.code}`);

                    if (recoveryError.code === 'auth/wrong-password' || recoveryError.code === 'auth/invalid-credential') {
                        return {
                            success: false,
                            error: 'This email is already registered. Please Login with your existing password (or Google) to restore your account.',
                            code: 'auth/account-exists-restore-required'
                        };
                    }

                    throw fbError;
                }
            } else {
                throw fbError;
            }
        }

        const user = userCredential.user;

        // Update display name
        if (displayName) {
            try {
                await updateProfile(user, { displayName: displayName.trim() });
            } catch (pError) {
                console.warn(`Profile update failed: ${pError.message}`);
                // Don't fail the whole signup if just profile update fails
            }
        }

        // Store user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: displayName.trim() || '',
            role: user.email === 'prannavp803@gmail.com' ? 'admin' : 'user', // Auto-admin for specific email
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            isActive: true
        });

        return {
            success: true,
            message: 'User created successfully',
            user: {
                uid: user.uid,
                email: user.email,
                displayName: displayName.trim() || '',
                role: 'user'
            }
        };
    } catch (error) {
        console.error('Sign up error:', error);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
}

/**
 * Sign In - Login existing user
 */
export async function signIn(email, password) {
    try {
        console.log(`Signin attempt: ${email}`);

        // Validate inputs
        const emailError = validateEmail(email);
        if (emailError) {
            console.warn(`Signin validation failed (email): ${emailError}`);
            return {
                success: false,
                error: emailError,
                code: 'validation/invalid-email'
            };
        }

        if (!password) {
            console.warn(`Signin validation failed: password required`);
            return {
                success: false,
                error: 'Password is required',
                code: 'validation/password-required'
            };
        }

        // Sign in with Firebase Auth
        let userCredential;
        try {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (fbError) {
            console.error(`Firebase Auth Signin Error [${fbError.code}]: ${fbError.message}`);
            return {
                success: false,
                error: fbError.message,
                code: fbError.code
            };
        }

        const user = userCredential.user;

        // Get user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        let userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            role: 'user'
        };

        if (userDoc.exists()) {
            userData = { ...userData, ...userDoc.data() };

            // Update last login time
            await setDoc(userDocRef, {
                ...userDoc.data(),
                lastLogin: serverTimestamp()
            }, { merge: true });
        } else {
            console.log(`User ${email} authenticated but no Firestore record found. Recreating account...`);

            // Create user document if it doesn't exist (Re-create deleted user)
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                role: 'user',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                isActive: true
            });
        }

        return {
            success: true,
            message: 'Login successful',
            user: userData
        };
    } catch (error) {
        console.error('Sign in error:', error);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
}

/**
 * Google Sign In - Setup/Sync user from Google Auth
 */
export async function googleSignIn(userData) {
    try {
        const { uid, email, displayName, photoURL } = userData;

        // Check if user exists in Firestore
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        let finalUserData;

        if (userDoc.exists()) {
            // Update last login
            finalUserData = userDoc.data();
            await updateDoc(userDocRef, {
                lastLogin: serverTimestamp(),
                photoURL: photoURL || finalUserData.photoURL || ''
            });
            finalUserData = { ...finalUserData, lastLogin: new Date().toISOString() };
        } else {
            // Create new user document
            finalUserData = {
                uid,
                email,
                displayName: displayName || '',
                photoURL: photoURL || '',
                role: 'user', // default role
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                isActive: true
            };
            await setDoc(userDocRef, finalUserData);

            // For return value, replace timestamp with string
            finalUserData = { ...finalUserData, createdAt: new Date().toISOString(), lastLogin: new Date().toISOString() };
        }

        return {
            success: true,
            message: 'Google login successful',
            user: finalUserData
        };
    } catch (error) {
        console.error('Google sign in error:', error);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
}

/**
 * Sign Out - Logout user
 */
export async function signOutUser() {
    try {
        await signOut(auth);
        return {
            success: true,
            message: 'Signed out successfully'
        };
    } catch (error) {
        console.error('Sign out error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get user data from Firestore
 */
export async function getUserData(uid) {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return {
                success: true,
                user: userDoc.data()
            };
        } else {
            return {
                success: false,
                error: 'User not found'
            };
        }
    } catch (error) {
        console.error('Get user data error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Update user profile (displayName, phone, etc.)
 */
export async function updateUserProfile(uid, updates) {
    try {
        const userDocRef = doc(db, 'users', uid);

        // Update Firestore document
        await updateDoc(userDocRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });

        // Get updated user data
        const userDoc = await getDoc(userDocRef);

        return {
            success: true,
            message: 'Profile updated successfully',
            user: userDoc.data()
        };
    } catch (error) {
        console.error('Update profile error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Change user password
 */
export async function changeUserPassword(email, currentPassword, newPassword) {
    try {
        // First, sign in the user with current password to verify it
        const userCredential = await signInWithEmailAndPassword(auth, email, currentPassword);
        const user = userCredential.user;

        // Update password
        await updatePassword(user, newPassword);

        // Sign out after changing password
        await signOut(auth);

        return {
            success: true,
            message: 'Password changed successfully'
        };
    } catch (error) {
        console.error('Change password error:', error);

        // Provide more user-friendly error messages
        let errorMessage = error.message;
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Current password is incorrect';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'New password is too weak. Please use at least 6 characters';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'User not found';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Please try again later';
        }

        return {
            success: false,
            error: errorMessage,
            code: error.code
        };
    }
}
