import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import SubscriptionButton from './SubscriptionButton ';

const FollowingModal = ({userProfile}) => {
   
    const [showModal, setShowModal] = useState(false);
    const [followingUsers, setFollowingUsers] = useState([]);


    const db = getFirestore();

    useEffect(() => {
    
            // Fetch liked users for the publication
            const fetchFollowingUsers = async () => {
                const followngUsersPromises = userProfile.following.map(async (userId) => {
                    const userRef = doc(db, 'profile', userId);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        return { id: userId, data: userDoc.data() };
                    }
                    return null;
                });

                const followingUsersData = await Promise.all(followngUsersPromises);
                const filteredFollowingUsers = followingUsersData.filter((user) => user !== null);
                setFollowingUsers(filteredFollowingUsers);
          

               
        }

        fetchFollowingUsers();
    }, [userProfile, db]);




    return (
        <>
            <button 
            onClick={() => setShowModal(true)}
            className='flex gap-1'>
                <span className=' text-lg font-semibold'>{userProfile.following.length}</span>
                <p className='text-lg'>подписок</p>
            </button>

            {showModal && (
                <>
                    {/* Modal content */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-4  md:w-auto md:h-auto w-screen h-screen">
                            <div className='flex gap-20 my-auto'>
                                <h3 className="text-2xl font-semibold mb-4">Ваши подписки</h3>

                                <button className=' mb-6 text-3xl '
                                    onClick={() => setShowModal(false)}>X</button>
                            </div>
                            {followingUsers.length > 0 ? (
                                followingUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            {user.data.imageUrl && (
                                                <img className="rounded-full w-12 h-12" src={user.data.imageUrl} alt="Profile" />
                                            )}
                                            <div>
                                                <p>{user.data.name}</p>
                                            </div>
                                        </div>
                                        <SubscriptionButton publicationUserID={user.id} />
                                        
                                    </div>
                                ))
                            ) : (
                                <p>No likes for this publication</p>
                            )}

                        </div>
                    </div>

                    {/* Modal overlay */}
                    <div
                        className="fixed inset-0 z-40 bg-black opacity-25"
                        onClick={() => setShowModal(false)}
                    ></div>
                </>
            )}
        </>
    );

};

export default FollowingModal;