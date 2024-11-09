import React, { useContext,useEffect, useState} from 'react';
import { Link,useNavigate,useParams } from 'react-router-dom';
import { listProductByIdService } from '../../../API/admin/productService';
import { listMaterialService } from '../../../API/admin/materialService';
import { editProductService } from '../../../API/admin/productService';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const EditProduct = () => {
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [listMaterials, setListMaterials] = useState([]);
  const [deletedIngredients, setDeletedIngredients] = useState([])
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInputChange = (index, event) => {
    const values = [...(formData.ingredients || [])];
    values[index] = {
      ...values[index],
      [event.target.name]: event.target.value,
    };
    setFormData((prev) => ({ ...prev, ingredients: values }));
  };

  const handleAddRow = () => {
    const newIngredients = [...(formData.ingredients || []), { material_id: '', quantity: '' }];
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const handleRemoveRow = (index) => {
    const values = [...(formData.ingredients || [])];
    const deletedIngredient = values[index]; // เก็บข้อมูลวัตถุดิบที่ถูกลบ
    values.splice(index, 1);
    setFormData((prev) => ({ ...prev, ingredients: values }));
  
    // เก็บ ingredient ที่ถูกลบ
    setDeletedIngredients((prevDeleted) => [...prevDeleted, deletedIngredient]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const updatedData = {};
    const deletedIngredientsCopy = [...deletedIngredients]; // ทำสำเนาของ deletedIngredients
  
    for (const key in formData) {
      if (key === 'ingredients') {
        const updatedIngredients = [];
        const newIngredients = [];
        const originalIngredients = originalData.ingredients || [];
  
        formData.ingredients.forEach((ingredient, index) => {
          const originalIng = originalIngredients[index] || {};
  
          // ตรวจสอบว่ามี ingredient นี้ใน originalData หรือไม่
          if (!ingredient.material_id || parseFloat(ingredient.quantity) === 0) {
            deletedIngredientsCopy.push(ingredient); // เก็บ ingredient ที่ถูกลบ
          } if (ingredient.material_id === originalIng.material_id && parseFloat(ingredient.quantity) !== parseFloat(originalIng.quantity)) {
            updatedIngredients.push(ingredient); // เก็บ ingredient ที่มีการแก้ไข
          } if(ingredient.material_id !== originalIng.material_id ){
            newIngredients.push(ingredient);
            updatedData.ingredients = newIngredients;
          }
        });
  
        // ถ้ามีการอัปเดต ingredient, ใช้ updatedIngredient แทน ingredients
        if (updatedIngredients.length > 0) {
          updatedData.updatedIngredients = updatedIngredients;
        }

      } else if (key === 'file') {
        if (formData.file instanceof File) {
          updatedData.file = formData.file; // ถ้าเป็นไฟล์รูป
        } else if (typeof formData.file === 'string') {
          updatedData.productpic_name = formData.file; // ถ้าเป็นชื่อไฟล์
        }
      } else if (formData[key] !== originalData[key]) {
        updatedData[key] = formData[key]; // อัปเดตค่าอื่นๆ ที่มีการเปลี่ยนแปลง
      }
    }
  
    if (Object.keys(updatedData).length === 0 && deletedIngredientsCopy.length === 0) {
      alert('ไม่มีการเปลี่ยนแปลงข้อมูล');
      return;
    }
  
    const formDataToSend = new FormData();
    for (const key in updatedData) {
      if (key === 'updatedIngredients') {
        // ส่งข้อมูลที่มีการแก้ไขใน updatedIngredients
        formDataToSend.append(key, JSON.stringify(updatedData[key]));
      }
      else if (key === 'ingredients') {
        // ส่งข้อมูลที่มีการแก้ไขใน updatedIngredients
        formDataToSend.append(key, JSON.stringify(updatedData[key]));
      } else {
        formDataToSend.append(key, updatedData[key]);
      }
    }
  
    // ส่งข้อมูลที่ถูกลบ
    if (deletedIngredientsCopy.length > 0) {
      formDataToSend.append('deletedIngredients', JSON.stringify(deletedIngredientsCopy));
    }
  
    // ตรวจสอบข้อมูลที่ส่ง
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    try {
      const res = await editProductService(formDataToSend, id);
      console.log('Response:', res);
      navigate('/product');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  useEffect(() => {
    const getlistMaterialById = async () => {
      try {
        const response = await listProductByIdService(id);
        console.log(response);
  
        if (!response.data) {
          throw new Error("ไม่มีข้อมูล");
        }

        const productData = response.data[0]; // Assuming the first object contains product details
        const ingredients = response.data.map(item => ({
          material_id: item.material_id || '',
          quantity: item.amount || '',
          cost_per_quantity: item.cost_per_quantity || 0, // Include cost info if needed
        }));
  
        const initialData = {
          product_name: productData.product_name || '',
          quantity: productData.quantity || '',
          price: productData.price || '',
          description: productData.description || '',
          file: productData.productpic_name || '',
          ingredients,
        };

        setFormData(initialData);
        setOriginalData(initialData);
      } catch (error) {
        alert(error.message);
      }
    };
  
    getlistMaterialById();
  }, []);
  
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="container mt-5">
        <Link className="btn btn-light text-black mb-4" to="/product">
          <i className="bi bi-arrow-left"></i>ย้อนกลับ
        </Link>
        <div className="mb-4 card col-md-12 px-40 card-body">
          <h5>เพิ่มสินค้า</h5>
          
          <div className="mb-3 text-center">
            <div style={{width: '100px',height: '100px',border: '1px dashed #ccc',position: 'relative',display: 'inline-flex',alignItems: 'center',justifyContent: 'center'}}>
              {formData.file ? (typeof formData.file === 'string' ? 
                  (
                    <img
                      src={`${API_URL_PICTURE}${formData.file}`}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(formData.file)}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )
              ) : (
                <span>เพิ่มรูปสินค้า</span>
              )}
              <input
                type="file"
                name="file"
                className="position-absolute top-0 start-0"
                style={{
                  opacity: 0,
                  width: '100px',
                  height: '100px',
                  cursor: 'pointer',
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
                <select
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
                // value={formData.calculateTotalCost = calculateTotalCost() } 
                // onChange={handleChange} 
                value={calculateTotalCost()}
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
            <button type="button" className="btn btn-secondary me-5" onClick={() => {handleReset()}} style={{ width: '100px', height: '40px' }}>ล้าง</button>
            <button type="submit" className="btn btn-primary"> บันทึกข้อมูล </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProduct;