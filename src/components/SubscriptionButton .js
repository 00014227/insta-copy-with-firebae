import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where, writeBatch, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';

const SubscriptionButton = ({ publicationUserID }) => {
 
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check subscription status when the component mounts
    checkSubscriptionStatus();

    // Subscribe to real-time updates for the profile document
    const unsubscribe = listenToProfileChanges();

    // Cleanup function
    return () => {
      // Unsubscribe from real-time updates
      unsubscribe();
    };
  }, []);

  const checkSubscriptionStatus = async () => {
    const db = getFirestore();
    const profileRef = doc(db, 'profile', publicationUserID);
    const profileSnapshot = await getDoc(profileRef);

    if (profileSnapshot.exists()) {
      const followers = profileSnapshot.data().followers || [];
      setIsSubscribed(followers.includes(auth.currentUser.uid));
    }
  };

  const listenToProfileChanges = () => {
    const db = getFirestore();
    const profileRef = doc(db, 'profile', publicationUserID);
    return onSnapshot(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        const followers = snapshot.data().followers || [];
        setIsSubscribed(followers.includes(auth.currentUser.uid));
      }
    });
  };

  const handleSubscription = async () => {
    const db = getFirestore();
    const currentUserID = auth.currentUser.uid;
    const profileRef = doc(db, 'profile', publicationUserID);
    const currentUserProfileRef = doc(db, 'profile', currentUserID);

    const profileSnapshot = await getDoc(profileRef);
    const currentUserProfileSnapshot = await getDoc(currentUserProfileRef);

    if (profileSnapshot.exists() && currentUserProfileSnapshot.exists()) {
      const followers = profileSnapshot.data().followers || [];
      const updatedFollowers = [...followers]; // Create a copy of the followers array

      if (isSubscribed) {
        // Unsubscribe
        const index = updatedFollowers.indexOf(currentUserID);
        if (index > -1) {
          updatedFollowers.splice(index, 1);
        }
        setIsSubscribed(false);
        console.log('Unsubscribed successfully!');
      } else {
        // Subscribe
        updatedFollowers.push(currentUserID);
        setIsSubscribed(true);
        console.log('Subscribed successfully!');
      }

      // Update followers for the user being subscribed to
      await updateDoc(profileRef, { followers: updatedFollowers });

      // Update following for the current user
      await updateDoc(currentUserProfileRef, {
        following: isSubscribed ? arrayRemove(publicationUserID) : arrayUnion(publicationUserID),
      });

      console.log('Updated followers and following successfully!');
    }
  };

  return (
    <div>
      {isSubscribed ? (
        <button className='bg-red-500 text-white md:text-lg text-sm px-3 rounded-md font-semibold w-auto' onClick={handleSubscription}>
          Unsubscribe
        </button>
      ) : (
        <button className='bg-blue-500 text-white text-lg px-3 rounded-md font-semibold w-auto' onClick={handleSubscription}>
          Subscribe
        </button>
      )}
    </div>
  );
};

export default SubscriptionButton;
