import React, { useContext,useEffect, useState} from 'react';
import Select from 'react-select';
import { Link,useNavigate,useParams } from 'react-router-dom';
import { listProductByIdService, listProductPackageByIdService, listProductPackageService } from '../../../API/admin/productService';
import { listMaterialService } from '../../../API/admin/materialService';
import { editProductService } from '../../../API/admin/productService';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const EditProduct = () => {
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [listMaterials, setListMaterials] = useState([]);
  const [packageById, setPackageById] = useState([]);
  const [deletedIngredients, setDeletedIngredients] = useState([])
  const [deletedPackage, setDeletedPackage] = useState([])
  const [pricePreQuantity, setpricePreQuantity] = useState(0);
  const [totalPrice, settotalPrice] = useState(0);
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
  //ต้องทำเเยกเพราะว่ามีเรื่อง ไอดีเข้ามาเกี่ยวถ้าไม่ทำเเยกก็ต้องใช้เงื่อนไขในการเเยกใน Function นั้นๆ
  const handlePackageChange = (index, option) => {
    const values = [...(formData.packaging || [])];
    const selectedPackage = packageById.find((packages) => packages.package_id === option.value);
    if (selectedPackage) {
        values[index] = {
            package_id: selectedPackage.package_id,
            package_name: selectedPackage.package_name,
            cost_per_quantity: selectedPackage.cost_per_quantity,
            //quantity: values[index]?.quantity || 0, // คงค่า quantity เดิมไว้
        };
        setFormData((prev) => ({ ...prev, packaging: values }));
    }
  };

  const handlePackageAddRow = () => {
    const newIngredients = [...(formData.packaging || []), { package_id: '' }];
    setFormData((prev) => ({ ...prev, packaging: newIngredients }));
  };

  const handlePackageRemoveRow = (index) => {
    const values = [...(formData.packaging || [])];
    const deletedIngredient = values[index]; // เก็บข้อมูลวัตถุดิบที่ถูกลบ
    values.splice(index, 1);
    setFormData((prev) => ({ ...prev, packaging: values }));
  
    // เก็บ ingredient ที่ถูกลบ
    setDeletedPackage((prevDeleted) => [...prevDeleted, deletedIngredient]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const updatedData = {};

    const originalIngredients = originalData.ingredients || [];
    const updatedIngredients = [];
    const newIngredients = [];
    const deletedIngredientsCopy = [...deletedIngredients]; // ทำสำเนาของ deletedIngredients

    const updatedDataPackage = [];
    const deletedPackageCopy = [...deletedPackage];
    const newPackage = [];
    const originalPackage = originalData.packaging || [];
    
  
    for (const key in formData) {
      if (key === 'ingredients' || key === 'packaging') {
  
        formData.ingredients.forEach((ingredient, index) => {
          const originalIng = originalIngredients[index] || {};
  
          // ตรวจสอบว่ามี ingredient นี้ใน originalData หรือไม่
          // เช็ค ingredient ที่ถูกลบ

          if (!ingredient.material_id && originalIng.material_id) {
            const isDuplicate = deletedIngredientsCopy.some(ing => ing.material_id === ingredient.material_id);
            if (!isDuplicate) {
              deletedIngredientsCopy.push(ingredient); // ไม่มี material_id หรือ quantity เป็น 0
            }
          }
          if (parseFloat(ingredient.quantity) !==  parseFloat(originalIng.quantity) && originalIng.material_id) {
            const isDuplicate = deletedIngredientsCopy.some(ing => ing.material_id === ingredient.material_id);
            if (!isDuplicate) {
              deletedIngredientsCopy.push(ingredient); // ไม่มี material_id หรือ quantity เป็น 0
            }
          }

          // เช็ค ingredient ที่มีการแก้ไข
          // else if (originalIng && parseFloat(ingredient.quantity) !== parseFloat(originalIng.quantity)) {
          //   const isDuplicate = updatedIngredients.some(ing => ing.material_id === ingredient.material_id);
          //   if (!isDuplicate) {
          //     updatedIngredients.push(ingredient); // มี material_id ตรงกัน แต่ quantity เปลี่ยน
          //   }
          // }

          // เช็ค ingredient ที่เพิ่มเข้ามา
          if (originalIng.material_id !== ingredient.material_id) {
            const isDuplicate = newIngredients.some(ing => ing.material_id === ingredient.material_id);
            if (!isDuplicate) {
              newIngredients.push(ingredient);
              updatedData.ingredients = newIngredients;
            }
          }

          if (parseFloat(ingredient.quantity) !==  parseFloat(originalIng.quantity)) {
            const isDuplicate = newIngredients.some(ing => ing.material_id === ingredient.material_id);
            if (!isDuplicate) {
              newIngredients.push(ingredient);
              updatedData.ingredients = newIngredients;
            }
          }

        });

        formData.packaging.forEach((packages, index) => {
          const originalpck = originalPackage[index] || {}; // ดึงข้อมูล originalPackage
          // ตรวจสอบการลบ
          if (!packages.package_id && originalpck.package_id || packages.package_id !== originalpck.package_id  ) {
            // ถ้าไม่มี package_id ใน formData แต่มีใน originalData
            const isDuplicate = deletedPackageCopy.some(pkg => pkg.package_id === originalpck.package_id);
            if (!isDuplicate) {
              deletedPackageCopy.push(originalpck); // ถือว่าเป็นการลบ
            }
          }

          // ตรวจสอบการแก้ไข
          // if (packages.package_id && (!originalpck.package_id || packages.package_id !== originalpck.package_id)) {
              // ถ้ามี package_id และไม่ตรงกัน หรือ original ไม่มี package_id
          //   const isDuplicate = updatedDataPackage.some(pkg => pkg.package_id === packages.package_id);
          //   if (!isDuplicate) {
          //     updatedDataPackage.push(packages); // ถือว่าเป็นการแก้ไข
          //   }
          // }

          // ตรวจสอบการเพิ่ม
          if (packages.package_id && !originalpck.package_id) {
            // ตรวจสอบว่า package_id ซ้ำใน newPackage หรือไม่
            const isDuplicate = newPackage.some(pkg => pkg.package_id === packages.package_id);
            if (!isDuplicate) {
              newPackage.push(packages); // ถ้าไม่ซ้ำก็เพิ่มเข้าไป
              updatedData.packages = newPackage;
            }
          }
          
        });
  
        // ถ้ามีการอัปเดต ingredient, ใช้ updatedIngredient แทน ingredients
        if (updatedIngredients.length > 0) {
          updatedData.updatedIngredients = updatedIngredients;
        }

        if (updatedDataPackage.length > 0) {
          updatedData.updatedDataPackage = updatedDataPackage;
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
    //loop เพื่อเเปลงค่าจาก object ให้เป็น json ผ่าน key ที่สร้าง
    for (const key in updatedData) {
      if (key === 'updatedIngredients') {
        // ส่งข้อมูลที่มีการแก้ไขใน updatedIngredients
        formDataToSend.append(key, JSON.stringify(updatedData[key]));
      }
      else if (key === 'ingredients') {
        // ส่งข้อมูลที่มีการแก้ไขใน updatedIngredients
        formDataToSend.append(key, JSON.stringify(updatedData[key]));
      }      if (key === 'updatedDataPackage') {
        // ส่งข้อมูลที่มีการแก้ไขใน updatedIngredients
        formDataToSend.append(key, JSON.stringify(updatedData[key]));
      }
      else if (key === 'packages') {
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

    if (deletedPackageCopy.length > 0) {
      formDataToSend.append('deletedPackage', JSON.stringify(deletedPackageCopy));
    }
  
    // ตรวจสอบข้อมูลที่ส่ง
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    // try {
    //   const res = await editProductService(formDataToSend, id);
    //   console.log('Response:', res);
    //   navigate('/product');
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  };
  
  //ค้นหา วัตถุดิบที่ใช้กับสินค้าตัวนี้เพื่อเอาไป map กับ list materail เพื่อให้เลือกโชว์ใน select box
  useEffect(() => {
    const getlistMaterialById = async () => {
      try {
        const response = await listProductByIdService(id);
        console.log(response);
  
        if (!response.data) {
          throw new Error("ไม่มีข้อมูล");
        }

        const productData = response.data[0]; 
        //ข้อมูลส่วนประกอบของสินค้า
        const ingredients = response.data.map(item => ({
          material_id: item.material_id || '',
          quantity: item.amount || '',
          cost_per_quantity: item.cost_per_quantity || 0, 
        }));
        //ข้อมูลสินค้า
        const initialData = {
          product_name: productData.product_name || '',
          quantity_per_time: productData.quantity_per_time || '',
          selling_price_per_quantity: productData.selling_price_per_quantity || '',
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

  useEffect(() => {
    const getMaterial = async () => {
        try {
            const response = await listProductPackageService();
            console.log(response.data);
            setPackageById(response.data)
        } catch (error) {
            console.error("Error fetching materials:", error);
        }
    };
    getMaterial();
  }, []);

  useEffect(() => {
    const getListProductPackageByIdService = async () => {
      try {
          const response = await listProductPackageByIdService(id);
          console.log(response.data);
          const packageProduct = response.data.map(item => ({
              package_product_id: item.package_product_id || '',
              package_name: item.package_name || '', 
          }));
          // เพิ่มข้อมูล package เข้าไปใน formData เป็นการเพิ่มข้อมูลต่อจากข้อมูลก่อนหน้า
          setFormData(prev => ({
              ...prev,
              packaging: packageProduct
          }));

          // เพิ่มข้อมูล package เข้าไปใน originalData
          setOriginalData(prev => ({
              ...prev,
              packaging: packageProduct
          }));
      } catch (error) {
          console.error("Error fetching packages:", error);
      }
    }
    getListProductPackageByIdService();
  }, []);

  const options = packageById.map((packages) => ({
    value: packages.package_id,
    label: packages.package_name
  }));

  useEffect(() => {
    if ((formData.ingredients || []).length > 0 && formData.quantity_per_time) {
        const totalCost = calculateTotalCost();
        const costPerQuantity =  totalCost / parseFloat(formData.quantity_per_time || 1); // หลีกเลี่ยงการหารด้วย 0
        setpricePreQuantity(costPerQuantity);
    }
  }, [formData.ingredients, formData.quantity_per_time]);

  
  useEffect(() => {
    if (formData.selling_price_per_quantity && formData.quantity_per_time) {
        const costPerQuantity =  formData.selling_price_per_quantity * parseFloat(formData.quantity_per_time);
        settotalPrice(costPerQuantity);
    }
  }, [formData.selling_price_per_quantity, formData.quantity_per_time]);
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="container mt-5">
        <Link className="btn btn-light text-dark mb-4" to="/product">
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
              <input type="file" name="file" className="position-absolute top-0 start-0" style={{opacity: 0,width: '100px',height: '100px',cursor: 'pointer', }} onChange={handleChange}/>
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
          
          {(formData.ingredients || []).map((ingredient, index) => (
            <div key={index} className="row mb-3 justify-content-center ingredient-row">
              <label className="col-sm-2 col-form-label">วัตถุดิบอย่างที่ {index + 1}</label>
              <div className="col-sm-3">
                <select className="form-select" name="material_id" value={ingredient.material_id} onChange={(event) => handleInputChange(index, event)} required>
                  <option value="" disabled>Select Material</option>
                  {listMaterials.map((listMaterial) => (
                    <option key={listMaterial.material_id} value={listMaterial.material_id}>
                      {listMaterial.material_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-2">
                <input type="number" name="quantity" placeholder="ปริมาณ" className="form-control" value={ingredient.quantity} onChange={(event) => handleInputChange(index, event)} required/>
              </div>
              <div className="col-sm-1">
                <button type="button" className="btn btn-danger me-5" onClick={() => handleRemoveRow(index)}>ลบ</button>
              </div>
            </div>
          ))}

          <div className="mb-3 d-md-flex justify-content-center">
              <button type="button" className="btn btn-primary" onClick={handleAddRow}>เพิ่มวัตถุดิบ</button>
          </div>
          {(formData.packaging || []).map((packaging, index) => (
            <div key={index} className="row mb-3 justify-content-center">
              <label className="col-sm-2 col-form-label">บรรจุภัณฑ์ {index + 1}</label>
              <div className="col-sm-5">
                <Select
                  options={options}
                  value={options.find((option) => option.label === packaging.package_name) ||  packaging.package_name}
                  onChange={(option) => handlePackageChange(index, option)}
                  isSearchable={true}
                  placeholder="เลือกบรรจุภัณฑ์"
                />
              </div>
              <div className="col-sm-1">
                  <button type="button" className="btn btn-danger me-5" onClick={() => handlePackageRemoveRow(index)}>ลบ</button>
              </div>
            </div>
          ))}

          <div className="mb-3 d-md-flex justify-content-center">
              <button type="button" className="btn btn-primary" onClick={handlePackageAddRow}>เพิ่มวัตถุดิบ</button>
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
            <label className="col-sm-2 col-form-label">จำนวนที่ทำ/ครั้ง</label>
            <div className="row col-sm-5">
              <input 
                type="text" 
                name='quantity_per_time'
                className="form-control" 
                placeholder="จำนวน" 
                value={formData.quantity_per_time || ''} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนต่อชิ้น</label>
            <div className="row col-sm-5">
              <input 
                type="text" 
                name='quantity'
                className="form-control" 
                placeholder="จำนวน" 
                value={pricePreQuantity}  
                readOnly
              />
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ราคาขายต่อชิ้น</label>
            <div className="row col-sm-5">
              <input 
                type="text" 
                name='selling_price_per_quantity'
                className="form-control" 
                placeholder="ราคาสินค้า" 
                value={formData.selling_price_per_quantity || ''} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ราคาสินค้ารวม</label>
            <div className="row col-sm-5">
              <input 
                type="text" 
                name='price'
                className="form-control" 
                placeholder="ราคาสินค้า" 
                value={totalPrice} 
                onChange={handleChange} 
                readOnly
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

          <div className="d-flex justify-content-center gap-3 my-4">
            <button type="button" className="btn btn-secondary mt-3 px-4 me-5" onClick={() => {handleReset()}}>ล้าง</button>
            <button type="submit" className="btn btn-primary mt-3 px-4 ms-5"> บันทึกข้อมูล </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProduct;