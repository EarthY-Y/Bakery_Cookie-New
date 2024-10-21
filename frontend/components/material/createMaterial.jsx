import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createMaterialService } from '../../API/materialService';

const createMaterial = () => {
  const authToken = localStorage.getItem('token')
  const [MaterialName, setMaterial_name] = useState("");
  const [Quantities, setQuantity] = useState("");
  const [Costes, setCost] = useState("");
  const [Picture, setPicture] = useState(null); //ใช้ null เพื่อเก็บไฟล์
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();  // ใช้ formData แทน fromData
      formData.append('MaterialName', MaterialName);
      formData.append('Quantities', Quantities);
      formData.append('Costes', Costes);
      formData.append('file', Picture); // ต้องตรงกับชื่อที่ server ใช้
      console.log("Selected file:", Picture);
      const res = await createMaterialService(formData, authToken);
      navigate('/material');
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} enctype="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">ชื่อสินค้า</label>
          <input type="text" className="form-control" placeholder="ชื่อสินค้า" 
            value={MaterialName} 
            onChange={(e) => setMaterial_name(e.target.value)}
            />
        </div>
        <div className="mb-3">
          <label className="form-label">ปริมาณ</label>
          <input type="number" className="form-control" placeholder="กิโล" 
            value={Quantities} 
            onChange={(e) => setQuantity(e.target.value)}
            />
        </div>
        <div className="mb-3">
          <label  className="form-label">ต้นทุน</label>
          <input type="number" className="form-control"  placeholder="100 บาท"
            value={Costes} 
            onChange={(e) => setCost(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Picture</label>
          <input 
            type="file" 
            className="form-control" 
            id="fileInput" 
            placeholder=".png /.jpeg /.pdf"
            onChange={(e) => setPicture(e.target.files[0])}
          />
        </div>

        <div className="col-12">
          <button className="btn btn-primary" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default createMaterial;