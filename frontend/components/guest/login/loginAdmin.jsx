import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../../API/authService';
import ErrorPopup from '../../untils/popUp/errorPopup';

const Login = () => {
  const [userName, setuserName] = useState("");
  const [passWord, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await loginAdmin(userName, passWord); 
      console.log(res.data);
      localStorage.setItem('tokenAdmin', res.data.tokenAdmin);
      const userRole = res.data.role;
      if (userRole === 'admin') {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err);
      navigate("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-7 col-sm-9"> {/* ปรับขนาดคอลัมน์ให้สมส่วน */}
          <div className="card shadow-sm">
            <div className="card-body px-5 py-4">
              <h3 className="mb-4 text-center card-title">เข้าสู่ระบบ</h3>
              <div className="row mb-3">
                <label className="col-3 col-form-label">ชื่อผู้ใช้</label>
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ชื่อผู้ใช้"
                    value={userName}
                    onChange={(e) => setuserName(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="password" className="col-3 col-form-label">รหัสผ่าน</label>
                <div className="col-9">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="รหัสผ่าน"
                    value={passWord}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {/* <div className="text-end mb-4">
                <a href="#" className="small">ลืมรหัสผ่าน</a>
              </div> */}
              <div className="row mb-3 justify-content-center">
                <div className="col-5 text-center">
                  <button
                    style={{ backgroundColor: '#F2EEB0' }}
                    type="button"
                    className="btn btn-outline-dark w-100"
                  >
                    กลับ
                  </button>
                </div>
                <div className="col-5 text-center">
                  <button
                    style={{ backgroundColor: '#A8E5F8' }}
                    type="submit"
                    className="btn btn-outline-dark w-100"
                  >
                    เข้าสู่ระบบ
                  </button>
                </div>
              </div>
              <div className="text-center mt-3">
                <p className="small">
                  ยังไม่ได้เป็นสมาชิก? <Link to="/signup">สมัครสมาชิก</Link>
                </p>
              </div>
            </div>
          </div>
          {error && (
            <ErrorPopup message={error} text="เข้าสู่ระบบล้มเหลว" onClose={() => setError(null)} />
          )}
        </div>
      </div>
    </form>
  );
};


export default Login;
