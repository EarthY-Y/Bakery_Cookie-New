import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { detailProductByIdService } from '../../../API/customer/productService';
import { formatDate } from '../../datetime';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const detailPorductById = () => {
  const {id} = useParams();
  const [ productMyId, setproductMyId] = useState([])

  useEffect(() => {
    const getlistMaterialById = async()=> {
      try {
        const response = await detailProductByIdService(id)
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        console.log(response.data);
        setproductMyId(response.data[0])
      }
      
      catch (error) {
        alert(error)
      }
    }
    getlistMaterialById()
  },[])

  const handleGoBack = () => {
    navigate(-1); // ย้อนกลับไปหน้าก่อนหน้า
  };

  return (    
    <div className="container my-5">
    <div className="row g-4">
      {/* Product Image */}
      <div className="col-md-6 text-center">
        {productMyId.productpic_name ? (
          <img
            src={`${API_URL_PICTURE}/${productMyId.productpic_name}`}
            alt={productMyId.product_name}
            className="img-fluid rounded shadow-sm"
          />
        ) : (
          <div className="bg-light border rounded p-5 d-flex align-items-center justify-content-center text-secondary">
            No Image Available
          </div>
        )}
      </div>
      {/* Product Info */}
      <div className="col-md-6">
        <h1 className="fw-bold">{productMyId.product_name}</h1>
        <p className="text-muted">{productMyId.description}</p>
        <h3 className="text-danger fw-bold">{`฿${productMyId.price}`}<button onClick={() => navigate("/cart")} className="btn btn-success ms-3 me-3">เพิ่มไปยังตะกร้า</button></h3> 
        <div className="d-flex mt-4">
          
          <button  className="btn btn-primary me-3" onClick={handleGoBack} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            กลับไปหน้าก่อนหน้า
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default detailPorductById;