import React, { useContext,useEffect, useState} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createProductService } from '../../../API/productService';
import { FormContextMaterialProduct } from '../../../API/productService';

const CreateProduct = () => {
  const { formData, setFormData } = useContext(FormContextMaterialProduct);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'file' && files.length > 0) {
      // ตรวจสอบว่าเป็น input file และมีการเลือกไฟล์
      const file = files[0]; // เอาไฟล์แรกที่ถูกเลือก
      setFormData(prev => ({ ...prev, [name]: file })); // เก็บไฟล์ใน formData
    } else {
      setFormData(prev => ({ ...prev, [name]: value })); // สำหรับ input อื่นๆ
    }
  };

  return (
    <div className="container mt-5">
      <Link className="btn btn-light text-black" to="/product">ย้อนกลับ</Link>
       <div className="mb-3 text-center">
          <div style={{ width: '100px', height: '100px', border: '1px dashed #ccc', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>เพิ่มรูปสินค้า</span>
          </div >
          <input 
            type="file" 
            name='file'
            className="" 
            id="fileInput" 
            onChange={handleChange} 
            />
            {formData.file && (<p>ไฟล์ที่เลือก: {formData.file.name}</p>)}
          </div>

        <div className="row mb-3 justify-content-center">
          <label className="col-sm-2 col-form-label">ชื่อสินค้า</label>
          <div className="row col-sm-5">
            <input 
              type="text" 
              name='product_name'
              className="form-control" 
              placeholder="ชื่อสินค้า" 
              value={formData.product_name || ''} 
              /* formData.product_name || '' ตั้งค่าเป็น string ว่างถ้าเป็น undefined 
              เนื่องจาก ใน formData เราทำเป็น Dynamic เพิ่มตามจำนวน name ของ input 
              เเล้วไม่ได้ set ค่า เหมือนในหน้า signUp*/
              onChange={handleChange} 
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-center">
          <label className="col-sm-2 col-form-label">จำนวน</label>
          <div className="row col-sm-5">
            <input 
              type="text" 
              name='quantity'
              className="form-control" 
              placeholder="จำนวน" 
              value={formData.quantity || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-center">
          <label className="col-sm-2 col-form-label">ต้นทุนสินค้า</label>
          <div className="row col-sm-5">
            <input 
              type="text" 
              name='cost'
              className="form-control" 
              placeholder="ต้นทุนสินค้า" 
              value={formData.cost || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-center">
          <label className="col-sm-2 col-form-label">ราคาสินค้า</label>
          <div className="row col-sm-5">
            <input 
              type="text" 
              name='price'
              className="form-control" 
              placeholder="ราคาสินค้า" 
              value={formData.price || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-center">
          <label className="col-sm-2 col-form-label">รายละเอียดสินค้า</label>
          <div className="row col-sm-5">
            <input 
              type="text" 
              name='description'
              className="form-control" 
              placeholder="รายละเอียดสินค้า" 
              value={formData.description || ''} 
              onChange={handleChange} 
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
          <Link
            className="btn btn-primary"
            type="submit"
            style={{ width: '100px', height: '40px' }}
            to="materialproduct">
            ต่อไป
          </Link>
        </div>
    </div>
  );
};

export default CreateProduct;