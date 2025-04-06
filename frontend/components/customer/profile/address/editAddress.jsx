import React, { useContext,useState, useEffect } from 'react';
import axios from 'axios'
import { getProvice, getAmphure, getTambon, createAddressCustomer } from '../../../../API/customer/addressService';
import { getAddressById, updateAddressById } from '../../../../API/customer/addressCustomerService'
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingPopup from '../../../untils/popUp/loading';
import ErrorPopup from '../../../untils/popUp/errorPopup';

const CreateAddress = () => {
  const {id} = useParams()
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [addressById, setAddressById] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedAmphure, setSelectedAmphure] = useState(null);
  const [selectedTambon, setSelectedTambon] = useState(null);
  const [postCode, setPostCode] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [provincesId, setProvincesId] = useState("");
  const [amphuresId, setAmphuresId] = useState("");
  const [tambonsId, setTambonsId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
  
        // เรียก API หลักทั้งหมดพร้อมกัน
        const [provinceResponse, addressResponse] = await Promise.all([
          getProvice(),
          getAddressById(id),
        ]);
  
        if (!provinceResponse.data || !addressResponse.data) {
          throw new Error("ไม่มีข้อมูล");
        }
  
        // ตั้งค่าข้อมูลจังหวัด
        setProvinces(provinceResponse.data);
  
        // ตั้งค่าข้อมูลที่อยู่ของลูกค้า
        const address = addressResponse.data[0];
        setAddressById(address);
        console.log(address);
        
        setHouseNo(address?.houseNo);
  
        // ตั้งค่าข้อมูลจังหวัดที่ตรงกับที่อยู่
        const matchedProvince = provinceResponse.data.find(
          (province) => province.province_id === address.province_id
        );
        if (matchedProvince) {
          setSelectedProvince(matchedProvince.province_id);
  
          // ดึงข้อมูลอำเภอหลังจากตั้งค่าจังหวัดเสร็จ
          const amphureResponse = await getAmphure(matchedProvince.province_id);
          setAmphures(amphureResponse.data || []);
  
          // ตั้งค่าอำเภอที่ตรงกับที่อยู่
          const matchedAmphure = amphureResponse.data.find(
            (amphure) => amphure.amphure_id === address.amphure_id
          );
          if (matchedAmphure) {
            setSelectedAmphure(matchedAmphure.amphure_id);
  
            // ดึงข้อมูลตำบลหลังจากตั้งค่าอำเภอเสร็จ
            const tambonResponse = await getTambon(matchedAmphure.amphure_id);
            setTambons(tambonResponse.data || []);
  
            // ตั้งค่าตำบลที่ตรงกับที่อยู่
            const matchedTambon = tambonResponse.data.find(
              (tambon) => tambon.tambon_id === address.tambon_id
            );
            if (matchedTambon) {
              setSelectedTambon(matchedTambon.tambon_id);
              setPostCode(matchedTambon.zip_code);
            }
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  
  useEffect(() => {
    const fetchDependentData = async () => {
      try {
        // เรียก API อำเภอและตำบลพร้อมกัน
        const [amphureResponse, tambonResponse] = await Promise.all([
          selectedProvince ? getAmphure(selectedProvince) : Promise.resolve({ data: [] }),
          selectedAmphure ? getTambon(selectedAmphure) : Promise.resolve({ data: [] })
        ]);
  
        console.log(amphureResponse.data, tambonResponse.data);
  
        // ตั้งค่าอำเภอและตำบล
        setAmphures(amphureResponse.data || []);
        setTambons(tambonResponse.data || []);
  
        // ตั้งค่าข้อมูลตำบลที่ตรงกับ addressById
        if (addressById?.tambon_id && tambonResponse.data.length > 0) {
          const matchedTambon = tambonResponse.data.find(
            (tambon) => tambon.tambon_id === addressById.tambon_id
          );
          if (matchedTambon) {
            setSelectedTambon(matchedTambon.tambon_id);
            setPostCode(matchedTambon.zip_code);
          }
        }
      } catch (error) {
        setError(error);
        console.error("Error loading dependent data:", error);
      }
    };
  
    fetchDependentData();
  }, [selectedProvince, selectedAmphure, addressById]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
  
      // ตรวจสอบการเปลี่ยนแปลงข้อมูล
      const hasChanges =
        String(selectedTambon) !== String(addressById.tambon_id) ||
        String(selectedAmphure) !== String(addressById.amphure_id) ||
        String(selectedProvince) !== String(addressById.province_id) ||
        String(houseNo) !== String(addressById.houseNo) ||
        String(postCode) !== String(addressById.zip_code);
  
      console.log("Data changed:", hasChanges);
  
      // หากไม่มีการเปลี่ยนแปลงข้อมูล
      if (!hasChanges) {
        alert('ไม่มีการเปลี่ยนแปลงข้อมูล');
        return; // หยุดการทำงานของฟังก์ชันไม่ให้ส่งข้อมูล
      }
  
      // หากมีการเปลี่ยนแปลงจริง ๆ ก็ทำการบันทึก
      const res = await updateAddressById(selectedTambon, selectedAmphure, selectedProvince, houseNo, postCode, id);
      console.log("Address updated:", res);
      navigate(-1); // ย้อนกลับไปหน้าก่อนหน้านี้
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="px-5 card-body">
              <h3 className="mb-4 card-title text-center">เเก้ไขที่อยู่</h3>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
               <div className="row mb-4">
                <label htmlFor="subdistrict" className="col-12 col-lg-3 col-auto col-form-label">จังหวัด</label>
                <div className="col-12 col-lg-8">
                  <select value={selectedProvince || ''}  onChange={(e) => {setSelectedProvince(e.target.value); setProvincesId(e.target.value)}} className="form-select">
                    <option value="" disabled></option>
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
                    <select value={selectedAmphure || ''} onChange={(e) => {setSelectedAmphure(e.target.value); setAmphuresId(e.target.value)}} className="form-select" disabled={!selectedProvince}>
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
                  <label htmlFor="province" className="col-12 col-lg-3 col-auto col-form-label">แขวง/ตำบล</label>
                  <div className="col-12 col-lg-8">
                    <select value={selectedTambon || ''} className="form-select" onChange={(e) => {setSelectedTambon(e.target.value); setTambonsId(e.target.value)}} disabled={!selectedAmphure}>
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
                 <label htmlFor="postal code" className="col-12 col-lg-3 col-auto col-form-label">รหัสไปรษณีย์</label>
                 <div className="col-12 col-lg-8">
                   <input name='postCode' type="text" value={postCode} onChange={(e) => {setPostCode(e.target.value)}}  className="form-control" id="postalCode" placeholder="รหัสไปรษณีย์"/>
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
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
      {error && (
          <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />
        )}
    </div>
  );
};

export default CreateAddress;