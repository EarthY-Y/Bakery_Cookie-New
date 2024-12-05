import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { updateMaterialService, listMaterialByIdService } from '../../../API/admin/materialService';
import { Link, useParams } from 'react-router-dom';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const EditMaterial = () => {
  const [materialMyId, setMaterialMyId] = useState({});
  const [MaterialName, setMaterialName] = useState("");
  const [Quantities, setQuantity] = useState("");
  const [Costes, setCost] = useState("");
  const [CostesPerQuantities, setCostesPerQuantities] = useState("");
  const [NewCostesPerQuantities, setNewCostesPerQuantities] = useState("");
  const [NewQuantity, setNewQuantity] = useState("");
  const [TotalQuantity, setTotalQuantity] = useState("");
  const [Picture, setPicture] = useState(null); // เก็บทั้งรูปที่ดึงจากฐานข้อมูลและรูปใหม่ที่อัพโหลด
  const navigate = useNavigate();
  const { id } = useParams();
  
  // useEffect สำหรับดึงข้อมูลวัตถุดิบ
  useEffect(() => {
    const getlistMaterialById = async () => {
      try {
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
        alert(error);
      }
    };
    getlistMaterialById();
  }, [id]);
  // ฟังก์ชัน handleSubmit สำหรับจัดการเมื่อกด submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedData = {};
      const formData = new FormData();
      
      if (MaterialName !== materialMyId.material_name) updatedData.material_name = MaterialName;
      if (TotalQuantity !== materialMyId.quantity) updatedData.quantity = TotalQuantity;
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
      navigate('/material');
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const addMaterial = () => {
    const quantity = Quantities, newquantity = parseFloat(NewQuantity)
    const sum =  quantity + newquantity
    console.log(sum)
    setTotalQuantity(sum)
  }

  const minusMaterial = () => {
    const quantity = Quantities, newquantity = parseFloat(NewQuantity)
    const sum =  quantity - newquantity
    console.log(sum)
    setTotalQuantity(sum)
  }

  useEffect(() => {
    // ตรวจสอบให้แน่ใจว่า Quantities และ Costes มีค่า และ Quantities ไม่เป็น 0
    //ราคาไม่เท่า เเละ ปริมาณเปลี่ยน
    if ( Costes != materialMyId.cost && NewQuantity != 0 ) {
      console.log(parseFloat(Costes) , materialMyId.cost ,parseFloat(NewQuantity) , materialMyId.quantity);
      const costPerQuantity = (parseFloat(Costes) + materialMyId.cost) / TotalQuantity;
      setNewCostesPerQuantities(costPerQuantity); // ปัดเป็นทศนิยม 2 ตำแหน่ง //!อาจจะต้องหา lib มาช่วยคำนวน
    }
    //ราคาเปลี่ยน เเต่ว่า ปริมาณเท่าเดิม
    else if ( Costes != materialMyId.cost || TotalQuantity == materialMyId.quantity ) {
      console.log(parseFloat(Costes) , parseFloat(Quantities));
      const costPerQuantity = parseFloat(Costes) / parseFloat(Quantities)
      setNewCostesPerQuantities(costPerQuantity);
    }
    //ปริมาณเปลี่ยน เเต่ ราคาเท่าเดิม
    else if ( NewQuantity != materialMyId.quantity && Costes == materialMyId.cost) {
      const costPerQuantity = materialMyId.cost / parseFloat(TotalQuantity)
      setNewCostesPerQuantities(costPerQuantity);
    }
    else {
      setNewCostesPerQuantities(CostesPerQuantities);
    }
  }, [TotalQuantity , Costes, NewQuantity]); 

  return (
    <div className="container mt-5 p-3">
      <Link className="btn btn-outline-secondary mb-4" to="/material">
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </Link>
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
              <input
                type="file"
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ opacity: 0, cursor: 'pointer' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPicture(file);
                }}
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
            <label className="col-sm-2 col-form-label">จำนวนวัตถุดิบเดิม</label>
            <div className="row col-sm-4">
              <input
                type="number"
                className="form-control"
                placeholder="จำนวนวัตถุดิบ"
                value={Quantities}
                onChange={(e) => setQuantity(e.target.value)}
                readOnly
              />
            </div>
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">จำนวนวัตถุดิบใหม่</label>
            <div className="row col-sm-4">
              <input
                type="number"
                className="form-control"
                placeholder="จำนวนวัตถุดิบ"
                value={NewQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label"></label>
            <div className="row col-sm-4">
              <button className="mb-2 btn btn-primary ms-5" type="button" style={{ width: '100px', height: '40px' }} onClick={() => addMaterial()}>เพิ่มวัตถุดิบ</button> {/* type="button" เพื่อไม่ให้ถูกตีว่าเป็นการกด submit */}
              <button className="btn btn-danger ms-5" type="button" style={{ width: '100px', height: '40px' }} onClick={() => minusMaterial()}>ลดวัตถุดิบ</button>
            </div>
          </div>


          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ผลลัพธ์จำนวนวัตถุดิบ</label>
            <div className="row col-sm-4">
              <input
                type="number"
                className="form-control"
                placeholder="จำนวนวัตถุดิบ"
                value={TotalQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                readOnly
              />
            </div>
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนวัตถุดิบที่ซื้อมา</label>
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
            <label className="col-sm-2 col-form-label">ต้นทุนต่อปริมาณ</label>
            <div className="row col-sm-4">
              <input
                type="number"
                className="form-control"
                placeholder={CostesPerQuantities}
                value={NewCostesPerQuantities}
                onChange={(e) => setCost(e.target.value)}
                readOnly
              />
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 my-4">
            <button className="btn btn-secondary mt-3 px-4 me-5" type="button">ล้าง</button>
            <button className="btn btn-success mt-3 px-4 ms-5" type="submit">บันทึกข้อมูล</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaterial;
