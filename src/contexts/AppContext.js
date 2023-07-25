import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, batchGetDocs, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getPosts } from '../firebaseFunctions';


export const AppContext = createContext();

const ITEMS_PER_PAGE = 3;

const fetchAllPublications = async (page, existingPublications) => {
  try {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const data = await getPosts();

    const publications = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const publicationUserPromises = publications.map(async (publication) => {
      const userDocRef = doc(db, 'profile', publication.userID);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      return {
        ...publication,
        user: userData,
      };
    });

    const publicationsWithUser = await Promise.all(publicationUserPromises);
    return [...existingPublications, ...publicationsWithUser];
  } catch (error) {
    console.error('Error fetching publications:', error);
    return existingPublications;
  }
};

const AppProvider = ({ children }) => {
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAllPublications(page, publications).then((newPublications) => {
      setPublications(newPublications);
    });
  }, [page]);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // Check if the user is near the end of the content
    if (scrollHeight - (scrollTop + clientHeight) < 100) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const updateState = (newValue) => {
    setPublications(newValue);
  };

  return (
    <AppContext.Provider value={{ publications, updateState }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };
