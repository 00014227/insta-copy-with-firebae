import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, batchGetDocs, getDoc } from 'firebase/firestore';
import { getPosts } from '../firebaseFunctions';



export const AppContext = createContext();

const cache = {};



const fetchAllPublications = async (db, setPublications) => {
  try {
    const data = await getPosts(); // Assuming getPosts is an efficient function to fetch publications

    if (data && data.length > 0) {
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
  } catch (error) {
    // Handle any errors here
    console.error('Error fetching publications:', error);
    setPublications([]);
  }
};



const AppProvider = ({ children }) => {


  const [publications, setPublications] = useState(null);
console.log(publications)


  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
  

        const db = getFirestore();

    

     

        // Get all publications
        await fetchAllPublications(db, setPublications);
      } else {
    
        setPublications(null);
      }
    });
  }, []);

  const updateState = (newValue) => {
    setPublications(newValue);
  };

  return (
    <AppContext.Provider value={{  publications, updateState }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };