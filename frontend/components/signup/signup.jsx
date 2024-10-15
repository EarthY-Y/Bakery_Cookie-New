import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="px-5 card-body">
              <h3 className="mb-4 card-title text-center">สมัครสมาชิก</h3>

              <form>
               <div className="row mb-4">
                  <label htmlFor="fname" className="col-3 col-auto col-form-label">ชื่อ</label>
                  <div className="col-8">
                    <input type="fname" className="form-control" id="fname" placeholder="ชื่อ"/>
                  </div>
               </div>

               <div className="row mb-4">
                  <label htmlFor="sname" className="col-3 col-auto col-form-label">นามสกุล</label>
                  <div className="col-8">
                    <input type="sname" className="form-control" id="sname" placeholder="นามสกุล"/>
                  </div>
               </div>

               <div className="row mb-4">
                  <label htmlFor="email" className="col-3 col-auto col-form-label">อีเมล</label>
                  <div className="col-8">
                    <input type="email" className="form-control" id="email" placeholder="อีเมล"/>
                  </div>
               </div>

               <div className="row mb-4">
                 <label htmlFor="phone" className="col-3 col-auto col-form-label">เบอร์โทรศัพท์</label>
                 <div className="col-8">
                   <input type="phone" className="form-control" id="phone" placeholder="เบอร์โทรศัพท์"/>
                 </div>
               </div>

                <div className="mb-4 row justify-content-center">
                  <div className="col-5">
                    <Link to="/Login">
                    <button style={{ backgroundColor: '#F2EEB0'}} type="goback" className="btn btn-outline-dark w-100">ย้อนกลับ</button>
                    </Link>
                  </div>
                  <div className="col-5">
                    <Link to="/signup2">
                    <button style={{ backgroundColor: '#C1F2B0'}} type="ok" className="btn btn-outline-dark w-100">ยืนยัน</button>
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

export default Signup;