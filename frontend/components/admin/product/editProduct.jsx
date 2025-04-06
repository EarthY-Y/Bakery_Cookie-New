import React, { useContext,useEffect, useState} from 'react';
import Select from 'react-select';
import { Link,useNavigate,useParams } from 'react-router-dom';
import { listProductByIdService, listMaterialProductByIdService, listProductPackageByIdService, listProductPackageService } from '../../../API/admin/productService';
import { listMaterialService } from '../../../API/admin/materialService';
import { editProductService } from '../../../API/admin/productService';
import LoadingPopup from '../../untils/popUp/loading';
import ErrorPopup from '../../untils/popUp/errorPopup';
import TooltipUntils from '../../untils/popUp/tooltip';
import {numberGrouping} from '../../untils/frommatters/numberFormatting';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const EditProduct = () => {
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [listMaterials, setListMaterials] = useState([]);
  const [packageById, setPackageById] = useState([]);
  const [deletedIngredients, setDeletedIngredients] = useState([])
  const [deletedPackage, setDeletedPackage] = useState([])
  const [pricePreQuantity, setpricePreQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [active, setStatusactive] = useState("1");
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // await new Promise((resolve) => setTimeout(resolve, 3000)); //ถ้าอยากลองดูหน้า loading
        // โหลดข้อมูลพร้อมกันเพื่อลดปัญหาการโหลดข้อมูลไม่ทัน
        const [
          productResponse, //เป็น object ที่บรรจุ array
          materialProductResponse,
          materialsResponse,
          packagesResponse,
          productPackagesResponse,
        ] = await Promise.all([
          listProductByIdService(id),
          listMaterialProductByIdService(id),
          listMaterialService(),
          listProductPackageService(),
          listProductPackageByIdService(id),
        ]);

        // จัดการข้อมูลสินค้า
        const productData = productResponse.data[0];
        //เก็บข้อมูลเเบบ object ที่เป็น array 
        const ingredients = materialProductResponse.data.map((item) => ({
          material_id: item.material_id || '',
          quantity: item.quantity || '',
          cost_per_quantity: item.cost_per_quantity || 0,
          material_name: item.material_name || '',
        }));
        //initialData เป็น object ที่มี key-value หลายตัว เป็น object ที่ใช้เก็บค่าเริ่มต้นของ formData
        const initialData = {
          product_name: productData.product_name || '',
          quantity_per_time: productData.quantity_per_time || '',
          selling_price_per_quantity: productData.selling_price_per_quantity || '',
          description: productData.description || '',
          file: productData.productpic_name || '',
          is_active : productData.is_active,
          ingredients,
        };

        // จัดการข้อมูลวัสดุ
        setListMaterials(materialsResponse.data);
        setPackageById(packagesResponse.data); //packagesResponse.data เป็น array[] ที่เก็บมี object{} data:[{},{}]

        // จัดการข้อมูลแพ็คเกจโดยเอามาเเค่ id เเละชื่อ โดยใช้ .map ซึ่ง .map จะใช้กับ array เเละ return ค่าออกมาเป็น array ใหม่
        const packaging = productPackagesResponse.data.map((item) => ({
          package_product_id: item.package_product_id || '',
          package_name: item.package_name || '',
        }));
        // console.log("packaging :",packaging);

        //กำหนดค่าเริ่มต้นให้กับ formData 
        setFormData({ ...initialData, packaging }); //packaging เป็นเพียง array ที่จะถูกเพิ่มเป็น key ทำให้ไม่ต้องใช้ spread operator
        // console.log("formData :", formData);
        setOriginalData({ ...initialData, packaging });
        setStatusactive(productData.is_active)

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, [id]);  

  const calculateTotalCost = () => {
    // คำนวณต้นทุนวัตถุดิบ
    const ingredientCost = (formData.ingredients || []).reduce((totalCost, ingredient) => { // ใช้ reduce ในการคำนวณต้นทุนรวมทั้งหมด totalCost
      const material = listMaterials.find((mat) => mat.material_id === ingredient.material_id);
      const quantity = parseFloat(ingredient.quantity || 0);
      if (material && !isNaN(quantity)) {
        return totalCost + (material.cost_per_quantity * quantity);
      }
      return totalCost;
    }, 0);
  
    // คำนวณต้นทุนบรรจุภัณฑ์
    const packagingCost = (formData.packaging || []).reduce((totalCost, packaging) => {
      const selectedPackage = packageById.find((pack) => pack.package_id === packaging.package_id);
      if (selectedPackage) {
        return totalCost + selectedPackage.cost_per_quantity;
      }
      return totalCost;
    }, 0);
  
    // รวมต้นทุนวัตถุดิบและบรรจุภัณฑ์
    return ingredientCost + packagingCost;
  };
  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

  const handleAddRow = () => {
    const newIngredients = [
      ...(formData.ingredients || []),
      { tempId: `temp-${Date.now()}`, material_id: '', quantity: '' }
    ];
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };
  
  const handleRemoveRow = (index) => {
    const values = [...(formData.ingredients || [])];
    const deletedIngredient = values[index];
  
    // ตรวจสอบว่าเป็นแถวที่เพิ่มใหม่หรือไม่ โดยดูจาก tempId
    if (deletedIngredient.tempId) {
      // ลบแถวที่มี tempId
      values.splice(index, 1);
      if (values.length > 0) { 
        setFormData((prev) => ({ ...prev, ingredients: values }));
      }
    } else if (deletedIngredient.material_id) {
      // ถ้าเป็นรายการที่มี material_id ก็เก็บข้อมูลไปใน deletedIngredients
      values.splice(index, 1);
      if (values.length > 0) { 
        setFormData((prev) => ({ ...prev, ingredients: values }));
        setDeletedIngredients((prevDeleted) => [...prevDeleted, deletedIngredient]);
      }
    }
  };
  
  //ต้องทำเเยกเพราะว่ามีเรื่อง ไอดีเข้ามาเกี่ยวถ้าไม่ทำเเยกก็ต้องใช้เงื่อนไขในการเเยกใน Function นั้นๆ
  const handlePackageChange = (index, option) => {
    const values = [...(formData.packaging || [])];
    const selectedPackage = packageById.find((pkg) => pkg.package_id === option.value);
    
    if (selectedPackage) {
      values[index] = {
        ...selectedPackage,
        quantity: values[index]?.quantity || 0 // คงค่า quantity เดิมไว้
      };
      setFormData((prev) => ({ ...prev, packaging: values }));
    }
  };

  const handlePackageAddRow = () => {
    const newPackaging = [
      ...(formData.packaging || []),
      { tempId: `temp-${Date.now()}`, package_id: '', package_name: '', cost_per_quantity: '', quantity: '' }
    ];
    setFormData((prev) => ({ ...prev, packaging: newPackaging }));
  };

  const handlePackageRemoveRow = (index) => {
    const values = [...(formData.packaging || [])];
    if (deletedPackage.length > 0) { 
      const deletedPackage = values.splice(index, 1); // ลบแถวออก
      setFormData((prev) => ({ ...prev, packaging: values }));
      setDeletedPackage((prevDeleted) => [...prevDeleted, deletedPackage]);
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    const updatedData = {};
    const formDataToSend = new FormData();

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
          if (!ingredient.material_id && originalIng.material_id) {
            const isDuplicate = deletedIngredientsCopy.some(ing => ing.material_id === ingredient.material_id);
            if (!isDuplicate) {
              deletedIngredientsCopy.push(ingredient); // บันทึก ingredients ที่ถูกลบ
            }
          }
          if (parseFloat(ingredient.quantity) !== parseFloat(originalIng.quantity) && originalIng.material_id) {
            const isDuplicate = deletedIngredientsCopy.some(ing => ing.material_id === ingredient.material_id);
            if (!isDuplicate) {
              deletedIngredientsCopy.push(ingredient); // บันทึก ingredients ที่มีการเปลี่ยนแปลง
            }
          }
          if (originalIng.material_id !== ingredient.material_id) {
            const isDuplicate = newIngredients.some(ing => ing.material_id === ingredient.material_id);
            if (!isDuplicate) {
              newIngredients.push(ingredient);
              updatedData.ingredients = newIngredients;
            }
          }
          if (parseFloat(ingredient.quantity) !== parseFloat(originalIng.quantity)) {
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
            const isDuplicate = deletedPackageCopy.some(pkg => pkg.package_id === originalpck.package_id);// ถ้าไม่มี package_id ใน formData แต่มีใน originalData
            if (!isDuplicate) {
              deletedPackageCopy.push(originalpck); // ถือว่าเป็นการลบ
            } //อนาคตอาจจะต้องเพิ่ม else เเละ logic การเเจ้งเตือน
          }
          // ตรวจสอบการเพิ่ม
          if (packages.package_id && !originalpck.package_id) {
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
          formDataToSend.append('file', formData.file); // ถ้าเป็นไฟล์ใหม่ให้ส่งไฟล์
        } else if (typeof formData.file === 'string') {
          formDataToSend.append('productpic_name', formData.file); // ถ้าเป็นชื่อไฟล์เดิมให้ส่งชื่อ
        }
      } else if (formData[key] !== originalData[key]) {
        updatedData[key] = formData[key]; // อัปเดตค่าอื่นๆ ที่มีการเปลี่ยนแปลง
      }
    }
  
    if (Object.keys(updatedData).length === 0 && deletedIngredientsCopy.length === 0) {
      setError('ไม่มีการเปลี่ยนแปลงข้อมูล');
      return;
    }

    //loop เพื่อเเปลงค่าจาก object ให้เป็น json ผ่าน key ที่สร้าง
    for (const key in updatedData) {
      if (key === 'ingredients' || key === 'packages') {
        formDataToSend.append(key, JSON.stringify(updatedData[key]));
      } else {
        formDataToSend.append(key, JSON.stringify(updatedData[key]));
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
  
    try {
      const res = await editProductService(formDataToSend, id);
      if(res){
        setIsLoading(false)
        navigate(-1);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error)
    }finally{
      setIsLoading(false)
    }
  };

  const options = packageById.map((packages) => ({
    value: packages.package_id,
    label: packages.package_name
  }));
  const optionsMaterial = listMaterials.map((materials) => ({
    value: materials.material_id,
    label: materials.material_name
  }));

  //หาต้นทุนต่อชิ้น
  useEffect(() => {
    const totalCostOrigin = calculateTotalCost();
    const hiddenCosts = totalCostOrigin + (totalCostOrigin * 10 /100) //ต้นทุนแฝง ค่าเเก๊ส ค่าไฟฟ้า ค่าถ่าน
    setTotalCost(hiddenCosts.toFixed(2))
    if (formData.ingredients || formData.packaging) {
      console.log(totalCostOrigin);
      const costPerQuantity =  parseFloat(hiddenCosts) / parseFloat(formData.quantity_per_time || 1); // หลีกเลี่ยงการหารด้วย 0
      setpricePreQuantity(costPerQuantity.toFixed(2));
    }

  }, [formData.ingredients, formData.quantity, formData.packaging]);

  useEffect(() => {
    if (formData.selling_price_per_quantity && formData.quantity_per_time) {
      const costPerQuantity =  formData.selling_price_per_quantity * parseFloat(formData.quantity_per_time);
      setTotalPrice(costPerQuantity);
    }
  }, [formData.selling_price_per_quantity, formData.quantity_per_time, formData.ingredients]);

  useEffect(() => {
    if (formData.quantity_per_time && formData.ingredients || formData.packaging) {
      let totalWeight = 0
      for (const item of formData.ingredients) {
        totalWeight += parseFloat(item.quantity);
      }
      console.log(totalWeight);
      const weightPiece = totalWeight / formData.quantity_per_time
      setFormData(prevData => ({
        ...prevData,
        weight_per_piece: (weightPiece ? parseFloat(weightPiece.toFixed(2)) : 0)
      }));
    }
  }, [formData.ingredients, formData.quantity_per_time, formData.packaging]);
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="container mt-5 p-3">

        {/* ข้อมูลทั่วไปของสินค้า */}
        <div className="mb-4 card col-md-12 px-40 bg-light card-body">
          <h4>ข้อมูลทั่วไปของสินค้า</h4>
          <div className="mb-3 text-center">
            <div className="bg-white" style={{width: '100px',height: '100px',border: '1px dashed #ccc',borderRadius: '5px',position: 'relative',display: 'inline-flex',alignItems: 'center',justifyContent: 'center'}}>
              {formData.file ? (typeof formData.file === 'string' ? 
                  ( <img src={`${API_URL_PICTURE}${formData.file}`} alt="Preview" style={{ width: '100%', height: '100%', borderRadius: '5px', objectFit: 'cover' }} />) 
                  : ( <img src={URL.createObjectURL(formData.file)} alt="Preview" style={{ width: '100%', height: '100%', borderRadius: '5px', objectFit: 'cover' }} />)
              ) : (
                <span>เพิ่มรูปสินค้า</span>
              )}
              <input type="file" name="file" className="position-absolute top-0 start-0" style={{opacity: 0,width: '100px',height: '100px',cursor: 'pointer', }} onChange={handleChange}/>
            </div>
            {formData.file && <p>ไฟล์ที่เลือก: {formData.file.name}</p>}
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อสินค้า</label>
            <div className="col-sm-5">
              <input type="text" name='product_name'className="form-control" placeholder="ชื่อสินค้า" value={formData.product_name || ''} 
                /* formData.product_name || '' ตั้งค่าเป็น string ว่างถ้าเป็น undefined 
                เนื่องจาก ใน formData เราทำเป็น Dynamic เพิ่มตามจำนวน name ของ input 
                เเล้วไม่ได้ set ค่า เหมือนในหน้า signUp*/
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">การใช้งาน</label>
            <div className="col-sm-5">
              <select className="form-select" name="is_active" value={formData.is_active || active} onChange={handleChange}   required aria-label="Default select example" placeholder="เลือก">
                <option value="1">วางขาย</option>
                <option value="0">เลิกขาย</option>
                {/* <option value="3">Three</option> */}
              </select>
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">รายละเอียดสินค้า</label>
            <div className="col-sm-5">
              <textarea className="form-control" name='description' placeholder="รายละเอียดสินค้า"
                  value={formData.description || ''} 
                  onChange={handleChange} 
                  rows="3" // กำหนดความสูงของ textarea
                  style={{ minWidth: '100%' }} // กำหนดความกว้างของ textarea
                />
            </div>
          </div>
        </div>

        {/* ส่วนประกอบของสินค้า */}
        <div className="mb-4 card col-md-12 px-40 bg-light card-body">
          <h4>ส่วนประกอบของสินค้า</h4>
          {(formData.ingredients || []).map((ingredient, index) => (
            <div key={index} className="row mb-3 justify-content-center ingredient-row">
              <label className="col-sm-2 col-form-label">วัตถุดิบอย่างที่ {index + 1}</label>
              <div className="col-sm-2">
                <Select
                  options={optionsMaterial}
                  name="material_id"
                  value={optionsMaterial.find((option) => option.value === ingredient.material_id) ||  ""}
                  onChange={(options) => handleInputChange(index, options, '')}
                  isSearchable={true}
                  placeholder="เลือกวัตถุดิบ"
                />
              </div>
              <div className="col-sm-2 mb-2">
                <div className="input-group">
                  <input type="number" name="quantity" placeholder="ปริมาณ" className="form-control" value={ingredient.quantity} onChange={(event) => handleInputChange(index, '', event)} required/>
                  <span className="input-group-text">กรัม</span>
                </div>

              </div>
              <div className="col-sm-1">
                <button type="button" className="btn btn-danger me-5" onClick={() => handleRemoveRow(index)}><i className="bi bi-trash"></i></button>
              </div>
            </div>
          ))}

          <div className="mb-3 d-flex justify-content-center">
              <button type="button" className="btn btn-primary" onClick={handleAddRow}>เพิ่มวัตถุดิบ</button>
          </div>
          {(formData.packaging || []).map((packaging, index) => (
            <div key={packaging.tempId || packaging.package_id || index}  className="row mb-3 justify-content-center">
              <label className="col-sm-2 col-form-label">บรรจุภัณฑ์ </label> {/* {index + 1} */}
              <div className="col-sm-5 mb-2">
                <Select
                  options={options}
                  value={options.find((option) => option.label === packaging.package_name) ||  packaging.package_name}
                  onChange={(option) => handlePackageChange(index, option)}
                  isSearchable={true}
                  placeholder="เลือกบรรจุภัณฑ์"
                />
              </div>
              {/* <div className="col-sm-1">
                  <button type="button" className="btn btn-danger me-5" onClick={() => handlePackageRemoveRow(index)}><i className="bi bi-trash"></i></button>
              </div> */}
            </div>
          ))}

          {/* <div className="mb-3 d-flex justify-content-center">
              <button type="button" className="btn btn-primary" onClick={handlePackageAddRow}>เพิ่มบรรจุภัณฑ์</button>
          </div> */}
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">จำนวนชิ้นที่ทำ/ครั้ง</label>
            <div className="col-sm-5">
              <div className="input-group">
                <input type="number" name='quantity_per_time'className="form-control" placeholder="จำนวน" value={formData.quantity_per_time || ''} onChange={handleChange} />
                <span className="input-group-text">ชิ้น</span>
              </div>
            </div>
          </div>

          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">น้ำหนักต่อชิ้น</label>
            <div className="col-sm-5">
              <div className="input-group">
                <input type="number" name='weight_per_piece'className="form-control" placeholder="ราคาสินค้า" value={formData.weight_per_piece || 0} onChange={handleChange} />
                <span className="input-group-text">กรัม</span>
              </div>
            </div>
          </div>
        </div>

        {/* ต้นทุน และ ราคาขาย */}
        <div className="mb-4 card col-md-12 px-40 bg-light card-body">
          <h4>ต้นทุน</h4>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนสินค้า</label>
            <div className="col-sm-5">
              <div className="input-group">
                <input type="number" name='costPerQuantity'className="form-control" placeholder="ต้นทุนสินค้า" value={calculateTotalCost().toFixed(2)} readOnly/>
                <span className="input-group-text">บาท</span>
              </div>
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนรวม
              <TooltipUntils 
                text="รวมต้นทุนเเฝงอีก 10 % เช่น ค่าน้ำ ค่าไฟ ค่าเเก๊ส เเละค่าบรรจุภัฑณ์"
              />
            </label>
            <div className="col-sm-5">
              <div className="input-group">
                <input type="number" name='totalCost'className="form-control" placeholder="จำนวน" value={totalCost} readOnly/>
                <span className="input-group-text">บาท</span>
              </div>
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ต้นทุนต่อชิ้น</label>
            <div className="col-sm-5">
              <div className="input-group">
                <input type="number" name='pricePreQuantity'className="form-control" placeholder="จำนวน" value={pricePreQuantity}  readOnly/>
                <span className="input-group-text">บาท</span>
              </div>
            </div>
          </div>
        </div>

        {/* ราคาขาย */}
        <div className="mb-4 card col-md-12 px-40 bg-light card-body">
          <h4>ราคา</h4>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ราคาขายต่อชิ้น</label>
            <div className="col-sm-5">
              <div className="input-group">
                <input type="number" name='selling_price_per_quantity'className="form-control" placeholder="ราคาสินค้า" value={formData.selling_price_per_quantity || 0} onChange={handleChange} />
                <span className="input-group-text">บาทต่อชิ้น</span>
              </div>
            </div>
          </div>
          <div className="row mb-3 justify-content-center">
            <label className="col-sm-2 col-form-label">ราคาสินค้ารวม</label>
            <div className="col-sm-5">
              <div className="input-group">
                <input type="number" name='price'className="form-control" placeholder="ราคาสินค้า" value={totalPrice} onChange={handleChange} readOnly/>
                <span className="input-group-text">บาท</span>
              </div>
            </div>
          </div>
        </div>

        {/* ปุ่มบันทึก */}
        <div className="d-flex justify-content-center gap-3 my-4">
            <button type="submit" className="btn btn-success mt-3 px-4 ms-5"> บันทึกข้อมูล </button>
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

export default EditProduct;