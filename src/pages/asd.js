import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getPosts } from '../firebaseFunctions';

export const AppContext = createContext()



const AppProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [publications, setPublications] = useState(null)
    const [currentUserPublications, setCurrentUserPublications] = useState([])

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);

                const db = getFirestore();
                // Get user
                const profileDocRef = doc(db, 'profile', user.uid);
                const profileDoc = await getDoc(profileDocRef);
                const profileData = profileDoc.data();
                setUserProfile(profileData);

                // Get current user publication to profile

                const currentUserPublicationsRef = collection(db, 'posts');
                const querySnapshot = await query(currentUserPublicationsRef, where('userID', '==', user.uid));
                const publicationsSnapshot = await getDocs(querySnapshot);
                const currentUserPublications = publicationsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setCurrentUserPublications(currentUserPublications)

                // Get publications
                getPosts(async (data) => {
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
                  });
            } else {
                setCurrentUser(null);
                setUserProfile(null);
            }
        });
    }, []);


    
    const updateState = (newValue) => {
        setPublications(newValue);
    };
    return (
        <AppContext.Provider
            value={{ userProfile, publications, currentUserPublications, updateState }}
        >
            {children}
        </AppContext.Provider>
    );
};

export {AppProvider};