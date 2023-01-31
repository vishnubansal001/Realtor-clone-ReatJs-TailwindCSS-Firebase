import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function EditListing() {
  const navigate = useNavigate();
  const [geolocationEnabled, setGeolocationEnabled] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const auth = getAuth();
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;
   
  const params = useParams();

  useEffect(()=>{
    if(listing && listing.userRef !== auth.currentUser.uid){
     toast.error("You can't edit this listing")
     navigate("/")
    }
},[auth.currentUser.uid, listing, navigate])

  useEffect(()=>{
         setLoading(true);
         async function fetchListing(){
            const docRef = doc(db, "listings", params.listingId)
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setListing(docSnap.data())
                setFormData({...docSnap.data()})
                setLoading(false)
            }else{
                navigate("/");
                toast.error("Listing does not exist");
            }
         }
         fetchListing();
  },[params.listingId, navigate])
  
 
  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed");
      return;
    }
    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://geocode.maps.co/search?q=${address}`
      );
      const data = await response.json();
      console.log(typeof data.length);
      if (data.length !== 0) {
        geolocation.lat = data[0].lat ?? 0;
        geolocation.lng = data[0].lon ?? 0;
      }
      location = data.length === 0 && undefined;
      console.log(location);
      if (location === undefined || String(location).includes("undefined")) {
        setLoading(false);
        toast.error("Please enter a correct address");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;  
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error(`Something Went Wrong ${error}`);
      return;
    });
    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = doc(db, "listings", params.listingId)
    
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing Edited");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="max-w-md px-2 mx-auto flex item-center flex-col gap-2 justify-center">
      <h1 className="text-2xl text-center mt-6 font-bold">Edit Listing</h1>
      <form
        onSubmit={onSubmit}
        className="w-full flex items-start justify-center gap-4 flex-col p-1"
      >
        <p className="text-lg mt-6 font-semibold w-full">Sell / Rent</p>
        <div className="flex items-center justify-center w-full flex-row gap-4">
          <button
            className={`px-7 py-3 
            font-medium text-sm uppercase shadow-md rounded 
            hover:shadow-md focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
          >
            Sell
          </button>
          <button
            className={`px-7 py-3 
            font-medium text-sm uppercase shadow-md rounded 
            hover:shadow-md focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
          >
            Rent
          </button>
        </div>
        <label className="text-lg mt-2 font-semibold text-start flex items-center justify-start">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          className="w-full p-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
          placeholder="Name"
          maxLength="32"
          minLength="10"
          onChange={onChange}
          required
        />
        <div className="flex mt-2 items-center justify-center flex-row w-full gap-4">
          <div className="w-full flex items-start justify-center flex-col">
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
          <div className="w-full flex items-start justify-center flex-col">
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
        </div>
        <p className="text-lg mt-2 font-semibold w-full">Parking Spot</p>
        <div className="flex items-center justify-center w-full flex-row gap-4">
          <button
            className={`px-7 py-3 
            font-medium text-sm uppercase shadow-md rounded 
            hover:shadow-md focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              !parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            className={`px-7 py-3 
            font-medium text-sm uppercase shadow-md rounded 
            hover:shadow-md focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-2 font-semibold w-full">Furnished</p>
        <div className="flex items-center justify-center w-full flex-row gap-4">
          <button
            className={`px-7 py-3 
            font-medium text-sm uppercase shadow-md rounded 
            hover:shadow-md focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            className={`px-7 py-3 
            font-medium text-sm uppercase shadow-md rounded 
            hover:shadow-md focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
          >
            no
          </button>
        </div>
        <label className="text-lg mt-2 font-semibold text-start flex items-center justify-start">
          Address
        </label>
        <textarea
          type="text"
          id="address"
          value={address}
          className="w-full p-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
          placeholder="Address"
          onChange={onChange}
          required
        />
        {!geolocationEnabled && (
          <div className="flex w-full items-center justify-center flex-row gap-4">
            <div className="flex w-1/2 items-start justify-center flex-col gap-2">
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>
            <div className="flex w-1/2 items-start justify-center flex-col gap-2">
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>
          </div>
        )}
        <label className="text-lg mt-2 font-semibold text-start flex items-center justify-start">
          Description
        </label>
        <textarea
          type="text"
          id="description"
          value={description}
          className="w-full p-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
          placeholder="Description"
          onChange={onChange}
          required
        />
        <p className="text-lg mt-2 font-semibold w-full">Offers</p>
        <div className="flex items-center justify-center w-full flex-row gap-4">
          <button
            className={`px-7 py-3 
            font-medium text-sm uppercase shadow-md rounded 
            hover:shadow-md focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              !offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            className={`px-7 py-3 
            font-medium text-sm uppercase shadow-md rounded 
            hover:shadow-md focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
          >
            No
          </button>
        </div>
        <div className="items-center justify-center flex mt-2">
          <div className="flex items-start justify-center flex-col gap-4">
            <p className="text-lg font-semibold">Regular Price</p>
            <div className="flex items-center justify-center flex-row gap-4">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="400000000"
                required
                className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div className="">
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="items-center justify-center flex mt-2">
            <div className="flex items-start justify-center flex-col gap-4">
              <p className="text-lg font-semibold">Discounted Price</p>
              <div className="flex items-center justify-center flex-row gap-4">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="400000000"
                  required={offer}
                  className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                />
                {type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6 flex items-start justify-center flex-col gap-2">
          <p className="font-semibold text-lg">Images</p>
          <p className="text-gray-600">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            onChange={onChange}
            id="images"
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-md focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Edit Listing
        </button>
      </form>
    </main>
  );
}