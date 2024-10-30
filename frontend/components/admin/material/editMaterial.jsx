import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createMaterialService } from '../../../API/materialService';
import { Link } from 'react-router-dom';

const editMaterial = () => {
  const [MaterialName, setMaterial_name] = useState("");
  const [Quantities, setQuantity] = useState("");
  const [Costes, setCost] = useState("");
  const [Picture, setPicture] = useState(null); //ใช้ null เพื่อเก็บไฟล์
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();  // ใช้ formData แทน fromData
      formData.append('material_name', MaterialName);
      formData.append('quantity', Quantities);
      formData.append('cost', Costes);
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
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/material" className="btn btn-outline-secondary text-black">
          ย้อนกลับ
        </Link>
      </div>
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

export default editMaterial;