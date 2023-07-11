import { async } from '@firebase/util';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { auth } from '../firebase';
import { deletePosts, handleLike } from '../firebaseFunctions';

const PublicationModal = ({ showAlternateElement, publications, publication1 }) => {
  const [showModal, setShowModal] = useState(null)
  const [comment, setComment] = useState('')
  const [bodyVisibility, setBodyVisibility] = useState(false)
  const { userProfile, updateState } = useContext(AppContext)



  console.log(publications)

  const onCommentChange = (event) => {
    setComment(event.target.value)
  }


  const deletePost = async (publicationId) => {
    console.log(publicationId)
    //   try {
    //     const db = getFirestore();
    //     await deleteDoc(doc(db, 'posts', publicationId));

    //     // Remove the deleted post from the publications array
    //     const updatedPublications = publications.filter((publication) => publication.id !== publicationId);
    //     setpublications(updatedPublications);

    //     console.log('Post deleted successfully!');
    //   } catch (error) {
    //     console.error('Error deleting post:', error);
    //   }
  };


  const SubmitComment = async (postID) => {
    console.log(postID)
    //   event.preventDefault();

    //   try {
    //     const userID = getAuth().currentUser.uid;

    //     const newCommentRef = await addDoc(collection(db, 'comments'), {
    //       userID: userID,
    //       commentText: comment,

    //     })
    //   } catch (error) {

    //   }
  }

  // Check if publications array is defined before mapping over it
  let renderedPublications = Array.isArray(publications) ? publications : [];

  return (
    <>

      <button onClick={() => setShowModal(publication1.imageUrl)}>
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

      {renderedPublications.map((publication) => {
        return (
          <div >

            {showAlternateElement ? (
              null
            ) : (
              <div
                type="button"
                onClick={() => setShowModal(publication.imageUrl)}

                className=' w-80 h-80 cursor-pointer'>

                {publication.imageUrl && (
                  <img className='w-full h-full' src={publication.imageUrl} alt="Profile" />
                )}

                <p>{publication.id}</p>
              </div>
            )}


            {showModal ? (
              <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-80% ">
                  <div className="relative w-full my-6 mx-auto max-w-70%">

                    <button className="right-11 text-3xl" onClick={() => setShowModal(false)}>
                      X
                    </button>
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*body*/}
                      <div className="flex flex-row">
                        <img className="max-w-60% h-80vh w-full" src={showModal} />
                        <div className='w-full'>
                          <div className='flex justify-between border-b border-gray-300 pt-4 pb-4 pl-6 '>
                            <div className="flex gap-6">
                              {userProfile.imageUrl && (
                                <img className="rounded-full w-10 h-10" src={userProfile.imageUrl} alt="Profile" />
                              )}
                              <p className="font-semibold  text-lg my-auto">{userProfile.username}</p>

                            </div>
                            <button
                              onClick={() => deletePost(publication.id)}
                              className=' text-red-500 text-lg mr-6'>Delete</button>
                          </div>

                          <div className="flex  gap-6 border-b border-gray-300 pt-4 pb-4 pl-6 h-80%">
                            {userProfile.imageUrl && (
                              <img className="rounded-full w-10 h-10" src={userProfile.imageUrl} alt="Profile" />
                            )}
                            <p className="text-lg font-semibold">{userProfile.username}</p>
                            <p className=' justify-end'>The sexy boy</p>
                          </div>
                          <p>{publication.id}</p>
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
                            <button>
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

                          <div className="flex">
                            <span>{publication.likes}</span>
                            <p>отметок "Нравится"</p>
                          </div>
                          <div className='flex border-t border-gray-300 justify-between my-auto'>
                            <textarea
                              value={comment}
                              onChange={onCommentChange}
                              rows="2" cols="60" name="comment" form="usrform" className='focus:outline-none' placeholder='Добавьте коментарий'>
                            </textarea>
                            <button onClick={() => SubmitComment(publication.id)} className=' mr-8 text-blue-400 font-semibold text-xl'>Опубликовать</button>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </>
            ) : null}
          </div>
        )
      })}


    </>
  );
};

export default PublicationModal;