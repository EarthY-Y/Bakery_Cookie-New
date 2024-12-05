import React, { useEffect, useState} from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { listShippingPackageService, createShippingService } from '../../../API/admin/shippingCostService';
import { Link } from 'react-router-dom';

const createShipping = () => {
  const [carrierName, setcarrierName] = useState("");
  const [serviceType, setserviceType] = useState("");
  const [weightRangeMin, setWeightRangeMin] = useState("");
  const [weightRangeMax, setWeightRangeMax] = useState("");
  const [price, setPrice] = useState("");
  const [listPackage, setListPackage] = useState([]);
  const [packageId, setPackageId] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(carrierName, serviceType, weightRangeMin, weightRangeMax, price, deliveryDays, packageId);
      
      const res = await createShippingService(carrierName, serviceType, weightRangeMin, weightRangeMax, price, deliveryDays, packageId);
      navigate(-1);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(()=> {
    
    const getListShippingPackage = async() =>{
      try {
        const response = await listShippingPackageService()
        console.log(response.data)
        setListPackage(response.data)
      } catch (error) {
        
      }
    }
    getListShippingPackage()
  },[]) 

  const options = listPackage.map((packages) => ({
    value: packages.package_id,
    label: packages.package_name
  })) || [];
  return (
    <div className="container mt-5 p-3">
      <Link className="btn btn-outline-secondary mb-4" to="/shipping">
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </Link>
      <div className="mb-4 card col-md-12 px-40 bg-light card-body">
        <h4>เพิ่มการขนส่ง</h4>
        <form onSubmit={handleSubmit} encType="multipart/form-data">

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อบริษัทข่นส่ง</label>
            <div className="row col-sm-4">
              <input type="text" className="form-control" placeholder="ไปรษณีย์ไทย" 
                value={carrierName} 
                onChange={(e) => setcarrierName(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ประเภทขนส่ง</label>
            <div className="row col-sm-4">
              <input type="text" className="form-control" placeholder="เช่น EMS" value={serviceType}onChange={(e) => setserviceType(e.target.value)}/>
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">น้ำหนักน้อยสุด</label>
            <div className="row col-sm-4">
              <input type="number" className="form-control" placeholder="หน่วยเป็นกรัม" value={weightRangeMin} onChange={(e) => setWeightRangeMin(e.target.value)} />
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">น้ำหนักมากสุด</label>
            <div className="row col-sm-4">
              <input type="number" className="form-control" placeholder="หน่วยเป็นกรัม" value={weightRangeMax} onChange={(e) => setWeightRangeMax(e.target.value)} />
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ราคาค่าส่ง</label>
            <div className="row col-sm-4">
              <input type="number" className="form-control" placeholder="59 (หน่วยเป็นบาท)" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">เวลาที่ใช้</label>
            <div className="row col-sm-4">
              <input type="number" className="form-control" placeholder="หน่วยเป็นวัน" value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} />
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">เลือกบรรจุภัณฑ์</label>
            <div className="row col-sm-4">
              <Select options={options} value={options.find((option) => option.value === packageId) || null} onChange={(selectedOption) => setPackageId(selectedOption ? selectedOption.value : null)} isSearchable={true} placeholder="เลือกบรรจุภัณฑ์" />
            </div>
          </div>


          <div className="d-flex justify-content-center gap-3 my-4">
            <button className="btn btn-secondary mt-3 px-4 me-5" type="button">ล้าง</button>
            <button className="btn btn-success mt-3 px-4 ms-5" type="submit">เพิ่ม</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default createShipping;