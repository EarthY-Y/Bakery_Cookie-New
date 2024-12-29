import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../API/signUpService';

const Signup = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useContext(FormContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); //...formData อัปเดทเฉพาะฟิลด์นั้นๆ เรียกว่า Spread Operator
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/signup/step2');
  }
  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="px-5 card-body">
              <h3 className="mb-4 card-title text-center">สมัครสมาชิก</h3>

              <form onSubmit={handleSubmit}>
                <div className="row mb-4">
                  <label htmlFor="fname" className="col-3 col-auto col-form-label">ชื่อ</label>
                  <div className="col-8">
                    <input name='f_name' type="text" minLength={5} onChange={handleChange} value={formData.f_name} required className="form-control" id="fname" placeholder="ชื่อ" />
                  </div>
                </div>

                <div className="row mb-4">
                  <label htmlFor="sname" className="col-3 col-auto col-form-label">นามสกุล</label>
                  <div className="col-8">
                    <input name='l_name' type="text" minLength={5} onChange={handleChange} value={formData.l_name} required className="form-control" id="sname" placeholder="นามสกุล" />
                  </div>
                </div>

                {/* <div className="row mb-4">
                  <label htmlFor="email" className="col-3 col-auto col-form-label">อีเมล</label>
                  <div className="col-8">
                    <input type="email" onChange={handleChange} value={formData.username}  className="form-control" id="email" placeholder="อีเมล"/>
                  </div>
               </div> */}

                <div className="row mb-4">
                  <label htmlFor="phone" className="col-3 col-auto col-form-label">เบอร์โทรศัพท์</label>
                  <div className="col-8">
                    <input name='phone_number' type="number" onInput={(e) => { // type number นั้นไม่ได้ถูกออกเเบบมาให้ใช้กับเลข 0 เลยไม่สามารถเช็คความยาวได้ถ้าใส่เลข 0 ลงใน input
                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                      }else if(e.target.value.length !== 10){
                        e.target.setCustomValidity('กรุณากรอกเฉพาะตัวเลข 10 หลัก');
                      }else{
                        e.target.setCustomValidity('');
                      }
                    }}
                      onChange={handleChange} value={formData.phone_number} required className="form-control" id="phone" placeholder="เบอร์โทรศัพท์" />
                  </div>
                </div>

                {/* เป็นการเช็คอีกเเบบ เเตกต่างตรง type ที่ใช้ */}
                {/* <div className="row mb-4">
                  <label htmlFor="phone" className="col-3 col-auto col-form-label">เบอร์โทรศัพท์</label>
                  <div className="col-8">
                    <input name='phone_number' type="text" onInput={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) { // ตรวจสอบเฉพาะตัวเลข
                        e.target.setCustomValidity(''); // ล้างข้อความแสดงข้อผิดพลาด
                      } else {
                        e.target.setCustomValidity('กรุณากรอกเฉพาะตัวเลขเท่านั้น');
                      }
                    }}
                      onChange={handleChange} minLength={10} maxLength={10} value={formData.phone_number} required className="form-control" id="phone" placeholder="เบอร์โทรศัพท์" />
                  </div>
                </div> */}

                <div className="mb-4 row justify-content-center">
                  <div className="col-5">
                    <Link to="/Login">
                      <button style={{ backgroundColor: '#F2EEB0' }} type="button" className="btn btn-outline-dark w-100">ย้อนกลับ</button>
                    </Link>
                  </div>
                  <div className="col-5">
                    <button
                      style={{ backgroundColor: '#C1F2B0' }} type="submit" className="btn btn-outline-dark w-100">ยืนยัน
                    </button>
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