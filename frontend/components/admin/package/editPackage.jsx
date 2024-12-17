import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { packageDetailByIdService, editPackageService } from '../../../API/admin/packageService';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_PACKAGE
const CreatePackage = () => {
  const {id} = useParams()
  const [formData, setFormData] = useState({}) //
  const [packageById, setpackageById] = useState([])
  const [costPreQuantity, setCostPreQuantity] = useState(0);
  const [Picture, setPicture] = useState(null);
  const [packageName, setPackageName] = useState('');
  const [packageCost, setPackageCost] = useState('');
  const [packageQuantity, setPackageQuantity] = useState('');
  const [packageCostPerQuantity, setPackageCostPerQuantity] = useState('');
  const [active, setStatusactive] = useState("1");
  const navigate = useNavigate();

  useEffect(() => {
    const getpackageById = async () => {
      try {
        const response = await packageDetailByIdService(id)
        console.log(response);
        if (!response.data) {
          throw new Error("ไม่มีข้อมูล")
        }
        setpackageById(response.data[0])
        setPicture(response.data[0]?.package_pic)
        setPackageName(response.data[0]?.package_name)
        setPackageCost(response.data[0]?.cost)
        setPackageQuantity(response.data[0]?.quantity)
        setPackageCostPerQuantity(response.data[0]?.cost_per_quantity)
        setStatusactive(response.data[0]?.is_active)
      }

      catch (error) {
        alert(error)
      }
    }
    getpackageById()
  }, [])

  const handleReset = () => {
    setFormData({
      package_name: '',
      quantity: '',
      cost: '',
      costPreQuantity: '',
      file: null
    });
    setCostPreQuantity(0)
  };

  useEffect(() => {
    if (packageCost&& packageQuantity) {
      const costPerQuantity = parseFloat(packageCost || 1) / parseFloat(packageQuantity || 1); // หลีกเลี่ยงการหารด้วย 0
      setPackageCostPerQuantity(costPerQuantity);
    }
  }, [packageCost, packageQuantity]);

  const handleSubmitPackage = async (event) => {
    event.preventDefault();
    console.log(formData); // Log formData for debugging
    try {
      const updatedData = {};
      const formData = new FormData();
      
      if (packageName !== packageById.package_name) updatedData.package_name = packageName;
      if (packageQuantity !== packageById.quantity) updatedData.quantity = packageQuantity;
      if (packageCost !== packageById.cost) updatedData.cost = packageCost;
      if (packageCostPerQuantity !== packageById.cost_per_quantity) updatedData.cost_per_quantity = packageCostPerQuantity;
      if (active !== packageById.active) updatedData.active = active;
      
      if (Picture instanceof File) {
        formData.append('file', Picture);
      } else if (typeof Picture === 'string') {
        updatedData.package_pic = Picture;
      }
    
      if (Object.keys(updatedData).length === 0) {
        alert('ไม่มีข้อมูลที่เปลี่ยนแปลง');
        return;
      }

      for (const key in updatedData) {
        formData.append(key, updatedData[key]);
      }
  
      console.log("FormData ส่งไปยัง Backend: ", Array.from(formData.entries()));
      const res = await editPackageService(id, formData);
      console.log(res);
      navigate(-1);
    } catch (error) {
      console.log(error); // แสดงข้อผิดพลาด
    }
  };

  return (
    <form onSubmit={handleSubmitPackage}>
      <div className="container mt-5 p-3">
        <Link className="btn btn-outline-secondary mb-4" to="/package">
          <i className="bi bi-arrow-left"></i>ย้อนกลับ
        </Link>
        <div className="mb-4 card col-md-12 px-40 bg-light card-body">
          <h4>แก้ไขบรรจุภัณฑ์</h4>

          <div className="mb-3 text-center">
            <div className="bg-white" style={{ width: '100px', height: '100px', border: '1px dashed #ccc', borderRadius: '5px', position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {Picture ? (
                // ถ้ามี Picture จะสร้าง URL สำหรับแสดงรูปที่ดึงจากฐานข้อมูลหรือรูปที่อัพโหลดใหม่
                <img src={typeof Picture === 'string' ? API_URL_PICTURE + Picture : URL.createObjectURL(Picture)} alt="Preview" style={{ width: '100%', borderRadius: '5px', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>เพิ่มรูปบรรจุภัณฑ์</span>
              )}
              <input
                type="file"
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ opacity: 0, cursor: 'pointer' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPicture(file);
                }}
              />
            </div>
            {formData.file && <p>ไฟล์ที่เลือก: {formData.file.name}</p>}
          </div>


          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อบรรจุภัณฑ์</label>
            <div className="row col-sm-5">
              <input type="text" name='package_name' className="form-control" placeholder="ชื่อบรรจุภัณฑ์" value={packageName} onChange={(e) => setPackageName(e.target.value)}/>
                {/* formData.package_name || '' ตั้งค่าเป็น string ว่างถ้าเป็น undefined 
                เนื่องจาก ใน formData เราทำเป็น Dynamic เพิ่มตามจำนวน name ของ input 
                เเล้วไม่ได้ set ค่า เหมือนในหน้า signUp*/}
            </div>
          </div>

          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">จำนวนทั้งหมด/ชุด</label>
            <div className="row col-sm-5">
              <input type="text" name='quantity' className="form-control" placeholder="จำนวน" value={packageQuantity} onChange={(e) => setPackageQuantity(e.target.value)}/>
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ราคา/ชุด</label>
            <div className="row col-sm-5">
              <input type="text" name='cost' className="form-control" placeholder="ราคาที่ซื้อมาต่อชุด" value={packageCost} onChange={(e) => setPackageCost(e.target.value)}/>
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนต่อชิ้น</label>
            <div className="row col-sm-5">
              <input type="text" name='costPreQuantity' className="form-control" placeholder="ราคาบรรจุภัณฑ์" value={packageCostPerQuantity} onChange={(e) => setPackageCostPerQuantity(e.target.value)} readOnly/>
            </div>
          </div>

          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">การใช้งาน</label>
            <div className='row col-sm-5'>
              <select className="form-select" onChange={(e) => setStatusactive(e.target.value)} value={active}  required aria-label="Default select example" placeholder="เลือก">
                <option value="1">ใช้งาน</option>
                <option value="0">ไม่ใช้งาน</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 my-4">
            <button type="button" className="btn btn-secondary mt-3 px-4 me-5" onClick={() => { handleReset() }}>ล้าง</button>
            <button type="submit" className="btn btn-success mt-3 px-4 ms-5"> บันทึกข้อมูล </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreatePackage;