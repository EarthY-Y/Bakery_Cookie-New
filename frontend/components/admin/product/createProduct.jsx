import React, { useContext,useEffect, useState} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { FormContextMaterialProduct } from '../../../API/productService';
import { listMaterialService } from '../../../API/materialService';
import { createProductService } from '../../../API/productService';

const CreateProduct = () => {
  const { formData, setFormData } = useContext(FormContextMaterialProduct);
  const [listMaterials, setListMaterials] = useState([]);

  const navigate = useNavigate();
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
    const getMaterial = async () => {
        try {
            const response = await listMaterialService();
            console.log(response.data);
            
            setListMaterials(response.data);
        } catch (error) {
            console.error("Error fetching materials:", error);
        }
    };
    getMaterial();
  }, []);
    // ฟังก์ชันสำหรับคำนวณต้นทุนรวม
  const calculateTotalCost = () => {
    return (formData.ingredients || []).reduce((totalCost, ingredient) => {
      const material = listMaterials.find((mat) => mat.material_id === ingredient.material_id);
      const quantity = parseFloat(ingredient.quantity || 0);

      if (material && !isNaN(quantity)) {
        return totalCost + material.cost_per_quantity * quantity;
      }
      return totalCost;
    }, 0);
  };
  const handleInputChange = (index, event) => {
      const values = [...(formData.ingredients || [])]; // ใช้ค่าที่เก็บอยู่ใน formData
      values[index] = {
          ...values[index],
          [event.target.name]: event.target.value
      };
      setFormData(prev => ({ ...prev, ingredients: values })); // อัปเดต formData
  };

  const handleAddRow = () => {
      const newIngredients = [...(formData.ingredients || []), { material_id: '', quantity: '' }];
      setFormData(prev => ({ ...prev, ingredients: newIngredients })); // อัปเดต formData
  };

  const handleRemoveRow = (index) => {
      const values = [...(formData.ingredients || [])];
      values.splice(index, 1);
      setFormData(prev => ({ ...prev, ingredients: values })); // อัปเดต formData
  };

  const handleSubmitProductMaterial = async (event) => {
      event.preventDefault();
      console.log(formData); // Log formData for debugging
      try {
          const res = await createProductService(formData);
          console.log(res);
          navigate('/product');
      } catch (error) {
          console.log(error); // แสดงข้อผิดพลาด
      }
  };

  return (
    <form onSubmit={handleSubmitProductMaterial}>
      <div className="container mt-5">
        <Link className="btn btn-light text-black mb-4" to="/product">
          <i className="bi bi-arrow-left"></i>ย้อนกลับ
        </Link>
        <div className="mb-4 card col-md-12 px-40 card-body">
          <h>เพิ่มสินค้า</h>
          
          <div className="mb-3 text-center">
            <div style={{ width: '100px', height: '100px', border: '1px dashed #ccc', position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {formData.file ? (
                <img src={URL.createObjectURL(formData.file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>เพิ่มรูปสินค้า</span>
              )}
              <input 
                type="file" 
                name="file"
                className="position-absolute top-0 start-0" 
                style={{
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
            <label className="col-sm-2 col-form-label">ชื่อสินค้า</label>
            <div className="row col-sm-5">
              <input 
                type="text" 
                name='product_name'
                className="form-control" 
                placeholder="ชื่อสินค้า" 
                value={formData.product_name || ''} 
                /* formData.product_name || '' ตั้งค่าเป็น string ว่างถ้าเป็น undefined 
                เนื่องจาก ใน formData เราทำเป็น Dynamic เพิ่มตามจำนวน name ของ input 
                เเล้วไม่ได้ set ค่า เหมือนในหน้า signUp*/
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">จำนวน</label>
            <div className="row col-sm-5">
              <input 
                type="text" 
                name='quantity'
                className="form-control" 
                placeholder="จำนวน" 
                value={formData.quantity || ''} 
                onChange={handleChange} 
              />
            </div>
          </div>
          {(formData.ingredients || []).map((ingredient, index) => (
            <div key={index} className="row mb-3 justify-content-center ingredient-row">
                <label className="col-sm-2 col-form-label">วัตถุดิบอย่างที่ {index + 1}</label>
                <div className="col-sm-3">
                    <select //ไม่ควรใช้ defaultValue="" เพราะว่าด้านล่างมี value="" อยู่เเล้วไม่งั้นเดี๋ยวเกิด error: elect elements must be either controlled or uncontrolled 
                        className="form-select"
                        name="material_id"
                        value={ingredient.material_id}
                        onChange={(event) => handleInputChange(index, event)}
                        required
                    >
                        <option value="" disabled>Select Material</option>
                        {listMaterials.map((listMaterial) => (
                            <option key={listMaterial.material_id} value={listMaterial.material_id}>
                                {listMaterial.material_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-sm-2">
                    <input
                        type="number"
                        name="quantity"
                        placeholder="ปริมาณ"
                        className="form-control" 
                        value={ingredient.quantity}
                        onChange={(event) => handleInputChange(index, event)}
                        required
                    />
                </div>
                <div className="col-sm-1">
                    <button type="button" className="btn btn-danger me-5" onClick={() => handleRemoveRow(index)}>ลบ</button>
                </div>
            </div>
          ))}
          <div className="mb-3 d-md-flex justify-content-center">
              <button type="button" className="btn btn-primary" onClick={handleAddRow}>เพิ่มวัตถุดิบ</button>
          </div>
          
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนสินค้า</label>
            <div className="row col-sm-5">
              <input 
                type="text" 
                name='costPerQuantity'
                className="form-control" 
                placeholder="ต้นทุนสินค้า" 
                value={formData.calculateTotalCost = calculateTotalCost() } 
                onChange={handleChange} 
                readOnly
              />
            </div>
          </div>

          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ราคาสินค้า</label>
            <div className="row col-sm-5">
              <input 
                type="text" 
                name='price'
                className="form-control" 
                placeholder="ราคาสินค้า" 
                value={formData.price || ''} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">รายละเอียดสินค้า</label>
            <div className="row col-sm-5">
              <textarea className="form-control" name='description' placeholder="รายละเอียดสินค้า"
                  value={formData.description || ''} 
                  onChange={handleChange} 
                  rows="3" // กำหนดความสูงของ textarea
                  style={{ minWidth: '100%' }} // กำหนดความกว้างของ textarea
                />

            </div>
          </div>

          <div className="d-md-flex justify-content-center" style={{margin:'5%'}}>
            <button className="btn btn-secondary me-5" type="button" style={{ width: '100px', height: '40px' }}>ล้าง</button>
            <button type="submit" className="btn btn-primary"> เพิ่มสินค้า </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateProduct;