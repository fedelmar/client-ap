import React from 'react';
import ReactLoading from 'react-loading';

const Spinner = ({ type, color }) => (

    <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
        <div className="flex justify-center">
            <ReactLoading 
                type={type} 
                color={color} 
                height={250} 
                width={100} 
            />
        </div>
    </div>
);

export default Spinner;