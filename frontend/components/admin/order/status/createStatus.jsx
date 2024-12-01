import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CreateStatusCartService } from '../../../../API/admin/ordersService';
import { Link } from 'react-router-dom';

const createStatus = () => {
  const [statusName, setStatusName] = useState("");
  const [statusfor, setStatusfor] = useState("");
  const [statusId, setStatusId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(statusId,statusName);      
      const res = await CreateStatusCartService(statusId,statusName,statusfor); //จะส่งไปเป็น formData เเบบนี้ได้ต้องผ่าน multer ก่อน
      navigate('/status');
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (statusfor && statusName) {
      const CreatetatusId = `${statusfor}-${statusName}`;
      setStatusId(CreatetatusId);
    } else {
      setStatusId();
    }
  }, [statusfor, statusName]);
  
  return (
    <div className="container mt-5">
      <Link className="btn btn-outline-secondary mb-4" to="/status">
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </Link>
      <div className="mb-4 card col-md-12 px-40 card-body">
        <h4>เพิ่มสถานะ</h4>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mb-4 mt-4 justify-content-center">
            <label className="col-sm-2 col-form-label">สถานะของ</label>
            <div className="row col-sm-4">
            <select className="form-select" onChange={(e) => setStatusfor(e.target.value)} value={statusfor}  required aria-label="Default select example">
              <option value="">เลือก</option>
              <option value="cart">ตะกร้าสินค้า</option>
              <option value="order">คำสั่งซื้อ</option>
              {/* <option value="3">Three</option> */}
            </select>
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
            <button className="btn btn-success mt-3 px-4 ms-5" type="submit">เพิ่ม</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default createStatus;