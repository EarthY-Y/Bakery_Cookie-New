import React from 'react';
import { Link } from 'react-router-dom';

const Signup2 = () => {
  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="px-5 card-body">
              <h3 className="mb-4 card-title text-center">สมัครสมาชิก</h3>

              <form>
               <div className="row mb-4">
                  <label htmlFor="user" className="col-3 col-auto col-form-label">ชื่อผู้ใช้</label>
                  <div className="col-8">
                    <input type="user" className="form-control" id="user" placeholder="ชื่อผู้ใช้"/>
                  </div>
               </div>

               <div className="row mb-4">
                  <label htmlFor="password" className="col-3 col-auto col-form-label">รหัสผ่าน</label>
                  <div className="col-8">
                    <input type="password" className="form-control" id="password" placeholder="รหัสผ่าน"/>
                  </div>
               </div>

               <div className="row mb-4">
                 <label htmlFor="confirm password" className="col-3 col-auto col-form-label">ยืนยันรหัสผ่าน</label>
                 <div className="col-8">
                   <input type="confirm password" className="form-control" id="confirm password" placeholder="ยืนยันรหัสผ่าน"/>
                 </div>
               </div>
                
               <div className="mb-4 row justify-content-center">
                  <div className="col-5">
                    <Link to="/signup">
                    <button style={{ backgroundColor: '#F2EEB0'}} type="back" className="btn btn-outline-dark w-100">ย้อนกลับ</button>
                    </Link>
                  </div>
                  <div className="col-5">
                    <Link to="/signup3"
                    style={{ backgroundColor: '#C1F2B0'}} type="submit" className="btn btn-outline-dark w-100">ยืนยัน
                    </Link>
                  </div>
                </div>

               <div className="mt-3 text-center">
                <p className="small">มีบัญชีอยู่แล้ว ? <Link to="/Login">เข้าสู่ระบบ</Link></p>
               </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup2;