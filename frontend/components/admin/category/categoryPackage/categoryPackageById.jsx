import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getListPackageService, getCategoryPackageByIdService } from '../../../../API/admin/categoryPackageService';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../untils/frommatters/datetime';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const CategoryPackageById = () => {
  const {id} = useParams()
  const [categoryName, setCategoryName] = useState("");
  const [listCategoryPackage, setListCategoryPackage] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategoryById = async() => {
      try {
        const response = await getCategoryPackageByIdService(id)
        console.log(response.data);
        setListCategoryPackage(response.data)
        setCategoryName(response.data[0]?.package_category_name || '')
      } catch (error) {
        
      }
    }
    getCategoryById()
  },[])
  
  return (
    <div className="container mt-5 p-3">
      <div className="mb-4 card col-md-12 px-40 card-body bg-light shadow">
        <h4></h4>
        <div className="mb-4 ">
          <label className="col-form-label">ชื่อประเภทบรรจุภัณฑ์</label>
          <input type="text" className="form-control" value={categoryName} readOnly/>
        </div>
        <div>
          <table className="table table-striped table-bordered rounded-3 overflow-hidden">
            <thead>
              <tr className="table-success">
                <th className="text-center align-middle" style={{ width: '25%' }} >รูปบรรจุภัณฑ์</th>
                <th className="text-center align-middle" style={{ width: '25%' }} >ชื่อบรรจุภัณฑ์</th>
              </tr>
            </thead>
            <tbody>
              {listCategoryPackage.map((packages) => (
                <tr key={packages.package_id}>
                  <td><img src={API_URL_PICTURE + packages.package_pic } className="img-fluid rounded" alt={"ไม่มีสินค้าในประเภทนี้"} style={{ maxHeight: '100px', maxWidth: '120px' }}/></td>
                  <td>{packages.package_name}</td>
                  {/* <td className="text-center">
                    <Link to={`view/detail/packages/${packages.orders_id}`} className="btn btn-outline-warning text-black">View</Link>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">สร้างโดย</label>
            <p className="border p-2 rounded bg-white">{listCategoryPackage[0]?.created_by || ""}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">วันเวลาที่สร้าง</label>
            <p className="border p-2 rounded bg-white">{formatDate(listCategoryPackage[0]?.created_at)}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">เเก้ไขโดย</label>
            <p className="border p-2 rounded bg-white">{listCategoryPackage[0]?.updated_by || "ยังไม่มีผู้เเก้ไข"}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">วันเวลาที่เเก้ไข</label>
            <p className="border p-2 rounded bg-white">{formatDate(listCategoryPackage[0]?.updated_at) || ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPackageById;