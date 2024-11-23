import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDeatialCustomer, updateInfoCustomer } from '../../../../API/customer/customerService';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const profile = () => {
  const [Picture, setPicture] = useState(null);
  const [detialCustomer, setDetialCustomer] = useState([])
  const [customerName, setCustomerName] = useState("")
  const [customerFName, setCustomerFName] = useState("")
  const [customerLName, setCustomerLName] = useState("")
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("")
  // const [customerName, setCustomerName] = useState("")
  useState(()=>{
    const getInfoCustomer = async() => {
      const response = await getDeatialCustomer()
      console.log(response);
      setDetialCustomer(response.data[0])
      setPicture(response.data[0]?.customerpic)
      setCustomerName(response.data[0]?.username)
      setCustomerFName(response.data[0]?.f_name)
      setCustomerLName(response.data[0]?.l_name)
      setCustomerPhoneNumber(response.data[0]?.phone_number)
    }
    getInfoCustomer()
  })

  const handleSubmit = async(event) =>{
    event.preventDefault();
    const updatedData = {};
    const formData = new FormData();
    
    if (customerName !== detialCustomer.username) updatedData.username = customerName;
    if (customerFName !== detialCustomer.f_name) updatedData.f_name = customerFName;
    if (customerLName !== detialCustomer.l_name) updatedData.l_name = customerLName;
    if (customerPhoneNumber !== detialCustomer.phone_number ) updatedData.phone_number = customerPhoneNumber;

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
      const response = await updateInfoCustomer(detialCustomer.customer_id,formData)
    } catch (error) {
      
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
            <span>เพิ่มรูปวัตถุดิบ</span>
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
      <button type="submit" className="btn btn-danger">บันทึก</button>
    </form>
  </div>
  );
};

export default profile;