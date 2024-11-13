import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { detailProductByIdService, createCartService, getCartService } from '../../../API/customer/productService';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const detailPorductById = () => {
  const {id} = useParams();
  const [productById, setproductMyId] = useState([])
  const [CartId, setCartId] = useState()
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate()

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // ฟังก์ชันลดปริมาณสินค้า
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  
  useEffect(() => {
    const detailProduct = async()=> {
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
    detailProduct()
  },[])

  useEffect(() => {
    const getCart = async()=> {
      try {
        const response = await getCartService()
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        console.log(response.data);
        setCartId(response.data[0])
      }
      
      catch (error) {
        alert(error)
      }
    }
    getCart()
  },[])

  const handleSubmitProductMaterial = async (event) => {
    event.preventDefault();

    try {
        const res = await createCartService(id, CartId.cartId, productById.selling_price_per_quantity, quantity);
        console.log(res);
        // navigate('/product');
    } catch (error) {
        console.log(error); // แสดงข้อผิดพลาด
    }
};

  return (    
    <div className="container my-5">
      <div className="row g-4">
        {/* Product Image */}
        <div className="col-md-6 text-center">
          {productById.productpic_name ? (
            <img
              src={`${API_URL_PICTURE}/${productById.productpic_name}`}
              alt={productById.product_name}
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
        <h1 className="fw-bold">{productById.product_name}</h1>
        <p className="text-muted">{productById.description}</p>
        <h3 className="text-danger fw-bold">{`฿${productById.selling_price_per_quantity}`}
          <button onClick={handleDecreaseQuantity} className="btn ms-3 "><h2 className="bi bi-patch-minus-fill"></h2></button>
          <input
            type="number"
            className="form-control d-inline text-center"
            style={{
              width: '70px',
              fontSize: '20px',
              fontWeight: 'bold',
              borderRadius: '5px',
              display: 'inline-block',
            }}
            value={quantity}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              if (newValue > 0) setQuantity(newValue); // อัปเดตเฉพาะค่าที่มากกว่า 0
            }}
          />
          <button onClick={handleIncreaseQuantity} className="btn"><h2 className="bi bi-patch-plus-fill"></h2></button>
        </h3> 
          <button onClick={(e) => handleSubmitProductMaterial(e)} className="btn btn-success ms-3 me-3">เพิ่มไปยังตะกร้า</button>
          <button className="btn btn-primary me-3" style={{ padding: '10px 20px', cursor: 'pointer' }}>
            กลับไปหน้าก่อนหน้า
          </button>

        </div>
      </div>
    </div>
  );
};

export default detailPorductById;