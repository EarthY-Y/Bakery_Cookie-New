import React, { useContext,useState, useEffect } from 'react';
import axios from 'axios'
import { getProvice, getAmphure, getTambon, createAddressCustomer } from '../../../../API/customer/addressService';
import { Link, useNavigate } from 'react-router-dom';
import ErrorPopup from '../../../untils/popUp/errorPopup';

const CreateAddress = () => {
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedAmphure, setSelectedAmphure] = useState(null);
  const [selectedTambon, setSelectedTambon] = useState(null);
  const [postCode, setPostCode] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [provincesId, setProvincesId] = useState("");
  const [amphuresId, setAmphuresId] = useState("");
  const [tambonsId, setTambonsId] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProviceCustomer = async() => {
        try {
            const response = await getProvice()
            if(!response.data){
              throw new Error("ไม่มีข้อมูล")
            }
            console.log(response.data);
            setProvinces(response.data)
          }
          catch (error) {
            setError(error)
          }
      }
    getProviceCustomer()
  }, []);

  useEffect( () => {
    const getAmphureCustomer = async() => {
        try {
            const response = await getAmphure(selectedProvince)
            if(!response.data){
              throw new Error("ไม่มีข้อมูล")
            }
            console.log(response.data);
            setAmphures(response.data)
          }
          catch (error) {
            setError(error)
          }
      }
    getAmphureCustomer()

  }, [selectedProvince]);
  
  useEffect( () => {
    const getTambonCustomer = async() => {
        try {
            const response = await getTambon(selectedAmphure)
            if(!response.data){
              throw new Error("ไม่มีข้อมูล")
            }
            console.log(response.data);
            setTambons(response.data)
          }
          catch (error) {
            setError(error)
          }
      }
    getTambonCustomer()
  }, [selectedAmphure]);

  useEffect( () => {
    const getTambonCustomer = async() => {
        const setSelectedTambon = tambons.find(tambon => tambon.tambon_id === tambonsId);
        setPostCode(setSelectedTambon?.zip_code)
    }
 
    getTambonCustomer()
  }, [selectedTambon]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        console.log(tambonsId, amphuresId, provincesId, houseNo, postCode);
        const res = await createAddressCustomer(tambonsId, amphuresId, provincesId, houseNo, postCode);
        navigate(-1); //-1 เพื่อย้อนกลับไปหน้าก่อนหน้านี้
        console.log(res);
    } catch (err) {
        console.log(err);
    }
  }
  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="px-5 card-body">
              <h3 className="mb-4 card-title text-center">เพิ่มที่อยู่</h3>
              <form onSubmit={handleSubmit} encType="multipart/form-data">

               <div className="row mb-4">
                <label htmlFor="subdistrict" className="col-12 col-lg-3 col-auto col-form-label">จังหวัด</label>
                <div className="col-12 col-lg-8">
                  <select onChange={(e) => {setSelectedProvince(e.target.value); setProvincesId(e.target.value)}} defaultValue="" className="form-select">
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
                  <label htmlFor="district" className="col-12 col-lg-3 col-auto col-form-label">เขต/อำเภอ</label>
                  <div className="col-12 col-lg-8">
                    <select onChange={(e) => {setSelectedAmphure(e.target.value); setAmphuresId(e.target.value)}} defaultValue="" className="form-select" disabled={!selectedProvince}>
                      <option value=""  disabled>Select Amphure</option>
                      {amphures.map((amphure) => (
                          <option name='district' key={amphure.amphure_id} value={amphure.amphure_id}>
                              {amphure.amphure_nameTH}
                          </option>
                      ))}
                    </select>
                  </div>
               </div>

               <div className="row mb-4">
                  <label htmlFor="province" className="col-12 col-lg-3 col-auto col-form-label">แขวง/ตำบล</label>
                  <div className="col-12 col-lg-8">
                    <select className="form-select" onChange={(e) => {setSelectedTambon(e.target.value); setTambonsId(e.target.value)}} defaultValue="" disabled={!selectedAmphure}>
                    <option value=""  disabled >Select Tambon</option>
                      {tambons.map((tambon) => (
                        <option name='subdistrict' key={tambon.tambon_id} value={tambon.tambon_id}>
                            {tambon.tambon_nameTH}
                        </option>
                      ))}
                    </select>
                  </div>
               </div>

               <div className="row mb-4">
                 <label htmlFor="postal code" className="col-12 col-lg-3 col-auto col-form-label">รหัสไปรษณีย์</label>
                 <div className="col-12 col-lg-8">
                   <input name='postCode' type="text" value={postCode || ''} onChange={(e) => {setPostCode(e.target.value)}}  className="form-control" id="postalCode" placeholder="รหัสไปรษณีย์"/>
                 </div>
               </div>
               <div className="row mb-4">
                  <label htmlFor="home number" className="col-12 col-lg-3 col-auto col-form-label">รายละเอียด</label>
                  <div className="col-12 col-lg-8">
                    <input name='homeNumber' type="text" value={houseNo} onChange={(e) => {setHouseNo(e.target.value)}} className="form-control" id="homeNumber" placeholder="บ้านเลขที่,หมุ่ที่,เเยก,ถนน"/>
                  </div>
               </div>

               <div className="mb-4 row justify-content-center">
                  <div className="col-12 col-lg-5">
                    <button style={{ backgroundColor: '#FFE194'}} type="submit" className="btn btn-outline-dark w-100">เพิ่มรายละเอียดที่อยู่</button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
      {error && (
        <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default CreateAddress;