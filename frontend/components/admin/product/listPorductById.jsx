import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { listProductByIdService } from '../../../API/admin/productService';
import { formatDate } from '../../untils/frommatters/datetime';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_PRODUCT

const listMaterialById = () => {
  const {id} = useParams();
  const [ productMyId, setproductMyId] = useState([])

  useEffect(() => {
    const getlistMaterialById = async()=> {
      try {
        const response = await listProductByIdService(id)
        console.log(response);
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        setproductMyId(response.data)
      }
      
      catch (error) {
        alert(error)
      }
    }
    getlistMaterialById()
  },[])

  const calculateTotalCost = () => {
    return productMyId.reduce((totalCost, item) => {
      const quantity = parseFloat(item.quantity || 0); // จำนวนของวัตถุดิบ
      const costPerQuantity = parseFloat(item.cost_per_quantity || 0); // ต้นทุนต่อหน่วย
  
      if (!isNaN(quantity) && !isNaN(costPerQuantity)) {
        return totalCost + quantity * costPerQuantity;
      }
      return totalCost;
    }, 0);
  };

  return (
    <div className="container mt-5 p-3">
      <Link to="/product" className="btn btn-outline-secondary mb-4">
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </Link>
      
      <div className="mb-4 card col-md-12 px-40 rounded shadow border bg-light card-body">
        <div className="text-center mb-4">
          <img
            src={API_URL_PICTURE+ productMyId[0]?.productpic_name}
            height={250}
            width={400}
            alt="Material"
            className="rounded img-fluid"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">รหัสวัตถุดิบ</label>
          <p className="border p-2 rounded bg-white">{productMyId[0]?.product_id}</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">ชื่อวัตถุดิบ</label>
          <p className="border p-2 rounded bg-white">{productMyId[0]?.product_name}</p>
        </div>

        {productMyId.map((product, index) => (
          <div key={index} className="border p-3 rounded mb-4" style={{background:'#EBEAEA'}}>
            <div className="mb-3 row">
              <label className="form-label fw-bold col-6 me-5 d-none d-md-block">วัตถุดิบที่ {index+1}</label>
              <label className="form-label fw-bold col-2 me-5 d-none d-md-block">ปริมาณ</label>
              <label className="form-label fw-bold col-2 me-5 d-none d-md-block">ราคา/ปริมาณ</label>
            </div>

            <div className="mb-3 row">
              <span className="fw-bold text-dark d-block d-md-none mb-2">วัตถุดิบที่ {index+1}</span>
              <p className="border p-2 rounded bg-white col-md-6 col-12 me-5">{product.material_name}</p>
              <span className="fw-bold text-dark d-block d-md-none mb-2">ปริมาณ</span>
              <p className="border p-2 rounded bg-white col-md-2 col-12 me-5">{product.quantity} กรัม</p>
              <span className="fw-bold text-dark d-block d-md-none mb-2">ราคา/ปริมาณ</span>
              <p className="border p-2 rounded bg-white col-md-2 col-12 me-5">{product.cost_per_quantity} บาท/กรัม</p>
            </div>
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label fw-bold">ต้นทุนวัตถุดิบ</label>
          <p className="border p-2 rounded bg-white">{calculateTotalCost()}</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">ปริมาณที่ทำ/ครั้ง</label>
          <p className="border p-2 rounded bg-white">{productMyId[0]?.quantity_per_time}</p>
        </div>

        <div className="">
          <label className="form-label fw-bold">ราคาขาย/ชิ้น</label>
          <p className="border p-2 rounded bg-white">{productMyId[0]?.selling_price_per_quantity}</p>
        </div>

        <div className="mb-3 row">
          <div className="col-md-6 col-12 mt-3">
            <label className="form-label fw-bold">สร้างโดย</label>
            <p className="border p-2 rounded bg-white">{productMyId[0]?.userName}</p>
          </div>
          <div className="col-md-6 col-12 mt-3">
            <label className="form-label fw-bold">เวลา</label>
            <p className="border p-2 rounded bg-white">{formatDate(productMyId[0]?.created_at)}</p>
          </div>
        </div>

        <div className="text-center mt-4">
          {/* <Link to={`/material/edit/${productMyId.material_id}`} className="text-center mt-3 px-4 btn btn-outline-warning"><i className="bi bi-pencil"></i> แก้ไข </Link> */}
        </div>
      </div>
    </div>

  );
};

export default listMaterialById;