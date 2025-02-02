import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { updateMaterialService, listMaterialByIdService } from '../../../API/admin/materialService';
import { Link, useParams } from 'react-router-dom';
import LoadingPopup from '../../untils/popUp/loading';
import ErrorPopup from '../../untils/popUp/errorPopup';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_MATERIAL

const EditMaterial = () => {
  const [materialMyId, setMaterialMyId] = useState({});
  const [MaterialName, setMaterialName] = useState("");
  const [Quantities, setQuantity] = useState("");
  const [Costes, setCost] = useState("");
  const [CostesPerQuantities, setCostesPerQuantities] = useState("");
  const [NewCostesPerQuantities, setNewCostesPerQuantities] = useState("");
  const [Picture, setPicture] = useState(null); // เก็บทั้งรูปที่ดึงจากฐานข้อมูลและรูปใหม่ที่อัพโหลด
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  
  // useEffect สำหรับดึงข้อมูลวัตถุดิบ
  useEffect(() => {
    const getlistMaterialById = async () => {
      try {
        setIsLoading(true)
        const response = await listMaterialByIdService(id);
        if (!response.data) {
          throw new Error("ไม่มีข้อมูล");
        }
        console.log(response.data);
        
        setMaterialMyId(response.data[0]);
        setMaterialName(response.data[0].material_name);
        setQuantity(response.data[0].quantity);
        setCost(response.data[0].cost);
        setCostesPerQuantities(response.data[0].cost_per_quantity)
        setPicture(response.data[0].materialpic_name); // ตั้งค่าให้ Picture เป็นชื่อไฟล์รูปจากฐานข้อมูล
      } catch (error) {
        setError(error);
      }finally{
        setIsLoading(false)
      }
    };
    getlistMaterialById();
  }, [id]);
  // ฟังก์ชัน handleSubmit สำหรับจัดการเมื่อกด submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true)
      const updatedData = {};
      const formData = new FormData();
      if (MaterialName !== materialMyId.material_name) updatedData.material_name = MaterialName;
      if (Quantities !== materialMyId.quantity) updatedData.quantity = Quantities;
      if (Costes !== materialMyId.cost) updatedData.cost = Costes;
      if (NewCostesPerQuantities) updatedData.cost_per_quantity = NewCostesPerQuantities;
      
      if (Picture instanceof File) {
        formData.append('file', Picture);
      } else if (typeof Picture === 'string') {
        updatedData.materialpic_name = Picture;
      }
    
      if (Object.keys(updatedData).length === 0) {
        alert('ไม่มีข้อมูลที่เปลี่ยนแปลง');
        return;
      }

      for (const key in updatedData) {
        formData.append(key, updatedData[key]);
      }
  
      console.log("FormData ส่งไปยัง Backend: ", Array.from(formData.entries()));
      console.log(formData);
      
      // ส่งข้อมูลไป Backend
      const res = await updateMaterialService(formData, id);
      if(res){
        setIsLoading(false);
        navigate(-1);
      }
      console.log(res);
    } catch (err) {
      console.log(err);
    }finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const newCsotPerQuantity = Costes / Quantities 
    setNewCostesPerQuantities(newCsotPerQuantity)
  },[Quantities, Costes])

  return (
    <div className="container mt-5 p-3">
      <div className="mb-4 card col-md-12 px-40 bg-light card-body">
        <h5>แก้ไขวัตถุดิบ</h5>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3 text-center">
            <div className="position-relative bg-white" style={{margin: '2%', width: '100px', height: '100px', border: '1px dashed #ccc', borderRadius: '5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
              {Picture ? (
                // ถ้ามี Picture จะสร้าง URL สำหรับแสดงรูปที่ดึงจากฐานข้อมูลหรือรูปที่อัพโหลดใหม่
                <img src={typeof Picture === 'string' ? API_URL_PICTURE + Picture : URL.createObjectURL(Picture)} alt="Preview" style={{ width: '100%', borderRadius: '5px', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>เพิ่มรูปวัตถุดิบ</span>
              )}
              <input type="file" className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0, cursor: 'pointer' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPicture(file);
                }}
              />
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อวัตถุดิบ</label>
            <div className="col-sm-4">
              <input type="text" className="form-control" placeholder="ชื่อวัตถุดิบ" value={MaterialName} onChange={(e) => setMaterialName(e.target.value)} />
            </div>
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ปริมาณวัตถุ</label>
            <div className=" col-sm-4">
              <div className="input-group">
                <input type="number" className="form-control" placeholder="จำนวนวัตถุดิบ" value={Quantities} onChange={(e) => setQuantity(e.target.value)} />
                <span className="input-group-text">กรัม</span>
              </div>
            </div>
          </div>
          {/* type="button" เพื่อไม่ให้ถูกตีว่าเป็นการกด submit */}

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนวัตถุดิบที่ซื้อมา</label>
            <div className="col-sm-4">
              <div className="input-group">
                <input type="number" className="form-control" placeholder="ต้นทุนวัตถุดิบ" value={Costes} onChange={(e) => setCost(e.target.value)} />
                <span className="input-group-text">บาท</span>
              </div>
            </div>
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนต่อปริมาณ</label>
            <div className="col-sm-4">
              <div className="input-group">
                <input type="number" className="form-control" placeholder={CostesPerQuantities} value={NewCostesPerQuantities} onChange={(e) => setCost(e.target.value)} readOnly />
                <span className="input-group-text">บาทต่อกรัม</span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 my-4">
            <button className="btn btn-success mt-3 px-4 ms-5" type="submit">บันทึกข้อมูล</button>
          </div>
        </form>
      </div>
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
      {error && (
          <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />
        )}
    </div>
  );
};

export default EditMaterial;
