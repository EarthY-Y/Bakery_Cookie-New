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
        const initialSelected = response.data.map((item) => item.package_id); //map เอาเเค่ package_id
        setSelectedPackages(initialSelected);
      } catch (error) {
        
      }
    }
    getCategoryById()
  },[])
  
  return (
    <div className="container mt-5">
      <button className="btn btn-light text-black mb-4" onClick={() => {navigate(-1)}}>
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </button>
      <div className="mb-4 card col-md-12 px-40 card-body bg-light shadow">
        <h4></h4>
        <div className="mb-4 ">
          <b className="col-form-label">ชื่อประเภทสินค้า</b>
          <input type="text" className="form-control" value={categoryName} readOnly/>
        </div>
        <div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th className="text-center align-middle" style={{ width: '25%' }} >รูปสินค้า</th>
                <th className="text-center align-middle" style={{ width: '25%' }} >ชื่อสินค้า</th>
              </tr>
            </thead>
            <tbody>
              {listCategoryPackage.map((packages) => (
                <tr key={packages.package_id}>
                  <td><img src={API_URL_PICTURE + packages.package_pic } className="img-fluid" alt={"ไม่มีสินค้าในประเภทนี้"} style={{ maxHeight: '100px', maxWidth: '120px' }}/></td>
                  <td>{packages.package_name}</td>
                  {/* <td className="text-center">
                    <Link to={`view/detail/packages/${packages.orders_id}`} className="btn btn-outline-warning text-black">View</Link>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row mb-4 ">
          <div className='col-6'>
            <b className="col-form-label">สร้างโดย</b>
            <input type="text" className="form-control" value={listCategoryPackage[0]?.created_by}readOnly/>
          </div>
          <div className='col-6'>
            <b className="col-form-label">วันเวลาที่สร้าง</b>
            <input type="text" className="form-control" value={formatDate(listCategoryPackage[0]?.created_at)}readOnly/>
          </div>
        </div>
        <div className="row mb-4 ">
          <div className='col-6'>
            <b className="col-form-label">เเก้ไขโดย</b>
            <input type="text" className="form-control" value={listCategoryPackage[0]?.updated_by} readOnly/>
          </div>
          <div className='col-6'>
            <b className="col-form-label">วันเวลาที่เเก้ไข</b>
            <input type="text" className="form-control" value={formatDate(listCategoryPackage[0]?.updated_at)}readOnly/>
          </div>
        </div>
        {/* <div className="d-md-flex justify-content-center" style={{margin:'5%'}}>
          <button className="btn btn-secondary me-5" type="button" style={{ width: '100px', height: '40px' }}>ล้าง</button>
          <button className="btn btn-primary ms-5" type="submit" style={{ width: '100px', height: '40px' }}>เพิ่ม</button>
        </div> */}
      </div>
    </div>
  );
};

export default CategoryPackageById;