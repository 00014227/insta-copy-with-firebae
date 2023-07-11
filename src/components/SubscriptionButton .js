import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where, writeBatch, onSnapshot } from 'firebase/firestore';
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
      const following = profileSnapshot.data().following || [];
      setIsSubscribed(following.includes(auth.currentUser.uid));
    }
  };

  const listenToProfileChanges = () => {
    const db = getFirestore();
    const profileRef = doc(db, 'profile', publicationUserID);
    return onSnapshot(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        const following = snapshot.data().following || [];
        setIsSubscribed(following.includes(auth.currentUser.uid));
      }
    });
  };

  const handleSubscription = async () => {
    const db = getFirestore();
    const profileRef = doc(db, 'profile', publicationUserID);
    const profileSnapshot = await getDoc(profileRef);

    if (profileSnapshot.exists()) {
      const following = profileSnapshot.data().following || [];
      const updatedFollowing = [...following]; // Create a copy of the following array

      if (isSubscribed) {
        // Unsubscribe
        const index = updatedFollowing.indexOf(auth.currentUser.uid);
        if (index > -1) {
          updatedFollowing.splice(index, 1);
        }
        setIsSubscribed(false);
        console.log('Unsubscribed successfully!');
      } else {
        // Subscribe
        updatedFollowing.push(auth.currentUser.uid);
        setIsSubscribed(true);
        console.log('Subscribed successfully!');
      }

      // Update following for other posts by the same user
      const postsQuery = query(collection(db, 'posts'), where('userID', '==', publicationUserID));
      const postsSnapshot = await getDocs(postsQuery);

      if (!postsSnapshot.empty) {
        const batch = writeBatch(db);
        postsSnapshot.forEach((postDoc) => {
          const postRef = doc(db, 'posts', postDoc.id);
          batch.update(postRef, { following: updatedFollowing });
        });

        await batch.commit();
        console.log('Updated following for other posts successfully!');
      }

      // Update following for the profile
      await updateDoc(profileRef, { following: updatedFollowing });
      console.log('Updated following for profile successfully!');
    }
  };

  return (
    <div>
      {isSubscribed ? (
        <button className='bg-red-500 text-white text-lg px-3 rounded-md font-semibold' onClick={handleSubscription}>
          Unsubscribe
        </button>
      ) : (
        <button className='bg-blue-500 text-white text-lg px-3 rounded-md font-semibold' onClick={handleSubscription}>
          Subscribe
        </button>
      )}
    </div>
  );
};

export default SubscriptionButton;