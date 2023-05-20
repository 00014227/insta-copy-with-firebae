import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import NavBar from './components/NavBar';
import { getPosts } from './firebaseFunctions';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [publications, setPublications] = useState(null)

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

        // Get publication

        getPosts(async (data) => {
          // Fetch user information for each publication
          const publicationsWithUser = await Promise.all(
            data.map(async (publication) => {
              const userDocRef = doc(db, 'profile', publication.userID);
              const userDoc = await getDoc(userDocRef);
              const userData = userDoc.data();
              return {
                ...publication,
                user: userData,
              };
            })
          );
          
          setPublications(publicationsWithUser);
        });

        
        
        

        // const publicationDocRef = doc(db, 'posts', user.uid);
        // const publicationDoc = await getDoc(publicationDocRef);
        // const publicationData = publicationDoc.data();

        // setPublication(publicationData)
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

    <div className=" bg-gray-100 ">

     
        <BrowserRouter>
        
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/' element={<Home userProfile = {userProfile} publications = {publications} setPublications = {updateState} />} />
      
          </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;
