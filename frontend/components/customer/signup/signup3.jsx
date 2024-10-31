import React, { useContext,useState, useEffect } from 'react';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../API/signUpService';


const Signup3 = () => {
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedAmphure, setSelectedAmphure] = useState(null);
  const { formData, setFormData } = useContext(FormContext);
  const navigate = useNavigate();
  useEffect(() => {
    const getProvinces = async () => {const response = await axios.get("http://localhost:5000/getProvice")
      console.log(response);
      setProvinces(response.data)
    }
    getProvinces()
  }, []);
  useEffect( () => {
    console.log(selectedProvince);
    
      if (selectedProvince) {
          axios.get(`http://localhost:5000/amphure/${selectedProvince}`)
              .then(response => setAmphures(response.data))
              .catch(error => console.error("Error fetching amphures:", error));
      } else {
          setAmphures([]);
      }
  }, [selectedProvince]);
  useEffect( () => {
    if (selectedAmphure) {
        axios.get(`http://localhost:5000/tambon/${selectedAmphure}`)
            .then(response => setTambons(response.data))
            .catch(error => console.error("Error fetching tambons:", error));
    } else {
        setTambons([]);
    }
  }, [selectedAmphure]);

  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="px-5 card-body">
              <h3 className="mb-4 card-title text-center">สมัครสมาชิก</h3>

              <form >
               <div className="row mb-4">
                  <label htmlFor="home number" className="col-3 col-auto col-form-label">บ้านเลขที่</label>
                  <div className="col-8">
                    <input name='homeNumber' type="text" className="form-control" id="homeNumber" placeholder="บ้านเลขที่"/>
                  </div>
               </div>

               <div className="row mb-4">
                <label htmlFor="subdistrict" className="col-3 col-auto col-form-label">จังหวัด</label>
                <div className="col-8">
                  <select onChange={(e) => setSelectedProvince(e.target.value)} className="form-select" defaultValue="">
                    <option value="" disabled>Select Province</option>
                    {provinces.map((province) => (
                        <option name='province' key={province.province_id}  value={province.province_id}>
                            {province.province_nameTH}
                        </option>
                    ))}
                  </select>
                </div>
               </div>

               <div className="row mb-4">
                  <label htmlFor="district" className="col-3 col-auto col-form-label">เขต/อำเภอ</label>
                  <div className="col-8">
                    <select onChange={(e) => setSelectedAmphure(e.target.value)} className="form-select" defaultValue="" disabled={!selectedProvince}>
                      <option value="" disabled>Select Amphure</option>
                      {amphures.map((amphure) => (
                          <option name='district' key={amphure.amphure_id} value={amphure.amphure_id}>
                              {amphure.amphure_nameTH}
                          </option>
                      ))}
                    </select>
                  </div>
               </div>

               <div className="row mb-4">
                  <label htmlFor="province" className="col-3 col-auto col-form-label">แขวง/ตำบล</label>
                  <div className="col-8">
                    <select defaultValue="" className="form-select" disabled={!selectedAmphure}>
                    <option value="" disabled >Select Tambon</option>
                      {tambons.map((tambon) => (
                        <option name='subdistrict' key={tambon.tambon_id} value={tambon.tambon_id}>
                            {tambon.tambon_nameTH}
                        </option>
                      ))}
                    </select>
                  </div>
               </div>

               <div className="row mb-4">
                 <label htmlFor="postal code" className="col-3 col-auto col-form-label">รหัสไปรษณีย์</label>
                 <div className="col-8">
                   <input name='postCode' type="text"  value={formData.postCode} className="form-control" id="postalCode" placeholder="รหัสไปรษณีย์"/>
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