import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPackageService } from '../../../API/admin/packageService';

const CreatePackage = () => {
  const [formData, setFormData] = useState({}) //
  const [listMaterials, setListMaterials] = useState([]);
  const [costPreQuantity, setCostPreQuantity] = useState(0);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'file' && files.length > 0) {
      // ตรวจสอบว่าเป็น input file และมีการเลือกไฟล์
      const file = files[0]; // เอาไฟล์แรกที่ถูกเลือก
      setFormData(prev => ({ ...prev, [name]: file })); // เก็บไฟล์ใน formData
    } else {
      setFormData(prev => ({ ...prev, [name]: value })); // สำหรับ input อื่นๆ
    }
  };

  useEffect(() => {
    if (formData.cost && formData.quantity) {
      const costPerQuantity = parseFloat(formData.cost || 1) / parseFloat(formData.quantity || 1); // หลีกเลี่ยงการหารด้วย 0
      setCostPreQuantity(costPerQuantity);
    }
  }, [formData.cost, formData.quantity]);

  const handleSubmitpackagePackage = async (event) => {
    event.preventDefault();
    console.log(formData); // Log formData for debugging
    try {
      const res = await createPackageService(formData);
      console.log(res);
      navigate(-1);
    } catch (error) {
      console.log(error); // แสดงข้อผิดพลาด
    }
  };

  return (
    <form onSubmit={handleSubmitpackagePackage}>
      <div className="container mt-5 p-3">
        <Link className="btn btn-outline-secondary mb-4" to="/package">
          <i className="bi bi-arrow-left"></i>ย้อนกลับ
        </Link>
        <div className="mb-4 card col-md-12 px-40 bg-light card-body">
          <h4>เพิ่มบรรจุภัณฑ์</h4>

          <div className="mb-3 text-center">
            <div className="bg-white" style={{ width: '100px', height: '100px', border: '1px dashed #ccc', borderRadius: '5px', position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {formData.file ? ( /* เป็นรูปเเบบการเขียน if-eles ที่เรียกว่า Ternary Operator ใช้กับใน JSX เเต่ถ้าต้องการนำกลับมาใช้ได้ต้องเขียนเป็น renderStatus*/
                <img src={URL.createObjectURL(formData.file)} alt="Preview" style={{ width: '100%', borderRadius: '5px', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>เพิ่มรูปบรรจุภัณฑ์</span>
              )}
              <input type="file" name="file" className="position-absolute top-0 start-0" style={{
                  opacity: 0,
                  width: '100px', // ขนาดของ input จะไม่ครอบคลุม div ทั้งหมด
                  height: '100px',
                  cursor: 'pointer'
                }}
                onChange={handleChange}
              />
            </div>
            {formData.file && <p>ไฟล์ที่เลือก: {formData.file.name}</p>}
          </div>


          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อบรรจุภัณฑ์</label>
            <div className="row col-sm-5">
              <input type="text" name='package_name' className="form-control" placeholder="ชื่อบรรจุภัณฑ์" value={formData.package_name || ''} onChange={handleChange}/>
                {/* formData.package_name || '' ตั้งค่าเป็น string ว่างถ้าเป็น undefined 
                เนื่องจาก ใน formData เราทำเป็น Dynamic เพิ่มตามจำนวน name ของ input 
                เเล้วไม่ได้ set ค่า เหมือนในหน้า signUp*/}
            </div>
          </div>

          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">จำนวนทั้งหมด/ชุด</label>
            <div className="row col-sm-5">
              <input type="text" name='quantity' className="form-control" placeholder="จำนวน" value={formData.quantity || ''} onChange={handleChange}/>
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ราคา/ชุด</label>
            <div className="row col-sm-5">
              <input type="text" name='cost' className="form-control" placeholder="ราคาที่ซื้อมาต่อชุด" value={formData.cost || ''} onChange={handleChange}/>
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนต่อชิ้น</label>
            <div className="row col-sm-5">
              <input type="text" name='costPreQuantity' className="form-control" placeholder="ราคาบรรจุภัณฑ์" value={formData.costPreQuantity = costPreQuantity} onChange={handleChange} readOnly/>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 my-4">
            <button type="button" className="btn btn-secondary mt-3 px-4 me-5" onClick={() => { handleReset() }}>ล้าง</button>
            <button type="submit" className="btn btn-success mt-3 px-4 ms-5"> เพิ่มบรรจุภัณฑ์ </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreatePackage;