import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  doc, getFirestore, setDoc } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import { UserProvider } from '../contexts/UserContext';




const SignUp = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const [signupError, setSignupError] = useState(null);
  const [imageFile, setFile] = useState(null);
  const [percent, setPercent] = useState(0);

  const navigate = useNavigate()
  const userContext = useContext(UserProvider)

  const handleSignup = async (email, password, additionalData, imageFile) => {
    
    try {
      // Step 1: Create the user account using Firebase Authentication
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(auth, email, password, imageFile);

      const storage = getStorage(); 
      const storageRef = ref(storage, `profileImages/${user.uid}/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile); 

      const downloadURL = await getDownloadURL(storageRef); 
      // Step 2: Save the additional profile information to the "profile" table in Firestore
      const db = getFirestore();
      const profileData = { ...additionalData, imageUrl: downloadURL };
      const profileDocRef = doc(db, 'profile', user.uid);

      // Add the user ID to the additionalData object
      additionalData.userId = user.uid;

      await setDoc(profileDocRef, profileData);

      
      
      // Optionally, you can return the user object or perform any additional actions after signup
      console.log('Signup successful', user);
    } catch (error) {
      console.error('Signup failed', error);
      setSignupError(error.message);
    }
  };


  

  const handleSubmit = (event) => {
    event.preventDefault();
    const email1 = email;
    const password1 = password;

    const additionalData = {
      dateCreated: Date.now(),
      email: email1,
      following: [],
      name: name,
      username: username
        
    };

    handleSignup(email, password1, additionalData, imageFile);
    navigate('/')
  };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Foto
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="file"
                            placeholder="File"
                            // onChange={(e) => setValues((prev) => ({ ...prev, foto: e.target.files[0] }))}
                            onChange={(e) => setFile(e.target.files[0])}
                            
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            User name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            // onChange={(e) => setValues((prev) => ({ ...prev, username: e.target.value }))}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            // onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="**********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="confirm-password"
                            type="password"
                            placeholder="**********"
                        />
                    </div>
                    {/* {error && <p className="mb-4 text-xs text-red-primary">{error}</p>} */}
                    <div className='flex gap-2 items-center justify-center'>
                        <p>Already have account? Please</p>
                        <Link to='/login'>
                            <p className=' text-blue-600'>Login</p>
                        </Link>

                    </div>

                    <div className="flex items-center justify-center mt-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={handleSubmit}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;2023 Acme Corp. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default SignUp;