import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import React from 'react';
import {FcGoogle} from 'react-icons/fc';
import { toast } from 'react-toastify';
import { db } from '../firbase';
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router';

export default function OAuth() {
  const navigate = useNavigate();
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth,provider);
      const user = result.user;
      const docRef = doc(db,"users",user.uid);
      const docSnap = await getDoc(docRef);
      if(!docSnap.exists()){
        await setDoc(docRef,{
          name:user.displayName,
          email:user.email,
          timestamp:serverTimestamp(),
        });
        navigate('/');
      }
    } catch (error) {
      toast.error("could not authorize with google")
    }
  }
  return (
    <button type='button' onClick={onGoogleClick} className='flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 transition duration-150 ease-in-out active:bg-red-900 rounded shadow-md hover:shadow-lg active:shadow-lg'>
        <FcGoogle className='text-2xl bg-white rounded-full mr-2'/>
      Continue With Google
    </button>
  )
}
