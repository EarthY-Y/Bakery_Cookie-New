import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { updateStatusOrderServiceById, getStatusOrderServiceById } from '../../../../API/admin/ordersService';
import { Link } from 'react-router-dom';

const editOrderStatus = () => {
  const id = useParams().id
  const [statusName, setStatusName] = useState("");
  const [active, setStatusactive] = useState("ใช้งาน");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(statusName);      
      const res = await updateStatusOrderServiceById(id, statusName,active); //จะส่งไปเป็น formData เเบบนี้ได้ต้องผ่าน multer ก่อน
      navigate(-1);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await getStatusOrderServiceById(id);
        console.log(res.data);
        setStatusName(res.data[0]?.status_name);
        setStatusactive(res.data[0]?.is_active)
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getOrders();
  }, []);  
  
  return (
    <div className="container mt-5 p-3">
      <div className="mb-4 card col-md-12 px-40 bg-light card-body">
        <h4>แก้ไขสถานะ</h4>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mb-4 mt-4 justify-content-center">
            <label className="col-sm-2 col-form-label">สถานะของ</label>
            <div className="row col-sm-4">
              <p className='form-control'>รายการคำสั่งซื้อ</p>
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
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">การใช้งาน</label>
            <div className="row col-sm-4">
              <select className="form-select" onChange={(e) => setStatusactive(e.target.value)} value={active}  required aria-label="Default select example" placeholder="เลือก">
                <option value="1">ใช้งาน</option>
                <option value="0">ไม่ใช้งาน</option>
                {/* <option value="3">Three</option> */}
              </select>
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

export default editOrderStatus;