import React from 'react';
import ReactLoading from 'react-loading';

const Spinner = ({ type, color }) => (
  <div className="flex justify-center">
    <ReactLoading 
        type={type} 
        color={color} 
        height={40} 
        width={40} 
    />
  </div>
);

export default Spinner;