import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { auth, db } from '../firebase';
import { deletePosts, fetchCommentsWithUser, handleLike } from '../firebaseFunctions';
import { getAuth } from 'firebase/auth';
import {
  addDoc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,

  deleteDoc,
} from 'firebase/firestore';
import SubscriptionButton from './SubscriptionButton ';
import LikeModalList from './LikeModalList';

const PublicationModal = ({ publications, publication1, userProfile, setCurrentUserPublications }) => {

  const [showModal, setShowModal] = useState({ isLargeScreen: false, imageUrl: null });

  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateState } = useContext(AppContext);
  const [currentPublicationId, setCurrentPublicationId] = useState(null);
  const [comments, setComments] = useState([]);


  const [isBlockVisible, setIsBlockVisible] = useState(true);
  const [showBlock2, setShowBlock2] = useState(false);

  const onCommentChange = (event) => {
    setComment(event.target.value);
  };
  
  const currentUser = auth.currentUser;
  const deletePost = async (publicationId) => {
    console.log(publicationId, 'ssssssssss')
    try {
      const auth = getAuth();
  
  
      if (!currentUser) {
        console.log('User not logged in');
        return;
      }
  
      const db = getFirestore();
      const publicationDoc = doc(db, 'posts', publicationId);
      const publicationSnapshot = await getDoc(publicationDoc);
  
      if (!publicationSnapshot.exists()) {
        console.log('Publication not found');
        return;
      }
  
      const publicationData = publicationSnapshot.data();
  
      if (!publicationData) {
        console.log('Publication data not found');
        return;
      }
  
      if (publicationData.userID !== currentUser.uid) {

        return;
      }
  
      await deleteDoc(publicationDoc);
  
      const updatedPublications = publications.filter((publication) => publication.id !== publicationId);
      setCurrentUserPublications(updatedPublications);
  
      console.log('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleShowModal = (publication) => {

    setCurrentPublicationId(publication.id);



  };

  const loadComments = async (postId) => {
    setIsLoading(true);

    try {
      const commentsWithUser = await fetchCommentsWithUser(postId);
      setComments(commentsWithUser);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }

    setIsLoading(false);
  };

  const SubmitComment = async (event, postID) => {
    event.preventDefault();

    try {
      const userID = getAuth().currentUser.uid;

      const newCommentRef = await addDoc(collection(db, 'comments'), {
        userID: userID,
        commentText: comment,
        postID: postID,
      });

      const newCommentData = {
        id: newCommentRef.id,
        userID: userID,
        commentText: comment,
        postID: postID,
        user: userProfile, // Assuming userProfile contains the necessary user information
      };

      setComments((prevComments) => [...prevComments, newCommentData]);
      setComment(''); // Clear the comment input field after submitting

      console.log('Comment was successfully sent');
    } catch (error) {
      console.log(error);
    }
  };




  const handleButtonClick = (blockNumber, imageUrl) => {

    const isLargeScreen = window.innerWidth >= 768;

    if (blockNumber === 1) {
      setShowModal({isLargeScreen: true, imageUrl});
      setShowBlock2(false);
    } else {

      setShowModal({ isLargeScreen, imageUrl });

      setShowBlock2(true)

      if (!isLargeScreen) {
        setIsBlockVisible(false);
      }

    }
  };

  // Merge both publications arrays into one array for rendering
  const renderedPublications = publication1 ? [publication1, ...publications] : [...publications];

  return (
    <>
      {publication1 && (
        <button
     
          onClick={() => {
            handleButtonClick(1, publication1.imageUrl); // Move handleButtonClick before loadComments
            loadComments(publication1.id);
          }}
        >
          <svg
            aria-label="Комментировать"
            className="x1lliihq x1n2onr6" // Replace 'class' with 'className'
            color="rgb(38, 38, 38)"
            fill="rgb(38, 38, 38)"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <title>Комментировать</title>
            <path
              d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
        </button>
      )}

      {renderedPublications.map((publication) => (

        <div key={publication.id} >
          {isBlockVisible && publication.imageUrl && !publication1 && (
            <div
              id="button2"
              type="button"
              onClick={() => {
                handleShowModal(publication);

                handleButtonClick(2, publication.imageUrl)
              }}
              className="max-w-80 max-h-80 cursor-pointer"
            >
              {publication.imageUrl && (
                <img className='w-80 h-auto' src={publication.imageUrl} alt="Profile" />
              )}
            </div>
          )}

          {showModal.isLargeScreen && (
            <div className="">

              <div className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-80% ">
                <div className="relative w-full my-6 mx-auto max-w-70%">


                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none md:h-auto h-screen">
                    {/*body*/}
                    <div className="flex flex-row">
                      <img className="max-w-60% hidden md:block xl:h-80vh h-40vh xl:w-full w-40%" src={showModal.imageUrl} />
                      <div className='  xl:w-40%  w-full '>
                        <div className='flex justify-between border-b border-gray-300 pt-4 pb-4 pl-6  '>
                          <div className="flex gap-6 ">
                            {publication.user.imageUrl && (
                              <img className="rounded-full w-10 h-10 hidden md:block" src={publication.user.imageUrl} alt="Profile" />
                            )}
                            <p className="font-semibold  text-lg my-auto hidden md:block">{publication.user.username}</p>

                          </div>
                          {currentUser && currentUser.uid === publication.userID && (
                               <button
                               onClick={() => deletePost(currentPublicationId)}
                               className=' text-red-500 text-lg mr-6 hidden md:block'>Delete</button>
                          )}
                       

                          <h3 className=' visible md:hidden text-center'>Коментарии</h3>
                          <button className="right-11 text-3xl" onClick={() => setShowModal(false)}>
                            X
                          </button>
                        </div>

                        <div className="border-b border-gray-300 pt-4 pb-4 pl-6 md:h-80">
                          <div className="h-full overflow-auto">
                            {isLoading ? (
                              <p>Loading comments...</p>
                            ) : (
                              comments.map((comment) => (
                                <div className="flex gap-6" key={comment.id}>
                                  {comment.user && comment.user.imageUrl && (
                                    <img className="rounded-full w-8 h-8 xl:w-12 xl:h-12 mt-1" src={comment.user.imageUrl} alt="Profile" />
                                  )}
                                  {comment.user && <p className="text-base sm:text-lg font-semibold">{comment.user.username}</p>}
                                  <p className="justify-end text-sm xl:text-base">{comment.commentText}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 hidden md:block">
                          <button onClick={() => handleLike(publication.id, updateState, publications)}>
                            {(publication.likedBy || []).includes(auth.currentUser.uid) ? (
                              <svg
                                aria-label="Не нравится"
                                class="x1lliihq x1n2onr6"
                                color="rgb(255, 48, 64)"
                                fill="rgb(255, 48, 64)"
                                height="24"
                                role="img"
                                viewBox="0 0 48 48"
                                width="24"
                              >
                                <title>Не нравится</title>
                                <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12.0 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                              </svg>
                            ) : (
                              <svg
                                aria-label="Нравится"
                                class="x1lliihq x1n2onr6"
                                color="rgb(38, 38, 38)"
                                fill="rgb(38, 38, 38)"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <title>Нравится</title>
                                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                              </svg>
                            )}
                          </button>
                          <button onClick={() => loadComments(publication.id)}>
                            <svg
                              aria-label="Комментировать"
                              class="x1lliihq x1n2onr6"
                              color="rgb(38, 38, 38)"
                              fill="rgb(38, 38, 38)"
                              height="24"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24"
                            >
                              <title>Комментировать</title>
                              <path
                                d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                                fill="none"
                                stroke="currentColor"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              ></path>
                            </svg>
                          </button>

                          <button>
                            <svg
                              aria-label="Поделиться публикацией"
                              class="x1lliihq x1n2onr6"
                              color="rgb(38, 38, 38)"
                              fill="rgb(38, 38, 38)"
                              height="24"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24"
                            >
                              <title>Поделиться публикацией</title>
                              <line
                                fill="none"
                                stroke="currentColor"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                x1="22"
                                x2="9.218"
                                y1="3"
                                y2="10.083"
                              ></line>
                              <polygon
                                fill="none"
                                points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                                stroke="currentColor"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              ></polygon>
                            </svg>
                          </button>
                        </div>

                        <div className="flex hidden md:block">
                          <span>{publication.likes}</span>
                          <p>отметок "Нравится"</p>
                        </div>
                        <div className='flex flex-col md:flex-row items-center md:border-t md:border-gray-300 my-auto'>
                          <textarea
                            value={comment}
                            onChange={onCommentChange}
                            rows='2'
                            cols='60'
                            name='comment'
                            form='usrform'
                            className='focus:outline-none resize-none w-full xl:w-auto md:mr-4 mb-2 md:mb-0'
                            placeholder='Добавьте коментарий'
                          />
                          <button
                            onClick={(event) => SubmitComment(event, publication.id)}
                            className='mr-4 text-blue-400 font-semibold xl:text-xl text-xs'
                          >
                            Опубликовать
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </div>
          )}

          {showBlock2 && (
            <div className="md:hidden ">
              <article
                key={publication.id}
                className="border-b border-solid mt-3 mx-auto ">
                <div className="flex justify-between">
                  <div className='flex gap-3'>

                    {publication.user.imageUrl && (
                      <img
                        className="rounded-full w-12 h-12"
                        src={publication.user.imageUrl}
                        alt="Profile"
                      />
                    )}

                    <div className=' justify-between'>
                      <p className="">{publication.user.name}</p>
                      <p>{publication.place}</p>
                    </div>
                  </div>
                  <div>
                    <SubscriptionButton publicationUserID={publication.userID} publicationID={publication.id} />
                  </div>
                </div>
                {publication.imageUrl && (
                  <img className="mt-4 w-full" src={publication.imageUrl} alt="Profile" />
                )}

                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleLike(publication.id, updateState, publications)}>
                    {(publication.likedBy || []).includes(auth.currentUser.uid) ? (
                      <svg
                        aria-label="Не нравится"
                        class="x1lliihq x1n2onr6"
                        color="rgb(255, 48, 64)"
                        fill="rgb(255, 48, 64)"
                        height="24"
                        role="img"
                        viewBox="0 0 48 48"
                        width="24"
                      >
                        <title>Не нравится</title>
                        <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12.0 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                      </svg>
                    ) : (
                      <svg
                        aria-label="Нравится"
                        class="x1lliihq x1n2onr6"
                        color="rgb(38, 38, 38)"
                        fill="rgb(38, 38, 38)"
                        height="24"
                        role="img"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <title>Нравится</title>
                        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                      </svg>
                    )}
                  </button>
                  <PublicationModal showAlternateElement={true} publications={publications} publication1={publication} />

                  <button>
                    <svg
                      aria-label="Поделиться публикацией"
                      class="x1lliihq x1n2onr6"
                      color="rgb(38, 38, 38)"
                      fill="rgb(38, 38, 38)"
                      height="24"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <title>Поделиться публикацией</title>
                      <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        x1="22"
                        x2="9.218"
                        y1="3"
                        y2="10.083"
                      ></line>
                      <polygon
                        fill="none"
                        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></polygon>
                    </svg>
                  </button>
                </div>
                <div className="flex">
                  <span>{publication.likes}</span>
                  <LikeModalList publication={publication} />
                  {/* <p>отметок "Нравится"</p> */}
                </div>

                <div className="flex gap-4">
                  <p className="font-medium">{userProfile.name}</p>
                  <p>{publication.description}</p>
                </div>
              </article>
            </div>)}
        </div>
      ))}
    </>
  );
};

export default PublicationModal;
