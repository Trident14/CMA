import React from 'react';
import '../css/notAuthorized.css'
import { useNavigate } from 'react-router-dom';
const NotAuthorized = () => {
    const navigate=useNavigate();
  return (
    <div className='container'>
      <div className='content'>
        <h1 className='title'>401</h1>
        <p className='message' >You are not authorized to access this page.</p>
        <button className='go-back' onClick={()=>navigate('/')}>Back</button>
      </div>
    </div>
  );
};
export default NotAuthorized;