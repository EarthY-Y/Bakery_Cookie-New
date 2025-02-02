import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { packageDetailByIdService } from '../../../API/admin/packageService';
import { formatDate } from '../../untils/frommatters/datetime';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_PACKAGE

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
    <div className="container mt-5 p-3">
      <div className="mb-4 card col-md-12 px-40 rounded shadow border bg-light card-body">
        <div className="text-center mb-4">
          <img
            src={API_URL_PICTURE + packageById.package_pic || null}
            height={250}
            width={400}
            alt="Material"
            className="rounded img-fluid"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">ชื่อบรรจุภัณฑ์</label>
          <p className="border p-2 rounded bg-white">{packageById.package_name}</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">ต้นทุนบรรจุภัณฑ์</label>
          <p className="border p-2 rounded bg-white">{packageById.cost} บาท</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">จำนวนทั้งหมด/ชุด</label>
          <p className="border p-2 rounded bg-white">{packageById.quantity} ชิ้น</p>
        </div>

        <div className="">
          <label className="form-label fw-bold">ราคา/ชิ้น</label>
          <p className="border p-2 rounded bg-white">{packageById.cost_per_quantity} บาทต่อชิ้น</p>
        </div>

        <div className="mb-3 row">
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">สร้างโดย</label>
            <p className="border p-2 rounded bg-white">{packageById.created_by}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">เวลา</label>
            <p className="border p-2 rounded bg-white form-control">{formatDate(packageById.created_at)}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">สร้างโดย</label>
            <p className="border p-2 rounded bg-white">{packageById.updated_by}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">เวลา</label>
            <p className="border p-2 rounded bg-white form-control">{formatDate(packageById.updated_at)}</p>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link to={`/package/edit/${id}`} className="text-center mt-3 px-4 btn btn-warning"><i className="bi bi-pencil"></i> แก้ไข </Link>
        </div>
      </div>
    </div>

  );
};

export default ListPackageById;