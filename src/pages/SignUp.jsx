import React from 'react'
import { useState } from 'react'
import {AiFillEyeInvisible,AiFillEye} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getAuth,createUserWithEmailAndPassword,UserProfile, updateProfile } from 'firebase/auth';
import { db } from '../firbase';
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SignOut() {
  const [showPassword,setShowPassword] = useState(false);

  const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:"",
  });
  const navigate = useNavigate();
  const {name,email,password} = formData;
  function onChange(e){
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]:e.target.value,
    }));
   }
   const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      updateProfile(auth.currentUser,{
        displayName:name,
      })
      const user = userCredential.user;
      const formDataCopy = {...formData};
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db,"users",user.uid),formDataCopy);
      toast.success("Sign up is successful");
      navigate('/');
    } catch (error) {
      toast.error("something went wrong the registration")
    }
   };
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%]'>
          <img className='w-full rounded-2xl' src='https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80' alt="Key Image"></img>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20 mt-8'>
          <form onSubmit={onSubmit}>
            <input className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out ' type="text" id="name" value={name} onChange={onChange} placeholder='Full Name'></input>
            <input className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out ' type="email" id="email" value={email} onChange={onChange} placeholder='Email address'></input>
            <div className='relative mb-6'>
              <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out ' type={showPassword ? "text" :"password"} id="password" value={password} onChange={onChange} placeholder='Email address'></input>
              {
                showPassword 
                ? 
                <AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer' onClick={() => setShowPassword((prevState)=>!prevState)}></AiFillEyeInvisible>
                :
                <AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer' onClick={() => setShowPassword((prevState) => !prevState)}></AiFillEye>
              }
            </div>
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg '>
              <p className='mb-6'> Have a account? <Link className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out' to="/sign-in"> Sign In</Link></p>
              <p><Link className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out' to="/forgot-password">Forgot Password?</Link></p>
            </div>
            <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800' type='submit'>Sign Up</button>
            <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'><p className='text-center font-semibold mx-4'>OR</p></div>
            <OAuth/>
          </form>
        </div>
      </div>
    </section>
  )
}
