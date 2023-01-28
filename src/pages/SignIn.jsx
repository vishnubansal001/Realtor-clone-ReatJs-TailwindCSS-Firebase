import React from 'react'
import { useState } from 'react'

export default function SignIn() {
  const [formData,setFormData] = useState({
    email:"",
    password:"",
  });
  const {email,password} = formData;
  function onChange(e){
    console.log(e);
   }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%]'>
          <img className='w-full rounded-2xl' src='https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80' alt="Key Image"></img>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20 '>
          <form>
            <input className='w-full' type="email" id="email" value={email} onChange={(e) => onChange(e)}></input>
          </form>
        </div>
      </div>
    </section>
  )
}
