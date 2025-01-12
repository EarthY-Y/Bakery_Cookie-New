import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate,Link, useParams } from 'react-router-dom';
import { manageCustomerServiceById, manageCustomerAddressServiceById, updateCustomerActiveServiceById } from '../../../API/admin/manageCustomerService';
import { formatDate } from '../../untils/frommatters/datetime';
import LoadingPopup from '../../untils/popUp/loading';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_CUSTOMER

const manageCustomerById = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [manageCustomerById, setManageCustomerById] = useState([])
  const [manageCustomerAddressById, setManageCustomerAddressById] = useState([])
  const [Picture, setPicture] = useState(null);
  const [active, setStatusactive] = useState("1");
  const [isLoading, setIsLoading] = useState(true);
  
  // useEffect สำหรับดึงข้อมูลวัตถุดิบ
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          getCustomerById,
          getCustomerAddressById,
        ] = await Promise.all([
          manageCustomerServiceById(id),
          manageCustomerAddressServiceById(id),
        ])
        console.log(getCustomerById, getCustomerAddressById);
        
        setManageCustomerById(getCustomerById.data[0])
        setPicture(getCustomerById.data[0]?.customerpic || "ไม่มีข้อมูลรูปภาพ")
        setStatusactive(getCustomerById.data[0].is_active)

        setManageCustomerAddressById(getCustomerAddressById.data)
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() =>{
    const updateActiveCustomer = async() => {
      try {
        const response = await updateCustomerActiveServiceById(id, active)
        console.log(response)
      } catch (error) {
        console.log(error);
      }
    }
    updateActiveCustomer()
  },[active]) //ติดปัญหาที่เข้ามาเเล้วมันก็จะ update ให้เลย

  return (
    <div className="container mt-5 p-3">
      <div className="mb-4 card bg-light p-4 card-body">
        <div className="mb-3 text-center">
          <div className="position-relative bg-white" style={{margin: '2%', width: '250px', height: '250px', bcustomerAddress: '1px dashed #ccc', bcustomerAddressRadius: '5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
            {Picture ? (
              // ถ้ามี Picture จะสร้าง URL สำหรับแสดงรูปที่ดึงจากฐานข้อมูลหรือรูปที่อัพโหลดใหม่
              <img src={typeof Picture === 'string' ? API_URL_PICTURE + Picture : URL.createObjectURL(Picture)} alt={Picture} style={{ width: '100%', bcustomerAddressRadius: '5px', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>ไม่มีรูปภาพ</span>
            )}
          </div>
        </div>
        <div className='row mb-4'>
          <div className="col-sm-6 col-12">
            <label className="col-12 col-form-label">ชื่อจริง</label>
            <div className="row col-12">
              <p className="bcustomerAddress p-2 rounded bg-white">{manageCustomerById.f_name}</p>
            </div>
          </div>
          <div className="col-sm-6 col-12">
            <label className="col-12 col-form-label">นามสกุล</label>
            <div className="row col-12">
              <p className="bcustomerAddress p-2 rounded bg-white">{manageCustomerById.l_name}</p>
            </div>
          </div>
        </div>
        <div className='row mb-4'>
          <div className="col-sm-6 col-12">
            <label className="col-12 col-form-label">ชื่อบัญชีผู้ใช้</label>
            <div className="row col-12">
              <p className="bcustomerAddress p-2 rounded bg-white">{manageCustomerById.username}</p>
            </div>
          </div>
          <div className="col-sm-6 col-12">
            <label className="col-12 col-form-label">เบอร์โทรศัพท์</label>
            <div className="row col-12">
              <p className="bcustomerAddress p-2 rounded bg-white">{manageCustomerById.phone_number}</p>
            </div>
          </div>
        </div>
        <div className='row mb-4'>
          <div className="col-sm-6 col-12">
            <label className="col-12 col-form-label">วันที่สร้าง</label>
            <div className="row col-12">
              <p className="bcustomerAddress p-2 rounded bg-white">{formatDate(manageCustomerById.created_at)}</p>
            </div>
          </div>
          <div className="col-sm-6 col-12">
            <label className="col-12 col-form-label">วันที่เเก้ไข</label>
            <div className="row col-12">
              <p className="bcustomerAddress p-2 rounded bg-white">{formatDate(manageCustomerById.updated_at)}</p>
            </div>
          </div>
        </div>
        <div className="row mb-4 justify-content-end">
          {/* col จะใช้กับหน้าจอขนาด <576 เเต่ว่าพวก sm จะใช้ >= 576 ทำให้ถ้าใช้หน้าจอมือถือการตั้ง sm จะไม่โชว์ต้องใช้ col ต่างจากพวก d-sm-block ที่จะโชว์ให้จอขนาดเล็ก  */}
          <label className="col-sm-1 col-12 col-form-label">การใช้งาน</label>
          <div className="col-sm-5 me-2">
            <select className="form-select" onChange={(e) => setStatusactive(e.target.value)} value={active}  required aria-label="Default select example" placeholder="เลือก">
              <option value="1">ใช้งาน</option>
              <option value="0">ไม่ใช้งาน</option>
            </select>
          </div>
        </div>
        <div className="d-none d-md-block">
          <label className="form-label fw-bold">รายการคำสั่งซื้อ</label>
          <table className="table table-striped table-hover table-bcustomerAddressed rounded-3 overflow-hidden">
            <thead className="table-success">
              <tr className="text-center align-middle">
                <th style={{ width: '10%' }}>รายการที่</th>
                <th style={{ width: '80%' }}>รายละเอียดที่อยู่</th>
              </tr>
            </thead>
            <tbody>
              {manageCustomerAddressById.map((customerAddress, index) => (
                <tr key={index}>
                  <td className='h6'>{index + 1}</td>
                  <td className='h6'>{customerAddress.houseNo}, ตำบล: {customerAddress.tambon_nameTH}, อำเภอ: {customerAddress.amphure_nameTH}, จังหวัด: {customerAddress.province_nameTH}, รหัสไปรษณีย์: {customerAddress.zip_code} </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-block d-md-none mt-3">
          <label className="form-label fw-bold">รายการที่อยู่</label>
          <div className="bcustomerAddress rounded p-3 bg-white">
            {manageCustomerAddressById.map((customerAddress, index) => (
              <div key={index}>
                <div className="d-flex">
                  <h6 className="mb-2" style={{ marginRight: "10px" }}>{index + 1}</h6>
                  <div className="ms-3 d-flex flex-column w-100">
                  <div className="small">
                    <h6 className="mb-2">{customerAddress.houseNo}, ตำบล: {customerAddress.tambon_nameTH}, อำเภอ: {customerAddress.amphure_nameTH}, จังหวัด: {customerAddress.province_nameTH}, รหัสไปรษณีย์: {customerAddress.zip_code}</h6>
                  </div>
                  </div>
                </div>
                {index < manageCustomerAddressById.length - 1 && <hr />}
              </div>
            ))}
          </div>
        </div>
      </div>
      <LoadingPopup
          isLoading = {isLoading}
        />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
  );
};

export default manageCustomerById;
