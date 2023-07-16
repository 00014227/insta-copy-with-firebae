import { async } from '@firebase/util';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import FollowersModal from '../components/FollowersModal';
import FollowingModal from '../components/FollowingModal';
import NavBar from '../components/NavBar';
import PublicationModal from '../components/PublicationModal';
import { AppContext } from '../contexts/AppContext';

const Profile = () => {

    const { userProfile, currentUserPublications } = useContext(AppContext)



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
        <div className='flex'>
            <NavBar />

            <div className=' max-w-5xl mx-auto'>
                <header className=' mt-12'>
                    <div className='flex gap-28'>

                        {userProfile.imageUrl && <img className=' rounded-full w-52 h-52 ' src={userProfile.imageUrl} alt="Profile" />}
                        <div className=''>
                            <div className='flex gap-3 my-auto'>
                                <p className=' text-2xl my-auto'>{userProfile.username}</p>
                                <button className=' bg-gray-300 pr-4 pl-4 pt-2 pb-2 text-xl font-semibold rounded-xl'>Режактировать профиль</button>
                                <button className=' bg-gray-300 pr-4 pl-4 pt-2 pb-2 text-xl font-semibold rounded-xl'>Отправить сообщения</button>
                            </div>

                            <div className='flex gap-14 mt-8'>
                                <div className='flex gap-1'>
                                    <span className=' text-lg font-semibold'>{currentUserPublications.length}</span>
                                    <p className='text-lg'>публикаций</p>
                                </div>

                                <FollowersModal userProfile = {userProfile}/>

                               <FollowingModal userProfile = {userProfile}/>
                            </div>

                            <p className=' text-lg font-semibold mt-7'>{userProfile.name}</p>
                        </div>
                    </div>
                </header>

                {/* Menu */}

                <div className='flex border-t border-gray-300 mt-14  justify-center gap-16 pt-5 pb-5'>
                    <p>ПУБЛИКАЦИИ</p>
                    <p>REELS</p>
                    <p>СОХРАНЕННОЕ</p>
                    <p>ОТМЕТКИ</p>
                </div>
                
                <div className='flex grid gap-1 grid-cols-3 '>
                   

                <PublicationModal publications = {currentUserPublications} />

                </div>
            </div>
        </div>
    );
};

export default Profile;