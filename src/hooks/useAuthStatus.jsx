import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

export function useAuthStatus(){
    const auth = getAuth();
    const [loggedIn,setLoggedIn] = useState(false);
    const [checkingStatus,setCheckingStatus] = useState(true);
    useEffect(() =>{
        const path = getAuth();
        onAuthStateChanged(auth,(user) => {
            if(user){
                setLoggedIn(true);
            }
            setCheckingStatus(false);
        })
    },[]);
  return {loggedIn,checkingStatus};
}
