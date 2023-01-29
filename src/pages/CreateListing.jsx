import React from 'react'
import { useState } from 'react'

export default function CreateListing() {
    const [formData,setFormData] = useState({
        type:"rent",
        name:"",
        bedrooms:1,
        bathrooms:1,
        parking:false,
        furnished:false,
        address:"",
        description:"",
        offer:true,
        regularPrice:0,
        discountPrice:0,
    });
    const {type,name,bedrooms,bathrooms,parking,furnished,address,description,offer,regularPrice,discountPrice} = formData;
    const onChange = () => {

    }
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='font-bold text-center mt-6 text-3xl mb-10'>Create a Listing</h1>
      <form >
        <p className='font-semibold text-lg mt-6'>Sell / Rent</p>
        <div className='flex '>
            <button id='type' value="sale" onClick={onChange} type='button' className={`mr-3 text-sm uppercase bg-white rounded shadow-md mt-2 px-7 font-medium py-3 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type==="rent" ? "bg-white text-black" :"bg-gray-600 text-white"}`}>sell</button>
            <button id='type' value="rent" onClick={onChange} type='button' className={`ml-3 text-sm uppercase bg-white rounded shadow-md mt-2 px-7 font-medium py-3 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type==="sale" ? "bg-white text-black" :"bg-gray-600 text-white"}`}>rent</button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Name</p>
        <input type="text" id="name" value={name} onChange={onChange} placeholder='Name' maxLength="32" minLength="10" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'></input>

        <div className='flex space-x-6 justify-start mb-6 '>
            <div >
                <p className='text-lg font-semibold'>Beds</p>
                <input required type="number" value={bedrooms} id="bedrooms" onChange={onChange} min="1" max="50" className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center '></input>
            </div>
            <div >
                <p className='text-lg font-semibold'>Baths</p>
                <input required type="number" value={bathrooms} id="bathrooms" onChange={onChange} min="1" max="50" className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center '></input>
            </div>
        </div>
        <p className='font-semibold text-lg mt-6'>Parking Spot</p>
        <div className='flex '>
            <button id='parking' value={true} onClick={onChange} type='button' className={`mr-3 text-sm uppercase bg-white rounded shadow-md mt-2 px-7 font-medium py-3 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!parking? "bg-white text-black" :"bg-gray-600 text-white"}`}>Yes</button>
            <button id='parking' value={false} onClick={onChange} type='button' className={`ml-3 text-sm uppercase bg-white rounded shadow-md mt-2 px-7 font-medium py-3 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking? "bg-white text-black" :"bg-gray-600 text-white"}`}>No</button>
        </div>
        <p className='font-semibold text-lg mt-6'>Full Furnished</p>
        <div className='flex '>
            <button id='furnished' value={true} onClick={onChange} type='button' className={`mr-3 text-sm uppercase bg-white rounded shadow-md mt-2 px-7 font-medium py-3 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!furnished? "bg-white text-black" :"bg-gray-600 text-white"}`}>Yes</button>
            <button id='furnished' value={false} onClick={onChange} type='button' className={`ml-3 text-sm uppercase bg-white rounded shadow-md mt-2 px-7 font-medium py-3 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished? "bg-white text-black" :"bg-gray-600 text-white"}`}>No</button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Address</p>
        <textarea type="text" id="address" value={address} onChange={onChange} placeholder='Address' required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-3'></textarea>
        <p className='text-lg mt-3 font-semibold'>Description</p>
        <textarea type="text" id="description" value={description} onChange={onChange} placeholder='Description' required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-3'></textarea>
        <p className='font-semibold text-lg mt-3'>Offer</p>
        <div className='flex'>
            <button id='offer' value={true} onClick={onChange} type='button' className={`mr-3 text-sm uppercase bg-white rounded shadow-md mt-2 px-7 font-medium py-3 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!offer? "bg-white text-black" :"bg-gray-600 text-white"}`}>Yes</button>
            <button id='offer' value={false} onClick={onChange} type='button' className={`ml-3 text-sm uppercase bg-white rounded shadow-md mt-2 px-7 font-medium py-3 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${offer? "bg-white text-black" :"bg-gray-600 text-white"}`}>No</button>
        </div>
        <div className=' flex items-center mb-6 mt-6'>
            <div className=''>
                <p className='text-lg font-semibold'>Regular Price</p>
                <div className='flex w-full justify-center items-center space-x-6'>
                    <input type="number" id="regularPrice" value={regularPrice} onChange={onChange} min="50" max="40000000" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'></input>
                    {(type==="rent" && <div className='text-md w-full whitespace-nowrap'>$ / Month</div>)}
                </div>
            </div>
        </div>
        {
            offer && (
                <div className=' flex items-center mb-6 mt-6'>
                    <div className=''>
                        <p className='text-lg font-semibold'>Discounted Price</p>
                        <div className='flex w-full justify-center items-center space-x-6'>
                            <input type="number" id="discountPrice" value={discountPrice} onChange={onChange} min="50" max="40000000" required={offer} className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'></input>
                            {(type==="rent" && <div className='text-md w-full whitespace-nowrap'>$ / Month</div>)}
                        </div>
                    </div>
                </div>
            )
        }
        <div className='mb-6'>
            <p className='text-lg font-semibold'>Images</p>
            <p className='text-gray-600'>The First image will be the cover (max 6)</p>
            <input type="file" id="images" onChange={onChange} accept='.jpg,.png,.jpeg' multiple required className='w-full px-3 py-1.5 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600'></input>
        </div>
        <button type='submit' className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>Create Listing</button>
      </form>
    </main>
  )
}
