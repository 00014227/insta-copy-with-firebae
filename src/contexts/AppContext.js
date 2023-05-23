import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getPosts } from '../firebaseFunctions';

export const AppContext = createContext();

const cache = {};

const fetchData = async (cacheKey, fetchFn) => {
  if (cache[cacheKey]) {
    // If data exists in the cache, return it
    return cache[cacheKey];
  } else {
    // If data doesn't exist in the cache, fetch it and store it in the cache
    const data = await fetchFn();
    cache[cacheKey] = data;
    return data;
  }
};

const fetchAllPublications = async (db, setPublications) => {
  const data = await getPosts();
  if (data) {
    const publicationUserPromises = data.map(async (publication) => {
      const userDocRef = doc(db, 'profile', publication.userID);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      return {
        ...publication,
        user: userData,
      };
    });
    const publicationsWithUser = await Promise.all(publicationUserPromises);
    setPublications(publicationsWithUser);
  } else {
    setPublications([]);
  }
};

const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [publications, setPublications] = useState(null);
  const [currentUserPublications, setCurrentUserPublications] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        const db = getFirestore();

        // Get user profile
        const profileCacheKey = `profile_${user.uid}`;
        const fetchProfile = async () => {
          const profileDocRef = doc(db, 'profile', user.uid);
          const profileDoc = await getDoc(profileDocRef);
          return profileDoc.data();
        };
        const profileData = await fetchData(profileCacheKey, fetchProfile);
        setUserProfile(profileData);

        // Get current user publications
        const currentUserPublicationsRef = collection(db, 'posts');
        const currentUserPublicationsQuery = query(currentUserPublicationsRef, where('userID', '==', user.uid));
        const publicationsCacheKey = `publications_${user.uid}`;
        const fetchPublications = async () => {
          const publicationsSnapshot = await getDocs(currentUserPublicationsQuery);
          return publicationsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        };
        const currentUserPublicationsData = await fetchData(publicationsCacheKey, fetchPublications);
        setCurrentUserPublications(currentUserPublicationsData);

        // Get all publications
        await fetchAllPublications(db, setPublications);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setCurrentUserPublications(null);
        setPublications(null);
      }
    });
  }, []);

  const updateState = (newValue) => {
    setPublications(newValue);
  };

  return (
    <AppContext.Provider value={{ userProfile, publications, currentUserPublications, updateState }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };
