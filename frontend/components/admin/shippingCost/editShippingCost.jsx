import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { updateShippingService, listShippingByIdService, listShippingPackageService } from '../../../API/admin/shippingCostService';
import { Link, useParams } from 'react-router-dom';

const EditShipping = () => {
  const [shippingMyId, setShippingMyId] = useState([]);
  const [carrierName, setCarrierName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [weightRangeMin, setWeightRangeMin] = useState("");
  const [weightRangeMax, setWeightRangeMax] = useState("");
  const [price, setPrice] = useState("");
  const [packageId, setPackageId] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [listPackage, setListPackage] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  
  // useEffect สำหรับดึงข้อมูลวัตถุดิบ
  useEffect(() => {
    const getlistShippingById = async () => {
      try {
        const response = await listShippingByIdService(id);
        if (!response.data) {
          throw new Error("ไม่มีข้อมูล");
        }
        console.log(response.data);
        
        setShippingMyId(response.data[0]);
        setCarrierName(response.data[0].carrier_name);
        setServiceType(response.data[0].service_type);
        setWeightRangeMin(response.data[0].weight_range_min);
        setWeightRangeMax(response.data[0].weight_range_max)
        setPrice(response.data[0].price)
        setDeliveryDays(response.data[0].estimated_delivery_days)
        setPackageId(response.data[0].package_id)
      } catch (error) {
        alert(error);
      }
    };
    getlistShippingById();
  }, [id]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      
      // ส่งข้อมูลไป Backend
      const res = await updateShippingService(carrierName, serviceType, weightRangeMin, weightRangeMax, price, deliveryDays, packageId, id);
      navigate(-1);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

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
        <h5>แก้ไขการขนส่ง</h5>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อบริษัทขนส่ง</label>
            <div className="row col-sm-4">
              <input type="text" className="form-control" placeholder="ชื่อวัตถุดิบ" value={carrierName} onChange={(e) => setCarrierName(e.target.value)} />
            </div>
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ประเภทขนส่ง</label>
            <div className="row col-sm-4">
              <input type="text" className="form-control" placeholder="จำนวนวัตถุดิบ" value={serviceType} onChange={(e) => setServiceType(e.target.value)} />
            </div>
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">น้ำหนักน้อยสุด</label>
            <div className="row col-sm-4">
              <input type="number" className="form-control" placeholder="จำนวนวัตถุดิบ" value={weightRangeMin} onChange={(e) => setWeightRangeMin(e.target.value)} />
            </div>
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">น้ำหนักมากสุด</label>
            <div className="row col-sm-4">
              <input type="number" className="form-control" placeholder="จำนวนวัตถุดิบ" value={weightRangeMax} onChange={(e) => setWeightRangeMax(e.target.value)} />
            </div>
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ราคา</label>
            <div className="row col-sm-4">
              <input type="number" className="form-control" placeholder="จำนวนวัตถุดิบ" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">เวลาที่ใช้</label>
            <div className="row col-sm-4">
              <input type="number" className="form-control" placeholder="ต้นทุนวัตถุดิบ" value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} />
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
            <button className="btn btn-success  mt-3 px-4 ms-5" type="submit">แก้ไข</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShipping;
