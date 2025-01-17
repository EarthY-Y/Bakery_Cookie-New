import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { listMaterialByIdService, listProductMaterialByIdService } from '../../../API/admin/materialService';
import { formatDate } from '../../untils/frommatters/datetime';
import ErrorPopup from '../../untils/popUp/errorPopup';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const listMaterialById = () => {
  const {id} = useParams();
  const [materialMyId, setMaterialMyId] = useState([])
  const [materialProductMyId, setMaterialProductMyId] = useState([])
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const getlistMaterialById = async()=> {
      try {
        const [
          getlistMaterialById,
          getlistProductMaterialById,
        ] = await Promise.all([
          listMaterialByIdService(id),
          listProductMaterialByIdService(id)
        ])
        console.log("getlistProductMaterialById", getlistProductMaterialById.data);
        console.log("getlistMaterialById", getlistMaterialById.data);
        
        setMaterialMyId(getlistMaterialById.data[0] || [])
        setMaterialProductMyId(getlistProductMaterialById.data)
      }
      
      catch (error) {
        setError(error)
      }
    }
    getlistMaterialById()
  },[])

  return (
    <div className="container mt-5 p-3">
      <div className="mb-4 card col-md-12 px-40 rounded shadow border bg-light card-body">
        <div className="text-center mb-4">
          <img src={API_URL_PICTURE + materialMyId.materialpic_name} height={250} width={400} alt="Material" className="rounded img-fluid" />
        </div>

        {/* <div className="mb-3">
          <label className="form-label fw-bold">รหัสวัตถุดิบ</label>
          <p className="border p-2 rounded bg-white">{materialMyId.material_id}</p>
        </div> */}

        <div className="mb-3">
          <label className="form-label fw-bold">ชื่อวัตถุดิบ</label>
          <p className="border p-2 rounded bg-white">{materialMyId.material_name}</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">ต้นทุนวัตถุดิบ</label>
          <p className="border p-2 rounded bg-white">{materialMyId.cost}</p>
        </div>

        <div className="">
          <label className="form-label fw-bold">ปริมาณ</label>
          <p className="border p-2 rounded bg-white">{materialMyId.quantity}</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">ต้นทุนต่อปริมาณ</label>
          <p className="border p-2 rounded bg-white">{materialMyId.cost_per_quantity}</p>
        </div>

        <div className="pb-4">
          <label className="form-label fw-bold">เป็นส่วนประกอบของ</label>
          <div className="row gy-4">
            <div className="px-3">
              {materialProductMyId.length !== 0 ? (
                materialProductMyId.map((products, index) => (
                  <div className="col-12 border rounded p-3 mb-3 shadow bg-light" key={index}>
                    <div className="d-flex align-items-center">           
                      <h6 className="mb-0 me-3 text-muted">{index + 1}.</h6>
                      <img src={API_URL_PICTURE + products.productpic_name} height={100} width={150} alt="Material" className="img-fluid rounded" />
                      <div className="ms-4 d-flex flex-column w-100">
                        <h6 className="fw-bold mb-2">{products.product_name}</h6>
                        <div className="row align-items-center">
                          <div className="col-12 col-md-6 mt-2">
                            <Link to={`/product/view/${products.product_id}`} className="btn btn-info btn-sm text-white w-100">
                              <i className="bi bi-eye"></i> ดู
                            </Link>
                          </div>
                          <div className="col-12 col-md-6 mt-2">
                            <Link to={`/product/edit/${products.product_id}`} className="btn btn-warning btn-sm w-100">
                              <i className="bi bi-pencil"></i> แก้ไข
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ):(<p className="border p-2 rounded bg-white">ไม่ได้เป็นส่วนประกอบของสินค้าได้</p>)}
            </div>
          </div>
        </div>

        <div className="mb-3 row">
          <div className='col-md-6 col-12'>
            <label className="form-label fw-bold ">สร้างโดย</label>
            <p className="border p-2 rounded bg-white">{materialMyId.created_by}</p>
          </div>
          <div className='col-md-6 col-12'>
            <label className="form-label fw-bold">เวลา</label>
            <p className="border p-2 rounded bg-white">{formatDate(materialMyId.created_at)}</p>
          </div>
        </div>

        <div className="mb-3 row">
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold ">แก้ไขโดย</label>
            <p className="border p-2 rounded bg-white">{materialMyId.updated_by || "ไม่มีผู้แก้ไข"}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">เวลา</label>
            <p className="border p-2 rounded bg-white">{formatDate(materialMyId.updated_at)}</p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to={`/material/edit/${materialMyId.material_id}`} className="text-center mt-3 px-4 btn btn-warning"><i className="bi bi-pencil"></i> แก้ไข </Link>
        </div>
      </div>
      {error && (
        <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default listMaterialById;