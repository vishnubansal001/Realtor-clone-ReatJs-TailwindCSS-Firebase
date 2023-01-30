import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {getStorage,ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import {v4 as uuidv4} from "uuid";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firbase';

export default function CreateListing() {
    const [geoLocationEnabled,setGeoLocationEnabled] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth();
    const [loading,setLoading] = useState(false);
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
        latitude:0,
        longitude:0,
        images:{},
    });
    const {type,name,bedrooms,bathrooms,parking,furnished,address,description,offer,regularPrice,discountPrice,latitude,longitude,images} = formData;
    const onChange = (e) => {
        let boolean = null;
        if(e.target.value === "true"){ boolean=true;}
        if(e.target.value === "false"){ boolean=false;}
        if(e.target.files){
            setFormData((prevState) => ({
                ...prevState,
                images:e.target.files,
            }));
        }
        if(!e.target.files){
            setFormData((prevState) =>({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(+discountPrice >= +regularPrice){
            setLoading(false);
            toast.error("Discounted price needs to be less than regular price");
            return;
        }
        if(images.length >6) {
            setLoading(false);
            toast.error("Maximum 6 images are allowed");
            return;
        }
        let geolocation = {}
        let location
        if(geoLocationEnabled){
            const response = await fetch(`https://geocode.maps.co/search?q=${address}`);
            const data = await response.json();
            // console.log(data);
            if(data.length !== 0){
                geolocation.lat = data[0].lat ?? 0;
                geolocation.lng = data[0].lon ?? 0;
            }
            location = data.length === 0 && undefined;
            console.log(location);
            if(location === undefined || String(location).includes("undefined")){
                setLoading(false);
                toast.error("Please fill the correct address");
                return;
            }else{
                geolocation.lat = latitude;
                geolocation.lng = longitude;
            }
        }
        const storeImage = async (image) => {
            return new Promise((resolve,reject)=>{
                const storage = getStorage()
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage,filename);
                const uploadTask = uploadBytesResumable(storageRef,image);
                uploadTask.on('state_changed',(snapshot) => {
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    console.log('upload is' + progress + '% done');
                    switch(snapshot.state){
                        case 'paused': console.log('upload is paused');break;
                        case 'running': console.log('upload is running');break;
                    }
                },
                (error) => {
                    reject(error);
                },
                ()=> {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
                )
            })
        }
        const imgUrls = await Promise.all(
            [...images].map((image) =>storeImage(image))).catch((error) => {
                setLoading(false);
                toast.error("Image not Uploaded");
                return;
            }
        );
        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp:serverTimestamp(),
            userRef:auth.currentUser.uid,
        };
        delete formDataCopy.images;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        !formDataCopy.offer && delete formDataCopy.discountPrice;
        const docRef = await addDoc(collection(db,"listings"),formDataCopy);
        setLoading(false);
        toast.success("Listing created");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }
    if(loading) {
        return <Spinner/>;
    }
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='font-bold text-center mt-6 text-3xl mb-10'>Create a Listing</h1>
      <form onSubmit={onSubmit}>
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
        {!geoLocationEnabled && (
            <div className='flex space-x-6 justify-start mb-6'>
                <div className=''>
                    <p className='text-lg font-semibold'>Latitude</p>
                    <input min="-90" max="90" className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' type="number" id="latitude" value={latitude} onChange={onChange} required></input>
                </div>
                <div className=''>
                    <p className='text-lg font-semibold'>Longitude</p>
                    <input min="-180" max="180" className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' type="number" id="latitude" value={longitude} onChange={onChange} required></input>
                </div>
            </div>
        )}
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