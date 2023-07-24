import { getFirestore, collection, query, where, getDocs, getDoc, doc, updateDoc, arrayRemove, arrayUnion, deleteDoc } from 'firebase/firestore';

import { auth, db } from './firebase'; 


export async function doesUsernameExist(username) {
  const firestore = getFirestore();
  const q = query(collection(firestore, 'users2'), where('username', '==', username.toLowerCase()));
  const querySnapshot = await getDocs(q);

  return querySnapshot.size > 0;
}


export const fetchCommentsWithUser = async (postId) => {

  const commentsRef = collection(db, 'comments');
  const commentsQuery = query(commentsRef, where('postID', '==', postId));

  const commentsSnapshot = await getDocs(commentsQuery);
  const commentsData = [];

  for (const commentDoc of commentsSnapshot.docs) {
    const comment = commentDoc.data();
    const userDoc = await getDoc(doc(db, 'profile', comment.userID));
    const user = userDoc.exists() ? userDoc.data() : null;

    commentsData.push({ ...comment, user });
  }
  
  return commentsData;
};

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




