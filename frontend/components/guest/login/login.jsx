import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../API/authService';
import { Modal } from '../../error/errorPopup';
const Login = () => {
  const [userName, setuserName] = useState("");
  const [passWord, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await login(userName, passWord); 
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      const userRole = res.data.role;
      if (userRole === 'admin') {
        navigate("/dashboard");
      } else if (userRole === 'user') {
        navigate("/home");
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card px-5 card-body">
                <h3 className="mb-4 card-title text-center">เข้าสู่ระบบ</h3>
                <div className="row mb-4">
                  <label className="col-3 col-auto col-form-label">ชื่อผู้ใช้</label>
                  <div className="col-8">
                    <input type="text" className="form-control" id="email" placeholder="ชื่อผู้ใช้"
                      value={userName} 
                      onChange={(e) => setuserName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row">
                  <label htmlFor="password" className="col-3 col-auto col-form-label">รหัสผ่าน</label>
                  <div className="col-8">
                    <input type="password" className="form-control" id="password" placeholder="รหัสผ่าน" 
                      value={passWord}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4 text-end col-11">
                  <a href="#" className="small">ลืมรหัสผ่าน</a>
                </div>
                <div className="mb-4 row justify-content-center">
                  <div className="col-5">
                    <button style={{ backgroundColor: '#F2EEB0' }} type="button" className="btn btn-outline-dark w-100">กลับ</button>
                  </div>
                  <div className="col-5">
                    <button style={{ backgroundColor: '#A8E5F8' }} type="submit" className="btn btn-outline-dark w-100">เข้าสู่ระบบ</button>
                  </div>
                </div>
                <div className="mb-4 text-end col-11">
                  <div className="mt-3 text-center">
                    <p className="small">ยังไม่ได้เป็นสมาชิก? <Link to="/signup">สมัครสมาชิก</Link></p>
                  </div>
                </div>
              </div>
            </div>
            {error && (  // เมื่อ error มีค่าจะ แสดง Pop-up ถ้ามีข้อผิดพลาด
              <Modal message={error} onClose={() => setError(null)} />
            )}
          </div>
        </div>
      </div>
    </form>
  );
};


export default Login;
