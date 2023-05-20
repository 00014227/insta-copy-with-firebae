import { getFirestore, collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { getDatabase, ref, get } from 'firebase/database';
import { auth, db, storage } from './firebase'; // Import the Firebase database instance
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';

export async function doesUsernameExist(username) {
  const firestore = getFirestore();
  const q = query(collection(firestore, 'users2'), where('username', '==', username.toLowerCase()));
  const querySnapshot = await getDocs(q);

  return querySnapshot.size > 0;
}



export const getPosts = async (setPublications) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      post.id = doc.id; // Include the document ID as part of the post object
      posts.push(post);
    });
    
   
    setPublications(posts)
    
    // Process the posts data as needed
    
  } catch (error) {
    console.log(error);
  }
};
