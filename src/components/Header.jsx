import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
export default function Header() {
    const [pageState,setPageState] = useState("Sign In");
    const auth = getAuth();
    useEffect(() => {
      onAuthStateChanged(auth,(user)=> {
        user?setPageState("Profile"):setPageState("Sign In");
      })
    },[auth]);
    const navigate = useNavigate();
    const location = useLocation();
    const pathMathRoute = (route) => {
        if(route === location.pathname){
            return true;
        }
    }
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
            <img onClick={() => navigate('/')} className='h-5 cursor-pointer select-none' src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="logo"/>
        </div>
        <div>
            <ul className='flex space-x-10'>
                <li onClick={() => navigate('/')} className={`select-none cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMathRoute('/') && "text-black border-b-red-500"}`}>Home</li>
                <li onClick={() => navigate('/offers')} className={`select-none cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMathRoute('/offers') && "text-black border-b-red-500"}`}>Offers</li>
                <li onClick={() => navigate('/profile')} className={`select-none cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${(pathMathRoute('/sign-in') || pathMathRoute('/profile')) && "text-black border-b-red-500"}`}>{pageState}</li>
            </ul>
        </div>
      </header>
    </div>
  )
}