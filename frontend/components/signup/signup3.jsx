import React from 'react';
import { Link } from 'react-router-dom';

const Signup3 = () => {
  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="px-5 card-body">
              <h3 className="mb-4 card-title text-center">สมัครสมาชิก</h3>

              <form>
               <div className="row mb-4">
                  <label htmlFor="home number" className="col-3 col-auto col-form-label">บ้านเลขที่</label>
                  <div className="col-8">
                    <input type="home number" className="form-control" id="home number" placeholder="บ้านเลขที่"/>
                  </div>
               </div>

               <div className="row mb-4">
                  <label htmlFor="subdistrict" className="col-3 col-auto col-form-label">แขวง/ตำบล</label>
                  <div className="col-8">
                    <input type="subdistrict" className="form-control" id="subdistrict" placeholder="แขวง/ตำบล"/>
                  </div>
               </div>

               <div className="row mb-4">
                  <label htmlFor="district" className="col-3 col-auto col-form-label">เขต/อำเภอ</label>
                  <div className="col-8">
                    <input type="district" className="form-control" id="district" placeholder="เขต/อำเภอ"/>
                  </div>
               </div>

               <div className="row mb-4">
                 <label htmlFor="province" className="col-3 col-auto col-form-label">จังหวัด</label>
                 <div className="col-8">
                   <input type="province" className="form-control" id="province" placeholder="จังหวัด"/>
                 </div>
               </div>

               <div className="row mb-4">
                 <label htmlFor="postal code" className="col-3 col-auto col-form-label">รหัสไปรษณีย์</label>
                 <div className="col-8">
                   <input type="postal code" className="form-control" id="postal code" placeholder="รหัสไปรษณีย์"/>
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
                    <Link to="/signup2">
                    <button style={{ backgroundColor: '#F2EEB0'}} type="goback" className="btn btn-outline-dark w-100">ย้อนกลับ</button>
                    </Link>
                  </div>
                  <div className="col-5">
                    <Link to="/signup3"
                    style={{ backgroundColor: '#FFE194'}} type="submit" className="btn btn-outline-dark w-100">สมัครสมาชิก
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

export default Signup3;