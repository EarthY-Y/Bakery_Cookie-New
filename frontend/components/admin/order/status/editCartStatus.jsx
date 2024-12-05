import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { updateStatusCartServiceById, getStatusCartServiceById } from '../../../../API/admin/ordersService';
import { Link } from 'react-router-dom';

const editStatus = () => {
  const id = useParams().id
  const [statusName, setStatusName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(statusName);      
      const res = await updateStatusCartServiceById(id, statusName); //จะส่งไปเป็น formData เเบบนี้ได้ต้องผ่าน multer ก่อน
      navigate('/status');
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await getStatusCartServiceById(id);
        console.log(res.data);
        setStatusName(res.data[0]?.status_name);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getOrders();
  }, []);  
  
  return (
    <div className="container mt-5 p-3">
      <Link className="btn btn-outline-secondary mb-4" to="/status">
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </Link>
      <div className="mb-4 card col-md-12 px-40 bg-light card-body">
        <h4>แก้ไขสถานะ</h4>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mb-4 mt-4 justify-content-center">
            <label className="col-sm-2 col-form-label">สถานะของ</label>
            <div className="row col-sm-4">
              <p className='form-control'>ตะกร้าสินค้า</p>
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อสถานะ</label>
            <div className="row col-sm-4">
              <input type="text" className="form-control" required placeholder="เช่น ยกเลิก, ปรับเปลี่ยนราคา" 
                value={statusName}
                onChange={(e) => setStatusName(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 my-4">
            <button className="btn btn-secondary mt-3 px-4 me-5" type="button">ล้าง</button>
            <button className="btn btn-success mt-3 px-4 ms-5" type="submit">บันทึก</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default editStatus;