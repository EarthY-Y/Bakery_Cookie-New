import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { packageDetailByIdService } from '../../../API/admin/packageService';
import { formatDate } from '../../untils/frommatters/datetime';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const ListPackageById = () => {
  const { id } = useParams();
  const [packageById, setpackageById] = useState([])

  useEffect(() => {
    const getpackageById = async () => {
      try {
        const response = await packageDetailByIdService(id)
        console.log(response);
        if (!response.data) {
          throw new Error("ไม่มีข้อมูล")
        }
        setpackageById(response.data[0])
      }

      catch (error) {
        alert(error)
      }
    }
    getpackageById()
  }, [])

  return (
    <div className="container mt-5 p-4 border rounded shadow-sm bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/package" className="btn btn-outline-secondary">
          ย้อนกลับ
        </Link>
      </div>

      <div className="text-center mb-4">
        <img
          src={API_URL_PICTURE + packageById.package_pic || null}
          height={250}
          width={400}
          alt="Material"
          className="rounded"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">รหัสบรรจุภัณฑ์</label>
        <p className="border p-2 rounded bg-white">{packageById.package_id}</p>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">ชื่อบรรจุภัณฑ์</label>
        <p className="border p-2 rounded bg-white">{packageById.package_name}</p>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">ต้นทุนบรรจุภัณฑ์</label>
        <p className="border p-2 rounded bg-white">{packageById.cost}</p>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">ปริมาณที่ทำ/ครั้ง</label>
        <p className="border p-2 rounded bg-white">{packageById.quantity}</p>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">ราคา/ชิ้น</label>
        <p className="border p-2 rounded bg-white">{packageById.cost_per_quantity}</p>
      </div>

      <div className="mb-3 row">
        <div className='col-6'>
          <label className="form-label fw-bold ">สร้างโดย</label>
          <p className="border p-2 rounded bg-white">{packageById.created_by}</p>
        </div>
        <div className='col-6'>
          <label className="form-label fw-bold ">เวลา</label>
          <p className="border p-2 rounded bg-white">{formatDate(packageById.created_at)}</p>
        </div>
      </div>

      <div className="text-center mt-4">
        {/* <Link to={`/material/edit/${packageById.material_id}`} className="text-center mt-3 px-4 btn btn-outline-warning text-black">Edit</Link> */}
      </div>
    </div>

  );
};

export default ListPackageById;