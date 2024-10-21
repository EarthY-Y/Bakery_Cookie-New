import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../admin/layOut/footer/footer';

const Login = () => {
  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body px-4">
              <h3 className="mb-4 card-title text-center">เข้าสู่ระบบ</h3>
              <form>
               <div className="row mb-4">
                  <label htmlFor="email" className="col-3 col-auto col-form-label">อีเมล</label>
                  <div className="col-8">
                    <input type="email" className="form-control" id="email" placeholder="อีเมล หรือ เบอร์โทรศัพท์"/>
                  </div>
               </div>
                <div className="row">
                  <label htmlFor="password" className="col-3 col-auto col-form-label">รหัสผ่าน</label>
                  <div className="col-8">
                    <input type="password" className="form-control" id="password" placeholder="รหัสผ่าน" />
                  </div>
                </div>
                <div className="mb-4 text-end col-11">
                  <a href="#" className="small">ลืมรหัสผ่าน</a>
                </div>
                <div className="mb-4 row justify-content-center">
                  <div className="col-5">
                    <button style={{ backgroundColor: '#F2EEB0'}} type="back" className="btn btn-outline-dark w-100">กลับ</button>
                  </div>
                  <div className="col-5">
                    <button style={{ backgroundColor: '#A8E5F8'}} type="submit" className="btn btn-outline-dark w-100">เข้าสู่ระบบ</button>
                  </div>
               </div>
               <div className="mt-3 text-center">
                <p className="small">ยังไม่ได้เป็นสมาชิก? <Link to="/signup">สมัครสมาชิก</Link></p>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 