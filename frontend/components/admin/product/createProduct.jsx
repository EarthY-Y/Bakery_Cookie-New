import React, { useEffect, useState} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createProductService } from '../../../API/productService';

const CreateProduct = () => {
  const [productName, setProduct_name] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productCost, setProductCost] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [picture, setPicture] = useState(null); //ใช้ null เพื่อเก็บไฟล์

  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();  // ใช้ formData แทน fromData
      formData.append('product_name', productName);
      formData.append('quantity', productQuantity);
      formData.append('cost', productCost);
      formData.append('price', productPrice);
      formData.append('description', productDescription);
      formData.append('file', picture); // ต้องตรงกับชื่อที่ server ใช้
      console.log("Selected file:", picture);
      const res = await createProductService(formData);
      navigate('/product');
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="container mt-5">
      <Link className="btn btn-light text-black" to="/product">ย้อนกลับ</Link>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
       <div className="mb-3 text-center">
          <div style={{ width: '100px', height: '100px', border: '1px dashed #ccc', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>เพิ่มรูปสินค้า</span>
          </div >
          <input 
            type="file" 
            className="" 
            id="fileInput" 
            placeholder=".png /.jpeg /.pdf"
            onChange={(e) => setPicture(e.target.files[0])}
          />
        </div>

        <div className="row mb-3 justify-content-center">
          <label className="col-sm-2 col-form-label">ชื่อสินค้า</label>
          <div className="row col-sm-5">
            <input 
              type="text" 
              className="form-control" 
              placeholder="ชื่อสินค้า" 
              value={productName} 
              onChange={(e) => setProduct_name(e.target.value)} 
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-center">
          <label className="col-sm-2 col-form-label">จำนวน</label>
          <div className="row col-sm-5">
            <input 
              type="text" 
              className="form-control" 
              placeholder="จำนวน" 
              value={productQuantity} 
              onChange={(e) => setProductQuantity(e.target.value)} 
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-center">
          <label className="col-sm-2 col-form-label">ต้นทุนสินค้า</label>
          <div className="row col-sm-5">
            <input 
              type="text" 
              className="form-control" 
              placeholder="ต้นทุนสินค้า" 
              value={productCost} 
              onChange={(e) => setProductCost(e.target.value)} 
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-center">
          <label className="col-sm-2 col-form-label">ราคาสินค้า</label>
          <div className="row col-sm-5">
            <input 
              type="text" 
              className="form-control" 
              placeholder="ราคาสินค้า" 
              value={productPrice} 
              onChange={(e) => setProductPrice(e.target.value)} 
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-center">
          <label className="col-sm-2 col-form-label">รายละเอียดสินค้า</label>
          <div className="row col-sm-5">
            <input 
              type="text" 
              className="form-control" 
              placeholder="รายละเอียดสินค้า" 
              value={productDescription} 
              onChange={(e) => setProductDescription(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="d-md-flex justify-content-center">
        <button
            className="btn btn-secondary me-2"
            type="submit"
            style={{ width: '100px', height: '40px' }}>
            ยกเลิก
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            style={{ width: '100px', height: '40px' }}>
            เพิ่ม
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;