import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import liff from '@line/liff'
import { getDeatialCustomerService, updateInfoCustomer, createConnectionLineIDService, checkConnectionLineIDService } from '../../../../API/customer/customerService';
import LoadingPopup from '../../../untils/popUp/loading';
import ErrorPopup from '../../../error/errorPopup';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE
const API_LINE_LOGIN = import.meta.env.LINE_LOGIN
// console.log(API_LINE_LOGIN); //ใช้ .env ไม่ได้ได้ค่ามาเป็น undefine

const profile = () => {
  const [Picture, setPicture] = useState(null);
  const [detailCustomer, setDetailCustomer] = useState([])
  const [customerName, setCustomerName] = useState("")
  const [customerFName, setCustomerFName] = useState("")
  const [customerLName, setCustomerLName] = useState("")
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(true);
  const [checkLoginLine, setCheckLoginLine] = useState([])
  const [error, setError] = useState(null);
  useState(()=>{
    setIsLoading(true)
    const getInfoCustomer = async() => {
      const [
        getDeatialCustomer,
      ] = await Promise.all([
        getDeatialCustomerService(),
      ])
      console.log(getDeatialCustomer);
      
      setDetailCustomer(getDeatialCustomer.data[0])
      setPicture(getDeatialCustomer.data[0]?.customerpic)
      setCustomerName(getDeatialCustomer.data[0]?.username)
      setCustomerFName(getDeatialCustomer.data[0]?.f_name)
      setCustomerLName(getDeatialCustomer.data[0]?.l_name)
      setCustomerPhoneNumber(getDeatialCustomer.data[0]?.phone_number)
    }
    getInfoCustomer()
  }, [])

  const handleLoginLine = async() =>{
    await liff.init({liffId: '2006630207-agRmBy9G' }) // Use own liffId
    if(!liff.isLoggedIn()){
      liff.login() //ทำการ login ผ่าน Line
      return false
    }
  }

  useEffect(() => {
    const connectionLineAccount = async() => {
      const getCkeckLoginLine = await checkConnectionLineIDService()
      setCheckLoginLine(getCkeckLoginLine.data[0])
      if(!getCkeckLoginLine.data[0].provider_login_id){
        await liff.init({liffId: '2006630207-agRmBy9G' })
        if(liff.isLoggedIn()){
          const profile = await liff.getProfile()
          console.log(profile);
          if(profile){
            try {
              const connentLineID = await createConnectionLineIDService(profile, "LINE")
              console.log(connentLineID);
              setIsLoading(false)
            } catch (error) {
              setError(error);
              liff.logout()
              console.log(error);
              setIsLoading(false)
            }
          }
        }
      }
      setIsLoading(false)
    }
    connectionLineAccount()
  },[])

  const handleSubmit = async(event) =>{
    event.preventDefault();
    setIsLoading(true)
    const updatedData = {};
    const formData = new FormData();
    
    if (customerName !== detailCustomer.username) updatedData.username = customerName;
    if (customerFName !== detailCustomer.f_name) updatedData.f_name = customerFName;
    if (customerLName !== detailCustomer.l_name) updatedData.l_name = customerLName;
    if (customerPhoneNumber !== detailCustomer.phone_number ) updatedData.phone_number = customerPhoneNumber;

    if (Picture instanceof File) {
      updatedData.file = Picture;
    } else if (typeof Picture === 'string') {
      updatedData.customerpic = Picture;
    }

    if (Object.keys(updatedData).length === 0) {
      console.log(updatedData);      
      alert('ไม่มีข้อมูลที่เปลี่ยนแปลง');
      return;
    }
    for (const key in updatedData) {
      formData.append(key, updatedData[key]);
    }
    // Log ข้อมูลใน formData
    console.log('FormData Entries:');
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    try {
      const response = await updateInfoCustomer(detailCustomer.customer_id,formData)
    } catch (error) {
      setError(error)
    }finally{
      setIsLoading(false)
    }
    
  }
  return (
    <div className="p-4">
    <h4>ข้อมูลของฉัน</h4>
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="mb-3 text-center">
        <div className="position-relative" style={{margin: '2%', width: '100px', height: '100px', border: '1px dashed #ccc', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
          {Picture ? (
            <img src={typeof Picture === 'string' ? API_URL_PICTURE + Picture : URL.createObjectURL(Picture)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>อัปโหลดรูปประจำตัว</span>
          )}
          <input type="file"className="position-absolute top-0 start-0 w-100 h-100"style={{ opacity: 0, cursor: 'pointer' }}onChange={(e) => {  const file = e.target.files[0];  setPicture(file);}}/>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">ชื่อผู้ใช้</label>
        <input type="text" className="form-control" value={customerName} onChange={(e) => setCustomerName(e.target.value)}/>
      </div>
      <div className='row'>
        <div className="col-6 mb-3">
          <label className="form-label">ชื่อ</label>
          <input type="text" className="form-control" placeholder="ใส่ชื่อ" value={customerFName} onChange={(e) => setCustomerFName(e.target.value)} />
        </div>
        <div className="col-6 mb-3">
          <label className="form-label">นามสกุล</label>
          <input type="text" className="form-control" placeholder="ใส่ชื่อ" value={customerLName} onChange={(e) => setCustomerLName(e.target.value)} />
        </div>
      </div>
      <Link type="botton" className="btn btn-danger col-3 mb-2" to="changePassword">เปลี่ยนรหัสผ่าน</Link>
      <div className="mb-3">
        <label className="form-label">หมายเลขโทรศัพท์</label>
        <input type="text" className="form-control" value={customerPhoneNumber} onChange={(e) => setCustomerPhoneNumber(e.target.value)} />
      </div>
      {/* <div className="mb-3">
        <label className="form-label">เพศ</label>
        <div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="gender" id="male" />
            <label className="form-check-label" htmlFor="male">ชาย</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="gender" id="female" />
            <label className="form-check-label" htmlFor="female">หญิง</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="gender" id="other" />
            <label className="form-check-label" htmlFor="other">อื่นๆ</label>
          </div>
        </div>
      </div> 
      <div className="mb-3">
        <label className="form-label">วันเดือนปีเกิด</label>
        <div className="d-flex gap-2">
          <select className="form-select" aria-label="Day">
            <option value="">วัน</option>
          </select>
          <select className="form-select" aria-label="Month">
            <option value="">เดือน</option>
          </select>
          <select className="form-select" aria-label="Year">
            <option value="">ปี</option>
          </select>
        </div>
      </div>*/}
      <div className='row justify-content-between mt-4'>
        <div className='col-12 col-md-9'>
          <label className="form-label col-4 col-md-2 small">เชื่อมต่อ</label>
          {checkLoginLine.provider_login_id ? (
            <button style={{ backgroundColor: '#00cc00' }} type="button" onClick={handleLoginLine} disabled={true} className="btn btn-outline-dark col-8 col-md-5 small" >
              เชื่อมต่อ LINE ID เเล้ว
            </button>
          ) : (
            <button style={{ backgroundColor: '#00cc00' }} type="button" onClick={handleLoginLine} className="btn btn-outline-dark col-12 col-md-8 small" >
              เชื่อมต่อ LINE ID
            </button>
          )}
        </div>
        <div className="col-12 col-md-3 mt-2 mt-md-0">
          <button type="submit" className="btn btn-danger col-12">บันทึก</button>
        </div>
      </div>

      {error && (
        <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />
      )}
    </form>
    <LoadingPopup
      isLoading = {isLoading}
    />
    {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
  </div>
  );
};

export default profile;