import React, { useEffect, useState} from 'react';
import axios from 'axios';

const product = () => {

  useEffect (() => {
    axios.get('http://localhost:5000/Material')
    .then(res => {
      setColumn(Object.keys(res.data[0]))
      setRecord(res.data)
    })
  })

  return (
    <div className="container mt-5">
      
    </div>
  );
};

export default product;