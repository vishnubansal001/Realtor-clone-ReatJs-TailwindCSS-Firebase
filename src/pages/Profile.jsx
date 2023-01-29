import React from 'react'
import { useState } from 'react'

export default function () {
  const [formData,setFormData] = useState({
    name:"ABCD",
    email:"ABCD@gmail.com",
  });
  const {name,email} = formData;
  return (
    <>
    <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className='text-center font-bold text-3xl mt-6'>My Profile</h1>
      <div className='w-full md:[50%] lg:w-[40%] m-auto mt-6 px-3'>
      <form>
            <input className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ' type="text" id="name" placeholder='Email address' value={name}></input>
      </form>
      </div>
    </section>
    </>
  )
}
