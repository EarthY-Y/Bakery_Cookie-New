import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryOrderStatusByIdService } from '../../../../API/admin/categoryOrderStatusService';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../untils/frommatters/datetime';
import LoadingPopup from '../../../untils/popUp/loading';
import ErrorPopup from '../../../untils/popUp/errorPopup';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const CategoryStatusOrderById = () => {
  const {id} = useParams()
  const [categoryName, setCategoryName] = useState("");
  const [listCategoryOrderStatus, setListCategoryOrderStatus] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCategoryById = async() => {
      try {
        const response = await getCategoryOrderStatusByIdService(id)
        console.log(response.data);
        setListCategoryOrderStatus(response.data)
        setCategoryName(response.data[0]?.category_status_order_name || '')
      } catch (error) {
        setError(error)
      }finally{
        setIsLoading(false)
      }
    }
    getCategoryById()
  },[])
  
  return (
    <div className="container mt-5 p-3">
      <button className="btn btn-outline-secondary mb-4" onClick={() => {navigate(-1)}}>
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </button>
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
                <th className="text-center align-middle" style={{ width: '25%' }} >ชื่อประเภทสถานะคำสั่งซื้อ</th>
              </tr>
            </thead>
            <tbody>
              {listCategoryOrderStatus.map((orderStatus) => (
                <tr key={orderStatus.status_order_id}>
                  <td>{orderStatus.status_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">สร้างโดย</label>
            <p className="border p-2 rounded bg-white">{listCategoryOrderStatus[0]?.userNameCreate || "ยังไม่มีผู้เเก้ไข"}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">วันเวลาที่สร้าง</label>
            <p className="border p-2 rounded bg-white">{formatDate(listCategoryOrderStatus[0]?.created_at)}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">เเก้ไขโดย</label>
            <p className="border p-2 rounded bg-white">{listCategoryOrderStatus[0]?.userNameUpdate || "ยังไม่มีผู้เเก้ไข"}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">วันเวลาที่เเก้ไข</label>
            <p className="border p-2 rounded bg-white">{formatDate(listCategoryOrderStatus[0]?.updated_at) || ""}</p>
          </div>
        </div>
        {/* <div className="d-md-flex justify-content-center" style={{margin:'5%'}}>
          <button className="btn btn-secondary me-5" type="button" style={{ width: '100px', height: '40px' }}>ล้าง</button>
          <button className="btn btn-primary ms-5" type="submit" style={{ width: '100px', height: '40px' }}>เพิ่ม</button>
        </div> */}
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

export default CategoryStatusOrderById;