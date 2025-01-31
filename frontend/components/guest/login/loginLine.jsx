import React, { useEffect, useState } from 'react';
import liff from '@line/liff'
import { Link, useNavigate } from 'react-router-dom';
import { login, loginLINE } from '../../../API/authService';
import ErrorPopup from '../../untils/popUp/errorPopup';
import LoadingPopup from '../../untils/popUp/loading';

const API_LINE_LOGIN = import.meta.env.LINE_LOGIN

const Login = () => {
  const [userName, setuserName] = useState("");
  const [passWord, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);;

  useEffect(() => {
    const checkLoginLine = async() => {
      setIsLoading(true)
      try {
        await liff.init({liffId: '2006630207-4ENd2JnL' })
        if(!liff.isLoggedIn()){
          liff.login() //ทำการ login ผ่าน Line
          return false
        }
        const profile = await liff.getProfile()
        console.log(profile);
        const LoginLine = await loginLINE(profile)
        console.log(LoginLine);
        localStorage.setItem('token', LoginLine.data.token);
        const userRole = LoginLine.data.role;
        if (userRole === 'user') {
          setIsLoading(false)
          navigate("/home");
        }
      } catch (error) {
        setIsLoading(false)
        setError(error); //จะได้ใช้ก็ต่อเมื่อไม่ได้ navigate ไปหน้าอื่น
        navigate("/login");
      }finally{
        setIsLoading(false)
      }
    }
    checkLoginLine()
  },[])


  return (
    <div className='container mt-5'>
      <div className="row justify-content-center">
      <div className="col-lg-6 col-md-7 col-sm-9"> {/* ปรับขนาดคอลัมน์ให้สมส่วน */}
        <div className="card shadow-sm">
          <div className="card-body px-5 py-4">
            <h3 className="mb-4 text-center card-title">เข้าสู่ระบบ</h3>
            <div className="row mb-3">
              <label className="col-3 col-form-label">ชื่อผู้ใช้</label>
              <div className="col-9">
                <input type="text" className="form-control" placeholder="ชื่อผู้ใช้" value={userName} onChange={(e) => setuserName(e.target.value)}/>
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="password" className="col-3 col-form-label">รหัสผ่าน</label>
              <div className="col-9">
                <input type="password" className="form-control" placeholder="รหัสผ่าน" value={passWord} onChange={(e) => setPassword(e.target.value)}/>
              </div>
            </div>
            {/* <div className="text-end mb-4">
              <a href="#" className="small">ลืมรหัสผ่าน</a>
            </div> */}
            <div className="row mb-3 justify-content-center">
              <div className="col-5 text-center">
                <button style={{ backgroundColor: '#F2EEB0' }} type="button" className="btn btn-outline-dark w-100">กลับ</button>
              </div>
              <div className="col-5 text-center">
                <button style={{ backgroundColor: '#A8E5F8' }} type="submit" className="btn btn-outline-dark w-100">เข้าสู่ระบบ</button>
              </div>
            </div>
            <button style={{ backgroundColor: '#00cc00' }} type="button"  className="btn btn-outline-dark w-100" >เข้าสู่ระบบด้วย LINE </button>
            <div className="text-center mt-3">
              <p className="small">ยังไม่ได้เป็นสมาชิก? <Link to="/signup">สมัครสมาชิก</Link></p>
            </div>
          </div>
        </div>
        {error && (
          <ErrorPopup message={error} text="เข้าสู่ระบบล้มเหลว" onClose={() => setError(null)} />
        )}
        </div>
     </div>
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
    
  );
};


export default Login;
