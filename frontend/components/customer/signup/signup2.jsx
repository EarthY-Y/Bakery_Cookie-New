import React ,{useContext,useState, useEffect}from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../API/signUpService';
import { createCustomer } from '../../../API/signUpService';
import ErrorPopup from '../../untils/popUp/errorPopup';
import LoadingPopup from '../../untils/popUp/loading';

const Signup2 = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { formData, setFormData } = useContext(FormContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trimStart() });
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); //ต้องมี เพราะ ป้องกันการรีเฟรชหน้าเว็บของ form, ควบคุมการส่งข้อมูลเอง
    setIsLoading(true);
    try {
      const response = await createCustomer(formData)
      console.log('Form Submitted:', response);
      if (response.data.status === "success") {
        console.log(response.data.message);  // Log ข้อความที่ได้จากหลังบ้าน
        navigate('/Login');
      } else {
        throw new Error(response.data.message);  // ข้อความข้อผิดพลาด
      }
    } catch (error) {
      console.log('Error submitting form:', error);
      setError(error);
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="px-5 card-body">
              <h3 className="mb-4 card-title text-center">สมัครสมาชิก</h3>

              <form onSubmit={handleSubmit} encType="multipart/form-data">
               <div className="row mb-4">
                  <label htmlFor="user" className="col-3 col-auto col-form-label">ชื่อผู้ใช้</label>
                  <div className="col-8">
                    <input name='username' type="text" minLength={5} onChange={handleChange} value={formData.username} required className="form-control" id="user" placeholder="ชื่อผู้ใช้"/>
                  </div>
               </div>

               <div className="row mb-4">
                  <label htmlFor="password" className="col-3 col-auto col-form-label">รหัสผ่าน</label>
                  <div className="col-8">
                    <input name='password' type="password" minLength={5} onChange={handleChange} value={formData.password} required className="form-control" id="password" placeholder="รหัสผ่าน"/>
                  </div>
               </div>

               <div className="row mb-4">
                 <label htmlFor="confirm password" className="col-3 col-auto col-form-label">ยืนยันรหัสผ่าน</label>
                 <div className="col-8">
                   <input name='confPassword' type="password" minLength={5} onChange={handleChange} value={formData.confPassword} required className="form-control" id="confirmPassword" placeholder="ยืนยันรหัสผ่าน"/>
                 </div>
               </div>
                
               <div className="mb-4 row justify-content-center">
                  <div className="col-5">
                    <Link to="/signup">
                    <button style={{ backgroundColor: '#F2EEB0'}} type="back" className="btn btn-outline-dark w-100">ย้อนกลับ</button>
                    </Link>
                  </div>
                  <div className="col-5">
                    <button style={{ backgroundColor: '#FFE194'}} type="submit" className="btn btn-outline-dark w-100">สมัครสมาชิก</button>
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
      {error && (
        <ErrorPopup message={error} text="เข้าสู่ระบบล้มเหลว" onClose={() => setError(null)} />
      )}
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
  );
};

export default Signup2;