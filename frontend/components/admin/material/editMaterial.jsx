import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createMaterialService, listMaterialByIdService } from '../../../API/materialService';
import { Link, useParams } from 'react-router-dom';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const EditMaterial = () => {
  const [materialMyId, setMaterialMyId] = useState({});
  const [MaterialName, setMaterialName] = useState("");
  const [Quantities, setQuantity] = useState("");
  const [Costes, setCost] = useState("");
  const [Picture, setPicture] = useState(null); // เก็บทั้งรูปที่ดึงจากฐานข้อมูลและรูปใหม่ที่อัพโหลด
  const navigate = useNavigate();
  const { id } = useParams();

  // ฟังก์ชัน handleSubmit สำหรับจัดการเมื่อกด submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('material_name', MaterialName || materialMyId.material_name);
      formData.append('quantity', Quantities || materialMyId.quantity);
      formData.append('cost', Costes || materialMyId.cost);
      formData.append('file', Picture); // ส่งรูปภาพที่เลือกใหม่ไปยัง server

      const res = await createMaterialService(formData);
      navigate('/material');
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect สำหรับดึงข้อมูลวัตถุดิบ
  useEffect(() => {
    const getlistMaterialById = async () => {
      try {
        const response = await listMaterialByIdService(id);
        if (!response.data) {
          throw new Error("ไม่มีข้อมูล");
        }
        setMaterialMyId(response.data[0]);
        setMaterialName(response.data[0].material_name);
        setQuantity(response.data[0].quantity);
        setCost(response.data[0].cost);
        setPicture(API_URL_PICTURE + response.data[0].materialpic_name); // ตั้งค่าให้ Picture เป็นชื่อไฟล์รูปจากฐานข้อมูล
      } catch (error) {
        alert(error);
      }
    };
    getlistMaterialById();
  }, [id]);

  return (
    <div className="container mt-5">
      <Link className="btn btn-light text-black mb-4" to="/material">
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </Link>
      <div className="mb-4 card col-md-12 px-40 rounded shadow-sm border bg-light card-body">
        <h>แก้ไขวัตถุดิบ</h>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3 text-center">
            <div
              className="position-relative"
              style={{
                margin: '2%',
                width: '100px',
                height: '100px',
                border: '1px dashed #ccc',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {Picture ? (
                // ถ้ามี Picture จะสร้าง URL สำหรับแสดงรูปที่ดึงจากฐานข้อมูลหรือรูปที่อัพโหลดใหม่
                <img src={typeof Picture === 'string' ? Picture : URL.createObjectURL(Picture)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>เพิ่มรูปวัตถุดิบ</span>
              )}
              <input
                type="file"
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ opacity: 0, cursor: 'pointer' }}
                onChange={(e) => setPicture(e.target.files[0])}
              />
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อวัตถุดิบ</label>
            <div className="row col-sm-4">
              <input
                type="text"
                className="form-control"
                placeholder="ชื่อวัตถุดิบ"
                value={MaterialName}
                onChange={(e) => setMaterialName(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนวัตถุดิบ</label>
            <div className="row col-sm-4">
              <input
                type="number"
                className="form-control"
                placeholder="ต้นทุนวัตถุดิบ"
                value={Costes}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">จำนวนวัตถุดิบ</label>
            <div className="row col-sm-4">
              <input
                type="number"
                className="form-control"
                placeholder="จำนวนวัตถุดิบ"
                value={Quantities}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="d-md-flex justify-content-center" style={{ margin: '5%' }}>
            <button className="btn btn-secondary me-5" type="button" style={{ width: '100px', height: '40px' }}>ล้าง</button>
            <button className="btn btn-primary ms-5" type="submit" style={{ width: '100px', height: '40px' }}>แก้ไข</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaterial;
