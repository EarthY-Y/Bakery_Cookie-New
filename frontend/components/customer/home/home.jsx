import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProductService } from '../../../API/customer/productService';

const Home = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await listProductService()
        console.log(res.data);
        setProducts(res.data);
      } catch (err) {
        console.error("Error data:", err);
      }
    };

    getProducts();
  }, []);
  return(
    <div className='text-center'><h5>this is home page</h5></div>
  );
};

export default Home;
