import { getAuth, updateProfile } from 'firebase/auth';
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firbase';
import {collection,deleteDoc,doc,getDocs,orderBy,query,updateDoc,where} from "firebase/firestore";
import { FcHome } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import ListingItem from './ListingItem';

export default function () {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email,
  });
  const [listings,setListings] = useState(null);
  const [loading,setLoading] = useState(true);
  const [changeDetail, setChangeDetail] = useState(false);
  const {name,email} = formData;
  const onLogOut = () => {
    auth.signOut();
    navigate('/');
  }
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id] :e.target.value,
    }));
  }
  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== name){
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const docRef = doc(db,"users",auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile Successfully Updated");
    } catch (error) {
      toast.error("Something Went Wrong please try again");
    }
  }

  useEffect(() => {
    const fetchUserListing = async () =>{
      
      const listingRef = collection(db,"listings");
      const q = query(listingRef,where("userRef","==",auth.currentUser.uid),orderBy("timestamp","desc"));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc)=>{
        return listings.push({
          id:doc.id,
          data:doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListing();
  },[auth.currentUser.uid]);

  return (
    <>
    <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className='text-center font-bold text-3xl mt-6'>My Profile</h1>
      <div className='w-full md:w-[50%] m-auto mt-6 px-3'>
        <form>
          <input disabled={!changeDetail} onChange={onChange} className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`} type="text" id="name" value={name}></input>
          <input disabled className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ' type="email" id="email" value={email}></input>

          <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6 items-center'> 
            <p className='flex items-center mb-6 '>Do You Want to change your name?&nbsp;<span className={`text-red-600 cursor-pointer hover:text-red-700 transition duration-200 ease-in-out `} onClick={() => { changeDetail && onSubmit(); setChangeDetail((prevState) => !prevState)}}>{changeDetail ? "Apply Changes":"Edit"}</span></p>
            <p className='text-blue-600 cursor-pointer hover:text-blue-800 transition duration-200 ease-in-out mb-6' onClick={onLogOut}>Sign Out</p>
          </div>
        </form>
        <button type='submit' className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150m ease-in-out hover:shadow-lg active:bg-blue-800'><Link to="/create-listing" className='flex justify-center items-center'><FcHome className='mr-2 text-center text-3xl bg-red-200 rounded-full p-1 border-2'/>Sell or Rent your home</Link></button>
      </div>
    </section>
    <div className='max-6xl px-3 mt-6 mx-auto'>
      {!loading && listings.length>0 && (
        <>
          <h2 className='text-2xl text-center font-semibold mb-6'>My Listings</h2>
          <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
            {
              listings.map((listing) =>(
                <ListingItem id={listing.id} key={listing.id} listing={listing.data}/>
              ))
            }
          </ul>
        </>
      )}
    </div>
    </>
  )
}
