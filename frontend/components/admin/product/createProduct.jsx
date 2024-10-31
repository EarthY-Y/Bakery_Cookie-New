import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CreateProduct = () => {
  const [ProductName, setProduct_name] = useState("");
  const [ProductCode, setProductCode] = useState("");
  const [ProductCost, setProductCost] = useState("");
  const [ProductPrice, setProductPrice] = useState("");
  const [ProductDescription, setProductDescription] = useState("");
  const [Picture, setPicture] = useState(null); //ใช้ null เพื่อเก็บไฟล์
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();  // ใช้ formData แทน fromData
      formData.append('product_name', ProductName);
      formData.append('productcode', ProductCode);
      formData.append('productcost', ProductCost);
      formData.append('productprice', ProductPrice);
      formData.append('productcost', ProductDescription);
      formData.append('file', Picture); // ต้องตรงกับชื่อที่ server ใช้
      console.log("Selected file:", Picture);
      const res = await createMaterialService(formData);
      navigate('/material');
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
              value={ProductName} 
              onChange={(e) => setProduct_name(e.target.value)} 
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-center">
          <label className="col-sm-2 col-form-label">รหัสสินค้า</label>
          <div className="row col-sm-5">
            <input 
              type="text" 
              className="form-control" 
              placeholder="รหัสสินค้า" 
              value={ProductCode} 
              onChange={(e) => setProductCode(e.target.value)} 
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
              value={ProductCost} 
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
              value={ProductPrice} 
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
              value={ProductDescription} 
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