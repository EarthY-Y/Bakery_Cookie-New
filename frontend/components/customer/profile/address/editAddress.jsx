import React, { useContext,useState, useEffect } from 'react';
import axios from 'axios'
import { getProvice, getAmphure, getTambon, createAddressCustomer } from '../../../../API/customer/addressService';
import { getAddressById, updateAddressById } from '../../../../API/customer/addressCustomerService'
import { Link, useNavigate, useParams } from 'react-router-dom';

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
  const navigate = useNavigate();

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
            alert("คุณยังไม่ได้กรอกข้อมูลที่อยู่")
          }
      }
    getProviceCustomer()
  }, []);

    //* set ข้อมูลใน DropDown
  useEffect(() => {
    const getProviceCustomer = async() => {
        try {
          if (selectedProvince) {
            const responseAmphures = await getAmphure(selectedProvince);
            setAmphures(responseAmphures.data || []);
          }
          if (selectedAmphure) {
            const responseTambons = await getTambon(selectedAmphure);
            setTambons(responseTambons.data || []);
          }

        } catch (error) {
          console.error("Error loading data:", error);
        }
      }
    getProviceCustomer()
  }, [selectedProvince, selectedAmphure]);

  //! find หาข้อมูลที่ตรงกับ addressById เพื่อเป็นไกด์ไลน์เลือกข้อมูลเก่าให้ก่อนจะเปลี่ยนเเปลง
  useEffect(() => {
    if (selectedTambon) {
      const selected = tambons.find((tambon) => tambon.tambon_id === selectedTambon);
      setPostCode(selected?.zip_code || "");
    }
  }, [selectedTambon, tambons]);

  useEffect(() => {
    if (addressById.province_id && provinces.length > 0) {
      const matchedProvince = provinces.find(province => province.province_id === addressById.province_id);//ให้ Function find เพื่อหข้อมูลที่ตรงกับ addressById.province_id
      if (matchedProvince) { //ซึ่งถ้ามีตรงกันจะนำมาใส่ลงใน set
        setSelectedProvince(matchedProvince.province_id); //เพื่อเอาไปเลือก
        // setProvincesId(matchedProvince.province_id); //เพื่อส่งข้อมูลไปอัปเดต
      }
    }
  }, [addressById, provinces]);
  
  useEffect(() => {
    if (addressById.amphure_id && amphures.length > 0) {
      const matchedAmphure = amphures.find(amphure => amphure.amphure_id === addressById.amphure_id);
      if (matchedAmphure && !selectedAmphure) { // เพิ่ม !selectedAmphure
        setSelectedAmphure(matchedAmphure.amphure_id);
      }
      if(!matchedAmphure){
        setTambons([]);
        setSelectedTambon(null);
        setPostCode("");
        setHouseNo("")
      }
    }
  }, [addressById, amphures, selectedAmphure]);
  
  useEffect(() => {
    if (addressById.tambon_id && tambons.length > 0) {
      const matchedTambon = tambons.find(tambon => tambon.tambon_id === addressById.tambon_id);
      if (matchedTambon) {
        setSelectedTambon(matchedTambon.tambon_id);
        // setTambonsId(matchedTambon.tambon_id);
        setPostCode(matchedTambon.zip_code);
      }
    }
  }, [addressById, tambons]);
  
  // !
  useEffect(() => {
    if (selectedProvince) {
      setSelectedAmphure(null);
      setAmphures([]);
      setSelectedTambon(null);
      setTambons([]);
      setPostCode("");
      setAmphuresId(""); // เพิ่มรีเซ็ต ID อำเภอ
      setTambonsId("");
    }
  }, [selectedProvince]);

  useEffect(() => {
    const getCustomerAddressById = async() => {
        try {
          const response = await getAddressById(id)
          if(!response.data){
            throw new Error("ไม่มีข้อมูล")
          }
          console.log(response.data);
          setAddressById(response.data[0])
          setHouseNo(response.data[0]?.houseNo)
        }
        catch (error) {
          alert("คุณยังไม่ได้กรอกข้อมูลที่อยู่")
        }
      }
      getCustomerAddressById()
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        console.log(tambonsId, amphuresId, provincesId, houseNo, postCode);
        if(tambonsId.length===0 && amphuresId.length===0 && provincesId.length===0 && houseNo.length===0 && postCode.length===0){ //เเต่ถ้าลูกค้ากรอกข้อมูลเดิมมาก็จะไม่เข้าเพราะมีข้อมูล
          alert('ไม่มีข้อมูลที่เปลี่ยนแปลง');
          return;
        }
        const res = await updateAddressById(tambonsId, amphuresId, provincesId, houseNo, postCode, id);
        navigate(-1); //-1 เพื่อย้อนกลับไปหน้าก่อนหน้านี้
    } catch (err) {
        console.log(err);
    }
  }
  return (
    <div className="mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="px-5 card-body">
              <h3 className="mb-4 card-title text-center">เพิ่มที่อยู่</h3>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
               <div className="row mb-4">
                <label htmlFor="subdistrict" className="col-3 col-auto col-form-label">จังหวัด</label>
                <div className="col-8">
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
                  <label htmlFor="district" className="col-3 col-auto col-form-label">เขต/อำเภอ</label>
                  <div className="col-8">
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
                  <label htmlFor="province" className="col-3 col-auto col-form-label">แขวง/ตำบล</label>
                  <div className="col-8">
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
                 <label htmlFor="postal code" className="col-3 col-auto col-form-label">รหัสไปรษณีย์</label>
                 <div className="col-8">
                   <input name='postCode' type="text" value={postCode} onChange={(e) => {setPostCode(e.target.value)}}  className="form-control" id="postalCode" placeholder="รหัสไปรษณีย์"/>
                 </div>
               </div>
               <div className="row mb-4">
                  <label htmlFor="home number" className="col-3 col-auto col-form-label">รายละเอียด</label>
                  <div className="col-8">
                    <input name='homeNumber' type="text" value={houseNo} onChange={(e) => {setHouseNo(e.target.value)}} className="form-control" id="homeNumber" placeholder="บ้านเลขที่,หมุ่ที่,เเยก,ถนน"/>
                  </div>
               </div>

               <div className="mb-4 row justify-content-center">
                  <div className="col-5">
                    <button style={{ backgroundColor: '#FFE194'}} type="submit" className="btn btn-outline-dark w-100">เพิ่มรายละเอีดที่อยู่</button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAddress;