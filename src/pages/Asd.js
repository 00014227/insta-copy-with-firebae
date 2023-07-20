// import React, { createContext, useState, useEffect } from 'react';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
// import { getPosts } from '../firebaseFunctions';
// import { useParams } from 'react-router-dom';

// export const AppContext = createContext();

// const cache = {};

// const fetchData = async (cacheKey, fetchFn) => {
//   if (cache[cacheKey]) {
//     return cache[cacheKey];
//   } else {
//     const data = await fetchFn();
//     cache[cacheKey] = data;
//     return data;
//   }
// };

// const fetchProfileData = async (db, userID) => {
//   const profileDocRef = doc(db, 'profile', userID);
//   const profileDoc = await getDoc(profileDocRef);
//   return profileDoc.data();
// };

// const fetchCurrentUserPublications = async (db, userID) => {
//   const currentUserPublicationsRef = collection(db, 'posts');
//   const currentUserPublicationsQuery = query(currentUserPublicationsRef, where('userID', '==', userID));
//   const publicationsSnapshot = await getDocs(currentUserPublicationsQuery);

//   // Fetch current user's data
//   const userDocRef = doc(db, 'profile', userID);
//   const userDoc = await getDoc(userDocRef);
//   const userData = userDoc.data();

//   const currentUserPublications = publicationsSnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//     user: userData, // Include current user's data
//   }));

//   return currentUserPublications;
// };

// const fetchAllPublications = async (db) => {
//   const data = await getPosts();
//   if (data) {
//     const publicationUserPromises = data.map(async (publication) => {
//       const userDocRef = doc(db, 'profile', publication.userID);
//       const userDoc = await getDoc(userDocRef);
//       const userData = userDoc.data();
//       return {
//         ...publication,
//         user: userData,
//       };
//     });
//     const publicationsWithUser = await Promise.all(publicationUserPromises);
//     return publicationsWithUser;
//   } else {
//     return [];
//   }
// };

// const AppProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userProfile, setUserProfile] = useState(null);
//   const [publications, setPublications] = useState(null);
//   const [currentUserPublications, setCurrentUserPublications] = useState([]);
//   const { id } = useParams();

//   const fetchDataForUser = async () => {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (!user) {
//       console.log('User not logged in.');
//       return;
//     }

//     setCurrentUser(user);
//     const db = getFirestore();

//     const profileCacheKey = `profile_${id}`;
//     const profileData = await fetchData(profileCacheKey, () => fetchProfileData(db, id));
//     setUserProfile(profileData);

//     const currentUserPublicationsCacheKey = `publications_${id}`;
//     const currentUserPublicationsData = await fetchData(currentUserPublicationsCacheKey, () =>
//       fetchCurrentUserPublications(db, id)
//     );
//     setCurrentUserPublications(currentUserPublicationsData);
//   };

//   useEffect(() => {
//     const auth = getAuth();
//     onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         fetchDataForUser();
//         const db = getFirestore();

//         const allPublicationsData = await fetchData('allPublications', () => fetchAllPublications(db));
//         setPublications(allPublicationsData);
//       } else {
//         setCurrentUser(null);
//         setUserProfile(null);
//         setCurrentUserPublications([]);
//         setPublications(null);
//       }
//     });
//   }, []);

//   const updateState = (newValue) => {
//     setPublications(newValue);
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         userProfile,
//         publications,
//         currentUserPublications,
//         updateState,
//         setCurrentUserPublications,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export { AppProvider };