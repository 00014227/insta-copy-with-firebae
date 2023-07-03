import { getFirestore, collection, query, where, getDocs, getDoc, doc, updateDoc, arrayRemove, arrayUnion, deleteDoc } from 'firebase/firestore';
import { getDatabase, ref, get } from 'firebase/database';
import { auth, db, storage } from './firebase'; // Import the Firebase database instance
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { async } from '@firebase/util';

export async function doesUsernameExist(username) {
  const firestore = getFirestore();
  const q = query(collection(firestore, 'users2'), where('username', '==', username.toLowerCase()));
  const querySnapshot = await getDocs(q);

  return querySnapshot.size > 0;
}




export const getPosts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const posts = [];

    querySnapshot.forEach((doc) => {
      const post = doc.data();
      post.id = doc.id; // Include the document ID as part of the post object
      posts.push(post);
    });

    return posts;
  } catch (error) {
    console.log(error);
    return []; // Return an empty array in case of an error
  }
};


export  const handleLike = async (publicationId, updateState, publications) => {
  const db = getFirestore();
  const publicationRef = doc(db, 'posts', publicationId); 

  const publication = publications.find((pub) => pub.id === publicationId);
  const currentLikes = publication.likes || 0;
  const currentUserLiked = (publication.likedBy || []).includes(auth.currentUser.uid);

  if (currentUserLiked) {
    await updateDoc(publicationRef, {
      likes: currentLikes - 1,
      likedBy: arrayRemove(auth.currentUser.uid),
    });

    const updatedPublications = publications.map((pub) => {
      if (pub.id === publicationId) { 
        return {
          ...pub,
          likes: currentLikes - 1,
          likedBy: (pub.likedBy || []).filter((userId) => userId !== auth.currentUser.uid),
        };
      }
      return pub;
    });

    updateState(updatedPublications);
    
  } else {
    await updateDoc(publicationRef, {
      likes: currentLikes + 1,
      likedBy: arrayUnion(auth.currentUser.uid), 
    });

    const updatedPublications = publications.map((pub) => {
      if (pub.id === publicationId) {
        return {
          ...pub,
          likes: currentLikes + 1,
          likedBy: [...(pub.likedBy || []), auth.currentUser.uid],
        };
      }
      return pub;
    });
  
    updateState(updatedPublications);
    
  }
};



// export const handleSubscribe = async (publicationUserID) => {
//   const db = getFirestore();
//   const profileRef = doc(db, 'profile', publicationUserID);
//   const profileSnapshot = await getDoc(profileRef);

//   // Check if the current user is already subscribed
//   const following = profileSnapshot.data().following || []; // Provide a default empty array if `following` is undefined
//   const isSubscribed = following.includes(auth.currentUser?.uid || ''); // Check if `following` is an array and use optional chaining and nullish coalescing to handle undefined or null values

//   if (isSubscribed) {
//     // Unsubscribe
//     const updatedFollowing = following.filter((userId) => userId !== auth.currentUser?.uid);
//     await updateDoc(profileRef, { following: updatedFollowing });
//     console.log('Unsubscribed successfully!');
//   } else {
//     // Subscribe
//     await updateDoc(profileRef, { following: [...following, auth.currentUser?.uid || ''] });
//     console.log('Subscribed successfully!');
//   }
// };
