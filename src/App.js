import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs, collection, where, query } from 'firebase/firestore';
import NavBar from './components/NavBar';
import { getPosts } from './firebaseFunctions';
import Profile from './pages/Profile';

function App() {
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

      // ...
    } else {
      setCurrentUser(null);
      setUserProfile(null);
    }
  });
}, []);


console.log(currentUserPublications)
  const updateState = (newValue) => {
    setPublications(newValue);
  };

  return (

    <div className=" bg-white">

     
        <BrowserRouter>
        
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/' element={<Home userProfile = {userProfile} publications = {publications} setPublications = {updateState} />} />
            <Route path='/profile' element={<Profile userProfile = {userProfile} currentUserPublications = {currentUserPublications}/>} />
          </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;
