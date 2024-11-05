import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormContextMaterialProduct } from '../../../API/productService';
import { listMaterialService } from '../../../API/materialService';
import { createProductService } from '../../../API/productService';

const CreateMaterialProduct = () => {
    const [listMaterials, setListMaterials] = useState([]);
    const { formData, setFormData } = useContext(FormContextMaterialProduct);
    const navigate = useNavigate();
    useEffect(() => {
        const getMaterial = async () => {
            try {
                const response = await listMaterialService();
                setListMaterials(response.data);
            } catch (error) {
                console.error("Error fetching materials:", error);
            }
        };
        getMaterial();
    }, []);

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
        <div className="container mt-5">
            <form onSubmit={handleSubmitProductMaterial}>
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
                <div className="mb-5 d-md-flex justify-content-center">
                    <button type="button" className="btn btn-primary" onClick={handleAddRow}>เพิ่มวัตถุดิบ</button>
                </div>
                <div className="d-md-flex justify-content-center">
                    <Link className="btn btn-secondary me-2" to="/product/create">กลับ</Link>
                    <button type="submit" className="btn btn-primary"> เพิ่มสินค้า </button>
                </div>
            </form>
        </div>
    );
}

export default CreateMaterialProduct;
