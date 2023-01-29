import { getAuth } from 'firebase/auth';
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router';

export default function () {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email,
  });
  const {name,email} = formData;
  const onLogOut = () => {
    auth.signOut();
    navigate('/');
  }
  return (
    <>
    <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className='text-center font-bold text-3xl mt-6'>My Profile</h1>
      <div className='w-full md:w-[50%] m-auto mt-6 px-3'>
        <form>
          <input disabled className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ' type="text" id="name" value={name}></input>
          <input disabled className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ' type="email" id="email" value={email}></input>

          <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6 items-center'> 
            <p className='flex items-center mb-6 '>Do You Want to change your name? <span className='text-red-600 cursor-pointer hover:text-red-700 transition duration-200 ease-in-out'> Edit</span></p>
            <p className='text-blue-600 cursor-pointer hover:text-blue-800 transition duration-200 ease-in-out' onClick={onLogOut}>Sign Out</p>
          </div>
        </form>
      </div>
    </section>
    </>
  )
}
