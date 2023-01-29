import React from 'react'
import { useState } from 'react'
import {AiFillEyeInvisible,AiFillEye} from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
export default function SignIn() {
  const [showPassword,setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    email:"",
    password:"",
  });
  const {email,password} = formData;
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
      const userCredential = await signInWithEmailAndPassword(auth, email,password);
      if(userCredential.user){
        navigate("/");
      }
    } catch (error) {
      toast.error("Something Went Wrong Please try again");
    }
   }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%]'>
          <img className='w-full rounded-2xl' src='https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80' alt="Key Image"></img>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20 mt-8'>
          <form onSubmit={onSubmit}>
            <input className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out ' type="email" id="email" value={email} onChange={onChange} placeholder='Email address'></input>
            <div className='relative mb-6'>
              <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out vishnu' type={showPassword ? "text" :"password"} id="password" value={password} onChange={onChange} placeholder='Enter Password'></input>
              {
                showPassword 
                ? 
                <AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer' onClick={() => setShowPassword((prevState)=>!prevState)}></AiFillEyeInvisible>
                :
                <AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer' onClick={() => setShowPassword((prevState) => !prevState)}></AiFillEye>
              }
            </div>
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg '>
              <p className='mb-6'> Don't have a account? <Link className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out' to="/sign-up"> Register</Link></p>
              <p><Link className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out' to="/forgot-password">Forgot Password?</Link></p>
            </div>
            <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800' type='submit'>Sign In</button>
            <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'><p className='text-center font-semibold mx-4'>OR</p></div>
            <OAuth/>
          </form>
        </div>
      </div>
    </section>
  )
}
