import { doc, getDoc, getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FollowersModal from '../components/FollowersModal';
import FollowingModal from '../components/FollowingModal';
import NavBar from '../components/NavBar';
import PublicationModal from '../components/PublicationModal';
import { AppContext } from '../contexts/AppContext';

const Profile = () => {
//   const { currentUserPublications } = useContext(AppContext);
  const [userProfile, setUserProfile] = useState(null);
  const [currentUserPublications, setCurrentUserPublications] = useState([]);
  console.log(currentUserPublications)
  const {id} = useParams()
  useEffect(() => {
    const fetchUserProfile = async () => {
      const db = getFirestore();
      const userDocRef = doc(db, 'profile', id);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    };


    const fetchCurrentUserPublications = async () => {
      const db = getFirestore();
    
      // Fetch current user's data
      const userDocRef = doc(db, 'profile', id);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
    
      // Fetch current user's publications
      const userPublicationsRef = collection(db, 'posts');
      const userPublicationsQuery = query(userPublicationsRef, where('userID', '==', id));
      const publicationsSnapshot = await getDocs(userPublicationsQuery);
      const userPublicationsData = publicationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        user: userData
      }));
    
      // Set both user data and user publications in state

      setCurrentUserPublications(userPublicationsData);
    };

    fetchUserProfile()
    fetchCurrentUserPublications()
  }, [id]);

  if (!userProfile || !currentUserPublications) {
    return (
      <div class="h-screen bg-white">
        <div class="flex justify-center items-center h-full">
          <img
            className="h-16 w-16"
            src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
            alt=""
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-10">
      <NavBar imageUrl={userProfile.imageUrl} />

      <div className=" max-w-5xl mx-auto px-8">
        <header className=" mt-12">
          <div className="flex mt:gap-28 gap-10">
            {userProfile.imageUrl && (
              <img
                className=" rounded-full md:w-48 md:h-48 w-24 h-24"
                src={userProfile.imageUrl}
                alt="Profile"
              />
            )}
            <div className="">
              <div className="md:flex gap-3 my-auto">
                <p className=" text-2xl my-auto">{userProfile.username}</p>
                <div className="mt-8">
                  <button className=" bg-gray-300 pr-4 pl-4 pt-2 pb-2 text-xl font-semibold rounded-xl">
                    Режактировать профиль
                  </button>
                  <button className=" bg-gray-300 pr-4 pl-4 pt-2 pb-2 text-xl font-semibold rounded-xl mt-4">
                    Отправить сообщения
                  </button>
                </div>
              </div>

              <div className="flex gap-14 mt-8">
                <div className="flex gap-1">
                  <span className=" text-lg font-semibold">{currentUserPublications.length}</span>
                  <p className="text-lg">публикаций</p>
                </div>

                <FollowersModal userProfile={userProfile} />

                <FollowingModal userProfile={userProfile} />
              </div>

              <p className=" text-lg font-semibold mt-7">{userProfile.name}</p>
            </div>
          </div>
        </header>

        {/* Menu */}

        <div className="flex border-t border-gray-300 mt-14  justify-center gap-16 pt-5 pb-5">
          <p>ПУБЛИКАЦИИ</p>
          <p>REELS</p>
          <p>СОХРАНЕННОЕ</p>
          <p>ОТМЕТКИ</p>
        </div>

        <div className="md:flex md:grid w-96 gap-1 grid-cols-3   ">
          <PublicationModal publications={currentUserPublications} userProfile={userProfile} setCurrentUserPublications={setCurrentUserPublications}/>
        </div>
      </div>
    </div>
  );
};

export default Profile;
