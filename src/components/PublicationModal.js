import React, { useState } from 'react';

const PublicationModal = () => {
    const [showModal, setShowModal] = useState(false) 
    const [showModal2, setShowModal2] = useState(false)
    const [bodyVisibility, setBodyVisibility] = useState(false)

    return (
        <>
   
      
      <button
        className="flex gap-6 mt-11 pl-2 pt-3 pb-3 rounded-xl  hover:bg-gray-300 text-xl w-full" 
        type="button"
        onClick={() => setShowModal(true)}
      >
        <svg aria-label="Новая публикация" class="_ab6-" color="rgb(0, 0, 0)" fill="rgb(0, 0, 0)" height="34" role="img" viewBox="0 0 24 24" width="34"><path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line></svg>
        Создать
      </button>
    
      {showModal ? (
        <>
          <div

            className="justify-center    items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className=" relative w-full   my-6 mx-auto  max-w-70%">
            <button 
            className=' right-11 text-3xl'
            onClick={() => setShowModal(false)}>X</button>
              {/*content*/}
              <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                
                
                {/*body*/}


                <div className='flex flex-row '>
               <img className=' max-w-60% max-h-70% h-full  w-full' src="https://firebasestorage.googleapis.com/v0/b/instagram-a2f68.appspot.com/o/profileImages%2FUsChdSpTFPgX5VSqY4XYZNhAL663%2Fai_artificial_intelligence_ml_machine_learning_vector_by_kohb_gettyimages_1146634284-100817775-large.webp?alt=media&token=7402fb64-8530-428b-8a34-6ab693d2fe32" />
                    
                    
                  
                  
                </div>

              </div>



            </div>



          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>


        </>
      ) : null}
    </>
    );
};

export default PublicationModal;