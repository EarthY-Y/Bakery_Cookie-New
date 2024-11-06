import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { listProductByIdService } from '../../../API/productService';
import { formatDate } from '../../datetime';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const listMaterialById = () => {
  const {id} = useParams();
  const [ productMyId, setproductMyId] = useState([])
  const navigate = useNavigate();

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

  return (
    <div className="container mt-5 p-4 border rounded shadow-sm bg-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <Link to="/product" className="btn btn-outline-secondary">
                ย้อนกลับ
            </Link>
        </div>

        <div className="text-center mb-4">
            <img
                src={API_URL_PICTURE+ productMyId[0]?.productpic_name	}
                height={250}
                width={400}
                alt="Material"
                className="rounded"
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

        <div className="mb-3">
            <label className="form-label fw-bold">ปริมาณ</label>
            <p className="border p-2 rounded bg-white">{productMyId[0]?.quantity}</p>
        </div>

        {productMyId.map((product, index) => (
          <div key={index} className="border p-3 rounded mb-4 bg-light">
            <div className="mb-3 row">
                <label className="form-label fw-bold col-6 me-5">วัตถุดิบที่ {index+1}</label>
                <label className="form-label fw-bold col-2 me-5">ปริมาณ</label>
                <label className="form-label fw-bold col-2 me-5">ราคา/ปริมาณ</label>
                
            </div>

            <div className="mb-3 row">
                <p className="border p-2 rounded bg-white col-6 me-5">{product.material_name}</p>
                <p className="border p-2 rounded bg-white col-2 me-5">{product.amount} กรัม</p>
                <p className="border p-2 rounded bg-white col-2 me-5">{product.cost_per_quantity} บาท/กรัม</p>
            </div>
          </div>
        ))}

        <div className="mb-3">
            <label className="form-label fw-bold">ต้นทุนวัตถุดิบ</label>
            <p className="border p-2 rounded bg-white">{productMyId[0]?.cost}</p>
        </div>

        <div className="mb-3 row">
          <div className='col-6'>
            <label className="form-label fw-bold ">สร้างโดย</label>
            <p className="border p-2 rounded bg-white">{productMyId[0]?.userName}</p>
          </div>
          <div className='col-6'>
            <label className="form-label fw-bold ">เวลา</label>
            <p className="border p-2 rounded bg-white">{formatDate(productMyId[0]?.create_at)}</p>
          </div>
        </div>

        <div className="text-center mt-4">
          {/* <Link to={`/material/edit/${productMyId.material_id}`} className="text-center mt-3 px-4 btn btn-outline-warning text-black">Edit</Link> */}
        </div>
    </div>

  );
};

export default listMaterialById;