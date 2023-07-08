import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { getFirestore, doc, getDoc, query, collection, where, getDocs, writeBatch } from 'firebase/firestore';
import SubscriptionButton from './SubscriptionButton ';


const LikeModalList = ({ publication }) => {
    const [showModal, setShowModal] = useState(false);
    const [likedUsers, setLikedUsers] = useState([]);

    const db = getFirestore();

    useEffect(() => {
        if (publication && publication.likedBy && publication.likedBy.length > 0) {
            // Fetch liked users for the publication
            const fetchLikedUsers = async () => {
                const likedUsersPromises = publication.likedBy.map(async (userId) => {
                    const userRef = doc(db, 'profile', userId);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        return userDoc.data();
                    }
                    return null;
                });

                const likedUsersData = await Promise.all(likedUsersPromises);
                setLikedUsers(likedUsersData.filter((user) => user !== null));
            };

            fetchLikedUsers();

        }
    }, [publication, db]);

    console.log(likedUsers)



    return (
        <>
            <button
                className=""
                type="button"
                onClick={() => setShowModal(true)}
            >
                Отметок "Нравится"
            </button>

            {showModal && (
                <>
                    {/* Modal content */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-4">
                            <div className='flex gap-20 my-auto'>
                                <h3 className="text-2xl font-semibold mb-4">Отметки "Нравится"</h3>

                                <button className=' mb-6 text-3xl '
                                    onClick={() => setShowModal(false)}>X</button>
                            </div>
                            {likedUsers.length > 0 ? (
                                likedUsers.map((user) => (
                                    <div key={user.userID} className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            {user.imageUrl && (
                                                <img className="rounded-full w-12 h-12" src={user.imageUrl} alt="Profile" />
                                            )}
                                            <div>
                                                <p>{user.name}</p>
                                            </div>
                                        </div>
                                        <SubscriptionButton publicationUserID={publication.userID} />
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

export default LikeModalList;
