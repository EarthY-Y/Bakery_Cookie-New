import React, { useContext,useEffect, useState} from 'react';
import Select from 'react-select';
import { Link,useNavigate } from 'react-router-dom';
import { listMaterialService } from '../../../API/admin/materialService';
import { createProductService, listProductPackageService } from '../../../API/admin/productService';
import TooltipUntils from '../../untils/popUp/tooltip';
import ErrorPopup from '../../untils/popUp/errorPopup';
import LoadingPopup from '../../untils/popUp/loading';

const CreateProduct = () => {
  const [formData, setFormData] = useState({}) //
  const [listMaterials, setListMaterials] = useState([]);
  const [listPackage, setListPackage] = useState([]);
  const [pricePreQuantity, setpricePreQuantity] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับคำนวณต้นทุนรวม
  const calculateTotalCost = () => {
    // คำนวณต้นทุนวัตถุดิบ
    const ingredientCost = (formData.ingredients || []).reduce((totalCost, ingredient) => {
      const material = listMaterials.find((mat) => mat.material_id === ingredient.material_id);
      const quantity = parseFloat(ingredient.quantity || 0);
      if (material && !isNaN(quantity)) {
        return totalCost + (material.cost_per_quantity * quantity);
      }
      return totalCost;
    }, 0);
  
    // คำนวณต้นทุนบรรจุภัณฑ์
    const packagingCost = (formData.packaging || []).reduce((totalCost, packaging) => {
      const selectedPackage = listPackage.find((pack) => pack.package_id === packaging.package_id);
      if (selectedPackage) {
        return totalCost + selectedPackage.cost_per_quantity;
      }
      return totalCost;
    }, 0);
  
    // รวมต้นทุนวัตถุดิบและบรรจุภัณฑ์
    return ingredientCost + packagingCost;
  };
  

  const handleInputChange = (index, options, event) => {
    const values = [...(formData.ingredients || [])];
    const oldIngredient = values[index];
  
    // สร้าง ingredient ใหม่
    const updatedIngredient = {
      ...oldIngredient,
      [event?.target?.name || 'material_id']: event?.target?.value || options?.value,
      [event?.target?.name || 'material_name']: options?.label || '',
    };
  
    // Update based on the event or options provided
    if (event) {
      updatedIngredient[event.target.name] = event.target.value;
    }
  
    // ถ้ามีการเปลี่ยน material_id
    if (updatedIngredient.material_id && oldIngredient.material_id !== updatedIngredient.material_id) {
      // สร้าง tempId ใหม่
      updatedIngredient.tempId = `temp-${Date.now()}`;
  
      // เก็บ oldIngredient เข้า deletedIngredients ถ้ามี material_id เดิม
      if (oldIngredient.material_id) {
        setDeletedIngredients((prevDeleted) => {
          const isDuplicate = prevDeleted.some(item => item.material_id === oldIngredient.material_id);
          return isDuplicate ? prevDeleted : [...prevDeleted, oldIngredient];
        });
      }
    }
  
    // แทนที่ค่าเดิมด้วย ingredient ใหม่
    values[index] = updatedIngredient;
  
    // อัปเดต state
    setFormData((prev) => ({ ...prev, ingredients: values }));
  };

  const handlePackageChange = (index, option) => {
    const values = [...(formData.packaging || [])];
    const selectedPackage = listPackage.find((packages) => packages.package_id === option.value);
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

  const handleReset = () => {
    setFormData({
      product_name: '',
      quantity: '',
      price: '',
      description: '',
      file: null,
      ingredients: [],
      packaging: [],
    });
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

  const handleAddRow = () => {
    const newIngredients = [
      ...(formData.ingredients || []),
      { tempId: `temp-${Date.now()}`, material_id: '', quantity: '' }
    ];
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const handleRemoveRow = (index) => {
    const values = [...(formData.ingredients || [])];
    if (values.length > 1) { // ป้องกันการลบเมื่อมีแค่แถวเดียว
      values.splice(index, 1);
      setFormData(prev => ({ ...prev, ingredients: values }));
    }
  };

  const handlePackageAddRow = () => {
    const newIngredients = [...(formData.packaging || []), { package_id: '', package_name: '' }];
    setFormData(prev => ({ ...prev, packaging: newIngredients })); // อัปเดต formData
  };

  const handlePackageRemoveRow = (index) => {
    const values = [...(formData.packaging || [])];
    if (values.length > 1) { // ป้องกันการลบเมื่อมีแค่แถวเดียว
      values.splice(index, 1);
      setFormData(prev => ({ ...prev, packaging: values }));
    }
  };

  //Render component มาเเล้วเเสดง form เลย
  useEffect(() => {
    if (!formData.ingredients || formData.ingredients.length === 0) {
      setFormData(prev => ({
        ...prev,
        ingredients: [{ material_id: '', quantity: '' }]
      }));
    }
    if (!formData.packaging || formData.packaging.length === 0) {
      setFormData(prev => ({
        ...prev,
        packaging: [{ package_id: '', package_name: '' }]
      }));
    }
  }, []);
  //หาต้นทุนต่อชิ้น
  useEffect(() => {
    const totalCostOrigin = calculateTotalCost();
    const hiddenCosts = totalCostOrigin + (totalCostOrigin * 10 /100) //ต้นทุนแฝง ค่าเเก๊ส ค่าไฟฟ้า ค่าถ่าน
    setTotalCost(hiddenCosts.toFixed(2))
    if (formData.ingredients || formData.packaging) {
      console.log(totalCostOrigin);
      const costPerQuantity =  parseFloat(hiddenCosts) / parseFloat(formData.quantityPerTime || 1); // หลีกเลี่ยงการหารด้วย 0
      setpricePreQuantity(costPerQuantity.toFixed(2));
    }

  }, [formData.ingredients, formData.quantity, formData.packaging, formData.quantityPerTime]);
  
  useEffect(() => {
    if (formData.price && formData.quantityPerTime) {
        const costPerQuantity =  (formData.price || 0) * parseFloat(formData.quantityPerTime);
        setTotalPrice((costPerQuantity.toFixed(2) || 0));
    }
  }, [formData.price, formData.quantityPerTime]);

  useEffect(() => {
    if (formData.quantityPerTime && formData.ingredients || formData.packaging) {
      let totalWeight = 0
      for (const item of formData.ingredients) {
        totalWeight += parseFloat(item.quantity);
      }
        const weightPiece = totalWeight / formData.quantityPerTime
        setFormData(prevData => ({
          ...prevData,
          weightPerPiece: (weightPiece ? parseFloat(weightPiece.toFixed(2)) : 0)
        }));
    }
  }, [formData.ingredients, formData.quantityPerTime, formData.packaging]);

  useEffect(() => {
    const fetchData = async () => {
        try {
          setIsLoading(true)
          const [
            getlistMaterialById,
            getListProductPackage
          ] = await Promise.all([
            listMaterialService(),
            listProductPackageService(),
          ])
          setListMaterials(getlistMaterialById.data)
          setListPackage(getListProductPackage.data);
        } catch (error) {
            console.error("Error fetching materials:", error);
            setError(error)
        }finally{
          setIsLoading(false)
        }
    };
    fetchData();
  }, []);

  const options = listPackage.map((packages) => ({
    value: packages.package_id,
    label: packages.package_name
  }));
  const optionsMaterial = listMaterials.map((materials) => ({
    value: materials.material_id,
    label: materials.material_name
  }));
  const handleSubmitProductMaterial = async (event) => {
    event.preventDefault();
    console.log(formData); // Log formData for debugging
    try {
        setIsLoading(true)
        const res = await createProductService(formData);
        console.log(res);
        navigate(-1);
    } catch (error) {
        console.log(error); // แสดงข้อผิดพลาด
        setError(error);
    }finally{
      setIsLoading(false)
    }
  };
 
  return (
    <form onSubmit={handleSubmitProductMaterial}>
      <div className="container mt-5 p-3">
        <div className="mb-4 card col-md-12 px-40 bg-light card-body">
          <h4>เพิ่มสินค้า</h4>
          
          <div className="mb-4 text-center">
            <div className="bg-white" style={{ width: '100px', height: '100px', border: '1px dashed #ccc', borderRadius: '5px', position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {formData.file ? ( /* เป็นรูปเเบบการเขียน if-eles ที่เรียกว่า Ternary Operator ใช้กับใน JSX เเต่ถ้าต้องการนำกลับมาใช้ได้ต้องเขียนเป็น renderStatus*/
                <img src={URL.createObjectURL(formData.file)} alt="Preview" style={{ width: '100%', height: '100%', borderRadius: '5px', objectFit: 'cover' }} />
              ) : (
                <span>เพิ่มรูปสินค้า</span>
              )}
              <input type="file" name="file"className="position-absolute top-0 start-0" style={{opacity: 0,width: '100px',height: '100px',cursor: 'pointer'}}onChange={handleChange} />
            </div>
            {formData.file && <p>ไฟล์ที่เลือก: {formData.file.name}</p>}
          </div>
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อสินค้า</label>
            <div className="row col-sm-5">
              <input type="text" name='product_name'className="form-control" placeholder="ชื่อสินค้า" value={formData.product_name || ''} 
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
                <Select
                  options={optionsMaterial}
                  name="material_id"
                  value={optionsMaterial.find((option) => option.value === ingredient.material_id) ||  ""}
                  onChange={(options) => handleInputChange(index, options, '')}
                  isSearchable={true}
                  placeholder="เลือกวัตถุดิบ"
                />
              </div>
              <div className="col-sm-1 mb-2">
                <input type="number" name="quantity" placeholder="ปริมาณ" className="form-control" value={ingredient.quantity} onChange={(event) => handleInputChange(index, '', event)} required/>
              </div>
              <div className="col-sm-1">
                <button type="button" className="btn btn-danger me-5" onClick={() => handleRemoveRow(index)}><i className="bi bi-trash"></i></button>
              </div>
            </div>
          ))}
          <div className="mb-4 d-flex justify-content-center">
              <button type="button" className="btn btn-primary" onClick={handleAddRow}>เพิ่มวัตถุดิบ</button>
          </div>
          {(formData.packaging || []).map((packaging, index) => (
            <div key={index} className="row mb-3 justify-content-center">
              <label className="col-sm-2 col-form-label ">บรรจุภัณฑ์ {index + 1}</label>
              <div className="col-sm-4 mb-2">
                <Select
                options={options}
                value={options.find((option) => option.value === packaging.package_id) || null}
                onChange={(option) => handlePackageChange(index, option)}
                isSearchable={true}
                placeholder="เลือกบรรจุภัณฑ์"
                />
              </div>
              <div className="col-sm-1">
                  <button type="button" className="btn btn-danger me-5" onClick={() => handlePackageRemoveRow(index)}><i className="bi bi-trash"></i></button>
              </div>
            </div>
          ))}

          {/* <div className="mb-4 d-flex justify-content-center">
              <button type="button" className="btn btn-primary" onClick={handlePackageAddRow}>เพิ่มบรรจุภัณฑ์</button>
          </div> */}

          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนวัตถุดิบ</label>
            <div className="row col-sm-5">
              <input type="text" name='costPerQuantity'className="form-control" placeholder="ต้นทุนสินค้า" value={calculateTotalCost().toFixed(2)} readOnly/>
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">จำนวนที่ทำต่อครั้ง</label>
            <div className="row col-sm-5">
              <input type="number" name='quantityPerTime'className="form-control" placeholder="จำนวน" value={formData.quantityPerTime || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนรวม
              <TooltipUntils 
                text="รวมต้นทุนเเฝงอีก 10 % เช่น ค่าน้ำ ค่าไฟ ค่าเเก๊ส เเละค่าบรรจุภัฑณ์"
              />
            </label>
            <div className="row col-sm-5">
              <input type="text" name='totalQuantity'className="form-control" placeholder="จำนวน" value={totalCost || 0} readOnly/>
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนต่อชิ้น</label>
            <div className="row col-sm-5">
              <input type="text" name='quantity'className="form-control" placeholder="จำนวน" value={pricePreQuantity || 0} readOnly/>
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">น้ำหนักต่อชิ้น</label>
            <div className="row col-sm-5">
              <input type="number" name='weightPerPiece'className="form-control" placeholder="ราคาสินค้า" value={formData.weightPerPiece } onChange={handleChange} />
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ราคาขายต่อชิ้น</label>
            <div className="row col-sm-5">
              <input type="number" name='price'className="form-control" placeholder="ราคาสินค้า" value={formData.price || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ราคาสินค้ารวม</label>
            <div className="row col-sm-5">
              <input type="text" name='totalPrice'className="form-control" placeholder="ราคาสินค้า" value={totalPrice || 0} onChange={handleChange} readOnly/>
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
            <button type="submit" className="btn btn-success mt-3 px-4 ms-5" > เพิ่มสินค้า </button>
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
    </form>
  );
};

export default CreateProduct;