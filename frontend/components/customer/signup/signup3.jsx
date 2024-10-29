import React, {useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../API/signUpService';
import { createCustomer } from '../../../API/signUpService';

const Signup3 = () => {
  const { formData, setFormData } = useContext(FormContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); //ต้องมี เพราะ ป้องกันการรีเฟรชหน้าเว็บของ form, ควบคุมการส่งข้อมูลเอง
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
      alert('Error submitting form');
      navigate('/Login');
    }
  };
  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="px-5 card-body">
              <h3 className="mb-4 card-title text-center">สมัครสมาชิก</h3>

              <form onSubmit={handleSubmit} encType="multipart/form-data">
               <div className="row mb-4">
                  <label htmlFor="home number" className="col-3 col-auto col-form-label">บ้านเลขที่</label>
                  <div className="col-8">
                    <input name='homeNumber' type="text" onChange={handleChange} value={formData.homeNumber} className="form-control" id="homeNumber" placeholder="บ้านเลขที่"/>
                  </div>
               </div>

               <div className="row mb-4">
                  <label htmlFor="subdistrict" className="col-3 col-auto col-form-label">แขวง/ตำบล</label>
                  <div className="col-8">
                    <input name='subdistrict' type="text" onChange={handleChange} value={formData.subdistrict} className="form-control" id="subdistrict" placeholder="แขวง/ตำบล"/>
                  </div>
               </div>

               <div className="row mb-4">
                  <label htmlFor="district" className="col-3 col-auto col-form-label">เขต/อำเภอ</label>
                  <div className="col-8">
                    <input name='district' type="text" onChange={handleChange} value={formData.district} className="form-control" id="district" placeholder="เขต/อำเภอ"/>
                  </div>
               </div>

               <div className="row mb-4">
                 <label htmlFor="province" className="col-3 col-auto col-form-label">จังหวัด</label>
                 <div className="col-8">
                   <input name='province' type="text" onChange={handleChange} value={formData.province} className="form-control" id="province" placeholder="จังหวัด"/>
                 </div>
               </div>

               <div className="row mb-4">
                 <label htmlFor="postal code" className="col-3 col-auto col-form-label">รหัสไปรษณีย์</label>
                 <div className="col-8">
                   <input name='postCode' type="text" onChange={handleChange} value={formData.postCode} className="form-control" id="postalCode" placeholder="รหัสไปรษณีย์"/>
                 </div>
               </div>

               <div className="mb-4 row justify-content-center">
                  <div className="col-5">
                    <Link to="/signup/step2">
                    <button style={{ backgroundColor: '#F2EEB0'}} type="goback" className="btn btn-outline-dark w-100">ย้อนกลับ</button>
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
    </div>
  );
};

export default Signup3;