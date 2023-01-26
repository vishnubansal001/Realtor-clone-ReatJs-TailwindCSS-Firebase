import React from 'react';
import { useLocation, useNavigate } from 'react-router';
export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    function pathMathRoute(route){
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
                <li onClick={() => navigate('/sign-in')} className={`select-none cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMathRoute('/sign-in') && "text-black border-b-red-500"}`}>Sign In</li>
            </ul>
        </div>
      </header>
    </div>
  )
}