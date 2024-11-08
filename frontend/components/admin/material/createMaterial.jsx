import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createMaterialService } from '../../../API/materialService';
import { Link } from 'react-router-dom';

const createMaterial = () => {
  const [MaterialName, setMaterial_name] = useState("");
  const [Quantities, setQuantity] = useState("");
  const [Costes, setCost] = useState("");
  const [CostesPerQuantities, setCostesPerQuantities] = useState("");
  const [Picture, setPicture] = useState(null); //ใช้ null เพื่อเก็บไฟล์
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();  // ใช้ formData แทน fromData
      formData.append('material_name', MaterialName);
      formData.append('quantity', Quantities);
      formData.append('cost', Costes);
      formData.append('costesperquantities', CostesPerQuantities);
      formData.append('file', Picture); // ต้องตรงกับชื่อที่ server ใช้
      console.log("Selected file:", Picture);
      const res = await createMaterialService(formData);
      navigate('/material');
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    // ตรวจสอบให้แน่ใจว่า Quantities และ Costes มีค่า และ Quantities ไม่เป็น 0
    if (Quantities && Costes && Quantities !== 0) {
      const costPerQuantity = parseFloat(Costes) / parseFloat(Quantities);
      setCostesPerQuantities(costPerQuantity.toFixed(2)); // ปัดเป็นทศนิยม 2 ตำแหน่ง
    } else {
      setCostesPerQuantities(""); // ตั้งค่าให้ว่างถ้ายังไม่มีข้อมูล
    }
  }, [Quantities, Costes]);

  return (
    <div className="container mt-5">
      <Link className="btn btn-light text-black mb-4" to="/material">
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </Link>
      <div className="mb-4 card col-md-12 px-40 card-body">
        <h4>เพิ่มวัตถุดิบ</h4>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3 text-center">
            <div className="position-relative" style={{ margin: '2%', width: '100px', height: '100px', border: '1px dashed #ccc', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {Picture ? (
                <img src={URL.createObjectURL(Picture)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              ) : (
                <span>เพิ่มรูปวัตถุดิบ</span>
              )}
              <input type="file" className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0, cursor: 'pointer' }} onChange={(e) => setPicture(e.target.files[0])} />
            </div>
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อวัตถุดิบ</label>
            <div className="row col-sm-4">
              <input type="text" className="form-control" placeholder="ชื่อวัตถุดิบ" 
                value={MaterialName} 
                onChange={(e) => setMaterial_name(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ปริมาณวัตถุดิบ</label>
            <div className="row col-sm-4">
              <input type="number" className="form-control" placeholder="หน่วยเป็นกรัม" 
                value={Quantities}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนวัตถุดิบที่ซื้อมา</label>
            <div className="row col-sm-4">
              <input type="number" className="form-control" placeholder="หน่วยเป็นบาท" 
                value={Costes} 
                onChange={(e) => setCost(e.target.value)} 
              />
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนต่อปริมาณ</label>
            <div className="row col-sm-4">
              <input
                type="text"
                className="form-control"
                placeholder="ต้นทุนต่อจำนวน"
                value={CostesPerQuantities} // แสดงค่า CostesPerQuantities ที่คำนวณได้
                readOnly // ตั้งค่าให้อ่านได้อย่างเดียว
              />
            </div>
          </div>

        {/* <div className="mb-3">
          <label className="form-label">Upload Picture</label>
          <input 
            type="file" 
            className="form-control" 
            id="fileInput" 
            placeholder=".png /.jpeg /.pdf"
            onChange={(e) => setPicture(e.target.files[0])}
          />
        </div> */}

          <div className="d-md-flex justify-content-center" style={{margin:'5%'}}>
            <button className="btn btn-secondary me-5" type="button" style={{ width: '100px', height: '40px' }}>ล้าง</button>
            <button className="btn btn-primary ms-5" type="submit" style={{ width: '100px', height: '40px' }}>เพิ่ม</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default createMaterial;