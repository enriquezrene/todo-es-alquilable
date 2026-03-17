// Temporary script to fix phone number for existing listing
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');

// Your Firebase config
const firebaseConfig = {
  // Add your config here or use environment variables
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixPhoneNumber() {
  const listingId = 'wr3uMFkUlnSMwWleOVLt';
  const userId = 'ferreteriaexpress2021@hotmail.com'; // This might be the user ID, or you need to get the actual UID
  
  try {
    // First, get the user document to find the phone number
    // You might need to query the users collection to find the right user
    const userDocRef = doc(db, 'users', 'ACTUAL_USER_UID'); // Replace with actual UID
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const phoneNumber = userData.phone;
      
      console.log('Found phone number:', phoneNumber);
      
      // Update the listing with the phone number
      const listingRef = doc(db, 'listings', listingId);
      await updateDoc(listingRef, {
        ownerPhone: phoneNumber
      });
      
      console.log('Updated listing with phone number');
    } else {
      console.log('User document not found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

fixPhoneNumber();
