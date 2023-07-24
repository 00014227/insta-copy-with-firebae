import { async } from '@firebase/util';
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase';
import PublicationForm from './PublicationForm';
import firebase from 'firebase/compat/app'

const ModalHeading = () => {
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState({isLargeScreen: false})
  const [bodyVisibility, setBodyVisibility] = useState(false)
  const [loading, setLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);
  const [like, setLike] = useState(0);
  const [inputs, setInputs] = useState({
    id: 0,
    name: '',
    profile_img: null,
    place: '',
    image: null,
    description: '',
    liked: false
  });

  const onDescriptionChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const onPlaceChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleUploadFile = (event) => {
    const uploadedFile = event.target.files[0];
    setInputs({ ...inputs, image: uploadedFile });

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
      setBodyVisibility(true);
    };
    reader.readAsDataURL(uploadedFile);
  };



  const submit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true)
      const userID = getAuth().currentUser.uid;
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${userID}/${inputs.image.name}`);
      await uploadBytes(storageRef, inputs.image); // Upload the file

      const downloadURL = await getDownloadURL(storageRef); // Get the download URL

      // Create a new post document within the "posts" collection
      const newPostRef = await addDoc(collection(db, 'posts'), {
        userID: userID,
        place: inputs.place,
        description: inputs.description,
        imageUrl: downloadURL,
        like: 0,
        dateCreated: new Date()
      });

      // setPublications((prevPublications) => [...prevPublications, newPostRef]);

      // Retrieve the newly created post document to obtain its ID
      const newPostDoc = await getDoc(newPostRef);
      const newPostID = newPostDoc.id;

      setLoading(false)
      console.log('New post created with ID:', newPostID);
      setShowModal(false)
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  };

  const formVisibility = () => {
    const isLargeScreen = window.innerWidth >= 768;

    if (!isLargeScreen) {
      setShowModal2({isLargeScreen: true});
    }
  }

  return (
    <>


      <div
        className="  flex gap-6 md:mt-11 pl-2 pt-3 pb-3 rounded-xl  hover:bg-gray-300 text-xl md:w-full"
        type="button"
        onClick={() => setShowModal(true)}
      >
        <svg aria-label="Новая публикация" class="_ab6-" color="rgb(0, 0, 0)" fill="rgb(0, 0, 0)" height="34" role="img" viewBox="0 0 24 24" width="34"><path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line></svg>
        <p className='hidden xl:block'>Создать</p>
      </div>

      {showModal ? (

        <>

          
            <div

            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className=" relative w-full  my-6 mx-auto max-w-6xl ">
              <button
                className=' right-11 text-3xl'
                onClick={() => setShowModal(false)}>X</button>
              {/*content*/}
              <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                {/*header*/}
                <div className="flex items-start justify-between p-2 border-b border-solid border-slate-200 rounded-t">
                  {bodyVisibility ? (
                    <button className='my-auto' onClick={() => setBodyVisibility(false)}>
                      <svg aria-label="Назад" class="x1lliihq x1n2onr6" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Назад</title><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="2.909" x2="22.001" y1="12.004" y2="12.004"></line><polyline fill="none" points="9.276 4.726 2.001 12.004 9.276 19.274" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline></svg>
                    </button>
                  ) : null}
                  <h3 className="text-3xl font-semibold text-center">
                    Создание публикации
                  </h3>
                  <button onClick={() => formVisibility()} className=' text-blue-600 text-lg my-auto'>
                    Next
                  </button>
                </div>
                {/*body*/}

              {loading ? (
                <div class=" bg-white">
                <div class="flex justify-center items-center h-full py-48">
                  <img
                    className="h-16 w-16"
                    src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
                    alt=""
                  />
                </div>
              </div>
              ) : (
                <div className='flex flex-row'>
                {bodyVisibility ?
                  (imageUrl && <img className=' max-w-4xl w-full' src={imageUrl} />)
                  :
                  (
                    <div className="flex flex-col justify-center items-center py-72 w-full">
                      
                      <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg aria-label="Значок, соответствующий медиафайлам, например изображениям или видео" class="x1lliihq x1n2onr6" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><title>Значок, соответствующий медиафайлам, например изображениям или видео</title><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path></svg>
                          <span>Перетащите сюда фото и видео</span>
                        </div>
                        <input onChange={handleUploadFile} id="dropzone-file" type="file" class="hidden" />
                        <button>Выбрать из компа</button>
                      </label>
                    </div>)
                }
                {/* inputs block */}
                {showModal2 && (
                    <PublicationForm

                    place={inputs.place} onPlaceChange={onPlaceChange}
                    description={inputs.description} onDescriptionChange={onDescriptionChange}
  
                    onSubmit={submit} />
                )}
                
              </div>
              )}
             

              </div>



            </div>



          </div>
      

          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>


        </>
      ) : null}
    </>


  );
};

export default ModalHeading;
