import React, { useEffect, useState } from 'react';
import liff from '@line/liff'
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../API/authService';
import ErrorPopup from '../../untils/popUp/errorPopup';
import LoadingPopup from '../../untils/popUp/loading';

const API_LINE_LOGIN = import.meta.env.VITE_LINE_LOGIN

const Login = () => {
  const [userName, setuserName] = useState("");
  const [passWord, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  //หาไม่เจอผู้ใช้งานในระบบจะเเจ้งเตือน เเละทำการ logout แต่จะเช็คก่อนว่ามีการ login อยู่หรือไม่
  useEffect(() =>{
    const LineAuth = async() => {
      await liff.init({liffId: API_LINE_LOGIN, }) 
      if(liff.isLoggedIn()){
        liff.logout()
        setError('ผู้ใช้ไม่ได้ผูกบัญชี LINE กับระบบ')
      }
    }
    LineAuth()
  },[])

  const handleLoginLine = async() =>{
    try {
      if(!liff.isLoggedIn()){
        liff.login() //ทำการ login ผ่าน Line
      }
      // else{
      //   liff.logout()
      //   setError('ไม่พบผู้ใช้งานในระบบ')
      // }
    } catch (error) {
      if(liff.isLoggedIn()){
        liff.logout()
      }
      console.log(error);
      setError(error);
    }
  }
  // login ด้วย userName password
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    try {
      const res = await login(userName, passWord); 
      console.log(res.data);
      res.data.token ? localStorage.setItem('token' , res.data.token) : localStorage.setItem('tokenAdmin' , res.data.tokenAdmin);
      const userRole = res.data.role;
      if (userRole === 'user') {
        setIsLoading(false)
        navigate("/home");
      }
      if(userRole === 'admin'){
        setIsLoading(false)
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err);
    }finally{
      setIsLoading(false)
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
                <div className="col-6 text-center">
                  {/* <button style={{ backgroundColor: '#F2EEB0' }} onClick={() => navigate(-1)} type="button" className="btn btn-outline-dark w-100">กลับ</button> */}
                  <button style={{ backgroundColor: '#00cc00' }} type="button" onClick={handleLoginLine} className="btn btn-outline-dark col-12" >เข้าสู่ระบบด้วย LINE </button>
                </div>
                <div className="col-6 text-center">
                  <button style={{ backgroundColor: '#A8E5F8' }} type="submit" className="btn btn-outline-dark w-100">เข้าสู่ระบบ</button>
                </div>
              </div>
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
    </form>
  );
};


export default Login;
