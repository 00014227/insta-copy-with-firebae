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
    console.log(userProfile, 'nnnnnnnnnnnnnnn')


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
        <div className='flex gap-10'>
            <NavBar imageUrl={userProfile.imageUrl}/>

            <div className=' max-w-5xl mx-auto px-8'>
                <header className=' mt-12'>
                    <div className='flex mt:gap-28 gap-10'>

                        {userProfile.imageUrl && <img className=' rounded-full md:w-48 md:h-48 w-24 h-24' src={userProfile.imageUrl} alt="Profile" />}
                        <div className=''>
                            <div className='md:flex gap-3 my-auto'>
                                <p className=' text-2xl my-auto'>{userProfile.username}</p>
                                <div className='mt-8'>
                                <button className=' bg-gray-300 pr-4 pl-4 pt-2 pb-2 text-xl font-semibold rounded-xl'>Режактировать профиль</button>
                                <button className=' bg-gray-300 pr-4 pl-4 pt-2 pb-2 text-xl font-semibold rounded-xl mt-4'>Отправить сообщения</button>
                                </div>
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
                
                <div className='md:flex md:grid w-96 gap-1 grid-cols-3   '>
                   
            
                <PublicationModal publications = {currentUserPublications} />
            
                </div>
            </div>
        </div>
    );
};

export default Profile;