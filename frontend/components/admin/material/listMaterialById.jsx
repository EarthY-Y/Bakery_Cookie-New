import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createMaterialService } from '../../../API/admin/materialService';
import { Link, useParams } from 'react-router-dom';
import { listMaterialByIdService } from '../../../API/admin/materialService';
import { formatDate } from '../../untils/frommatters/datetime';
import LoadingPopup from '../../untils/popUp/loading';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_MATERIAL

const listMaterialById = () => {
  const {id} = useParams();
  const [materialMyId, setMaterialMyId] = useState([])
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getlistMaterialById = async()=> {
      try {
        setIsLoading(true);
        const response = await listMaterialByIdService(id)
        console.log(response);
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        setMaterialMyId(response.data[0])
      }
      
      catch (error) {
        alert(error)
      }finally{
        setIsLoading(false)
      }
    }
    getlistMaterialById()
  },[])

  return (
    <div className="container mt-5 p-3">
      <Link to="/material" className="btn btn-outline-secondary mb-4">
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </Link>
      <div className="mb-4 card col-md-12 px-40 rounded shadow border bg-light card-body">
        <div className="text-center mb-4">
          <img
            src={API_URL_PICTURE + materialMyId.materialpic_name}
            height={250}
            width={400}
            alt="Material"
            className="rounded img-fluid"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">รหัสวัตถุดิบ</label>
          <p className="border p-2 rounded bg-white">{materialMyId.material_id}</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">ชื่อวัตถุดิบ</label>
          <p className="border p-2 rounded bg-white">{materialMyId.material_name}</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">ต้นทุนวัตถุดิบ</label>
          <p className="border p-2 rounded bg-white">{materialMyId.cost}</p>
        </div>

        <div className="">
          <label className="form-label fw-bold">ปริมาณ</label>
          <p className="border p-2 rounded bg-white">{materialMyId.quantity}</p>
        </div>

        <div className="mb-3 row">
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold ">สร้างโดย</label>
            <p className="border p-2 rounded bg-white">{materialMyId.userName}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">เวลา</label>
            <p className="border p-2 rounded bg-white">{formatDate(materialMyId.created_at)}</p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to={`/material/edit/${materialMyId.material_id}`} className="text-center mt-3 px-4 btn btn-warning"><i className="bi bi-pencil"></i> แก้ไข </Link>
        </div>
      </div>
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
  );
};

export default listMaterialById;