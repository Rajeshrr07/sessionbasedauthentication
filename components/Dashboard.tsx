'use client'


import React, {useState,useEffect} from 'react';

export const Dashboard = () => {
  
  const [whoami, setWhoami] = useState('I dont know!');
  const [error, setError] = useState('');

useEffect(() => {
    
    fetch("https://18vsc7r5-8000.inc1.devtunnels.ms/account/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    .then(response => response.json())
    .then((data) => {
        setWhoami(data.username)
    })
    .catch((err) => {
      console.log(err);
      setError("You are not logged in");
    });
   
   }, [])

  return (
        <div className="container">
          {whoami}
          {error}
        </div>
  );
};

export default Dashboard;