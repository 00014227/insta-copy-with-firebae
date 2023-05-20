import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { auth } from '../firebase';



const Home = ({ userProfile, publications }) => {
    const [like, setLike] = useState(false)
    const [count, setCount] = useState(0)
    const [adminData, setAdminData] = useState([]);
    const [imageUrl, setImageUrl] = useState(null)



    function handleLike(id) {
        setLike(!like);
        setCount(count + 1);
        setAdminData(prevData => {
            // Find the object with the matching id
            const updatedData = prevData.map(d => {
                if (d.id === id) {
                    // Update the liked property for the matching object
                    return { ...d, liked: true }
                } else {
                    return d;
                }
            });
            return updatedData;
        })
    }

    function handleDislike() {
        setLike(!like);
        setCount(count - 1);
    }


    if (!userProfile || !publications) {
        return <div class="h-screen bg-white">
        <div class="flex justify-center items-center h-full">
          <img className="h-16 w-16" src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt=""/>
        </div>
        </div>
      }
    


    return (
        <div className=' '>

            <NavBar adminData={adminData} setAdminData={setAdminData} imageUrl = {userProfile.imageUrl } />
            <div className=' max-w-lg w-full mx-auto '>

                {/* <ModalHeading adminData={adminData} setAdminData={setAdminData} /> */}
                <h1 className=' text-2xl text-center'>{userProfile.name}</h1>
                
                <div>
                    {publications.map((publication) => {
                        <article className=' border-b border-solid mt-3'>

                            <div className='flex gap-3'>
                                {userProfile.imageUrl && <img className=' rounded-full w-12 h-12 ' src={userProfile.imageUrl} alt="Profile" />}

                                <div >

                                    <p className=''>{userProfile.name}</p>
                                    <p>{publication.place}</p>
                                
                                </div>

                            </div>
                            {publication.imageUrl && <img className=' mt-4' src={publication.imageUrl} alt="Profile" />}
                            
                            <div className='flex gap-2 mt-4'>
                                <button onClick={like ? handleDislike : handleLike()}>
                                    {like ? <svg aria-label="Не нравится" class="x1lliihq x1n2onr6" color="rgb(255, 48, 64)" fill="rgb(255, 48, 64)" height="24" role="img" viewBox="0 0 48 48" width="24"><title>Не нравится</title><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                                        : <svg aria-label="Нравится" class="x1lliihq x1n2onr6" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Нравится</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>}
                                </button>
                                <button>
                                    <svg aria-label="Комментировать" class="x1lliihq x1n2onr6" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Комментировать</title><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
                                </button>

                                <button>
                                    <svg aria-label="Поделиться публикацией" class="x1lliihq x1n2onr6" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Поделиться публикацией</title><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                                </button>
                            </div>
                            <div className='flex'>
                                <span>{count}</span>
                                <p>отметок "Нравится"</p>
                            </div>

                            <div className='flex gap-4'>
                                <p className=' font-medium'>{userProfile.name}</p>
                                <p>{publication.description}</p>
                            </div>



                        </article>
                    })}
                </div>

            </div>
        </div>
    );
};

export default Home;