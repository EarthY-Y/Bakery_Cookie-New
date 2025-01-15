import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { listShippingByIdService } from '../../../API/admin/shippingCostService';
import { formatDate } from '../../untils/frommatters/datetime';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const listShippingById = () => {
  const {id} = useParams();
  const [shippingMyId, setShippingId] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const getlistShippingById = async()=> {
      try {
        const response = await listShippingByIdService(id)
        console.log(response.data);
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        setShippingId(response.data[0])
      }
      
      catch (error) {
        alert(error)
      }
    }
    getlistShippingById()
  },[])

  return (
    <div className="container mt-5 p-3">
      <div className="mb-4 card col-md-12 px-40 rounded shadow-sm border bg-light card-body">
        <div className="mb-3">
            <label className="form-label fw-bold">ชื่อบริษัทข่นส่ง</label>
            <p className="border p-2 rounded bg-white">{shippingMyId.carrier_name}</p>
        </div>

        <div className="mb-3">
            <label className="form-label fw-bold">ประเภทขนส่ง</label>
            <p className="border p-2 rounded bg-white">{shippingMyId.service_type}</p>
        </div>

        <div className="mb-3">
            <label className="form-label fw-bold">ช่วงน้ำหนัก</label>
            <p className="border p-2 rounded bg-white">{shippingMyId.weight_range_min} กรัม - {shippingMyId.weight_range_max} กรัม</p>
        </div>
        <div className="mb-3">
            <label className="form-label fw-bold">ราคา</label>
            <p className="border p-2 rounded bg-white">{shippingMyId.price}</p>
        </div>
        <div className="mb-3">
            <label className="form-label fw-bold">เวลาที่ใช้</label>
            <p className="border p-2 rounded bg-white">{shippingMyId.estimated_delivery_days}</p>
        </div>
        <div className="">
            <label className="form-label fw-bold">บรรจุภัณฑ์ที่ใช้</label>
            <p className="border p-2 rounded bg-white">{shippingMyId.package_name}</p>
        </div>

        <div className="row">
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">สร้างโดย</label>
            <p className="border p-2 rounded bg-white">{shippingMyId.created_by}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">สร้างเมื่อ</label>
            <p className="border p-2 rounded bg-white">{formatDate(shippingMyId.created_at)}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">เเก้ไขโดย</label>
            <p className="border p-2 rounded bg-white">{shippingMyId.updated_by || "ยังไม่มี"}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">เเก้ไขเมื่อ</label>
            <p className="border p-2 rounded bg-white">{formatDate(shippingMyId.updated_at)}</p>
          </div>
        </div>

        <div className="text-center mt-2">
          <Link to={`/shipping/edit/${id}`} className="text-center px-4 btn btn-warning"><i className="bi bi-pencil"></i> แก้ไข </Link>
        </div>
      </div>
    </div>

  );
};

export default listShippingById;