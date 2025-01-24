import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateStatusCartService } from '../../../../API/admin/ordersService';
import { Link } from 'react-router-dom';

const createStatusOrder = () => {
  const [statusName, setStatusName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(statusName);      
      const res = await CreateStatusCartService(statusName,"order"); //จะส่งไปเป็น formData ได้ต้องผ่าน multer ก่อน
      navigate(-1);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
  
  return (
    <div className="container mt-5 p-3">
      <div className="mb-4 card col-md-12 px-40 bg-light card-body">
        <h4>เพิ่มสถานะ</h4>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            <button className="btn btn-success mt-3 px-4 ms-5" type="submit">เพิ่ม</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default createStatusOrder;