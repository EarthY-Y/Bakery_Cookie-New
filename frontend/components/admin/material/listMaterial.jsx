import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listMaterialService, deleteMaterialByIdService } from '../../../API/admin/materialService'
import { formatDate } from '../../untils/frommatters/datetime'
import Search from '../../untils/fucntion/search'
import LoadingPopup from '../../untils/popUp/loading'
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const ListMaterial = () => {
  const [materials, setMaterials] = useState([])
  const [materialsSearch, setMaterialsSearch] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getMaterials = async () => {
      try {
        setIsLoading(true)
        const res = await listMaterialService()
        console.log(res.data)
        setMaterials(res.data)
      } catch (err) {
        console.error("Error fetching materials:", err)
      }finally{
        setIsLoading(false);
      }
    };

    getMaterials()
  }, [])

  const handleSearch = (results) => {
    setMaterialsSearch(results);
  };

  // const handleDelete = (id) => {
  //   deleteMaterialByIdService(id)
  //     .then(() => {
  //       // ลบ item ที่มี id ตรงกันออกจาก materials โดยใช้ filter
  //       setMaterials(prevMaterials => prevMaterials.filter(material => material.material_id !== id))
  //     })
  //     .catch(err => console.log(err))
  // }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>วัตถุดิบ</h2>
        <Link to="/material/create" className="btn btn-success d-none d-md-inline-block"><i className="bi bi-plus-circle-fill"></i> เพิ่มวัตถุดิบ </Link>
        <Link to="/material/create" className="btn btn-success btn-sm d-md-none"><i className="bi bi-plus-circle-fill"></i> เพิ่มวัตถุดิบ </Link>
      </div>
      <Search 
        data = {materials}
        handleSearch = {handleSearch}
        name = "ชื่อวัตถุดิบ"
        itemKeys = "material_name"
      />
      <p>จำนวน {materialsSearch.length} รายการ</p>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{ width: '15%' }}>รูปภาพ</th>
              <th style={{ width: '25%' }}>ชื่อวัตถุดิบ</th>
              <th style={{ width: '10%' }}>ปริมาณ</th>
              <th style={{ width: '10%' }}>ต้นทุน</th>
              <th style={{ width: '10%' }}>ต้นทุน/ปริมาณ</th>
              <th style={{ width: '15%' }}>วันที่สร้าง</th>
              <th style={{ width: '5%' }}>ดู</th>
              <th style={{ width: '5%' }}>แก้ไข</th>
              {/* <th style={{ width: '5%' }}>ลบ</th> */}
            </tr>
          </thead>
          <tbody>
            {materialsSearch.map((material) => (
              <tr key={material.material_id}>
                <td><img src={API_URL_PICTURE + material.materialpic_name} className="img-fluid rounded" alt={material.material_name} style={{ maxHeight: '75px', maxWidth: '120px' }}/></td>
                <td>{material.material_name}</td>
                <td>{material.quantity} กรัม</td>
                <td>{material.cost} บาท</td>
                <td>{material.cost_per_quantity} บาท</td>
                <td>{formatDate(material.created_at)}</td>
                <td><Link to={`view/${material.material_id}`} className="btn btn-info text-light d-grid mx-auto"><i className="bi bi-eye"></i></Link></td>
                <td><Link to={`edit/${material.material_id}`} className="btn btn-warning d-grid mx-auto"><i className="bi bi-pencil"></i></Link></td>
                {/* <td><button onClick={() => handleDelete(material.material_id)} className="btn btn-danger d-grid mx-auto"><i className="bi bi-trash"></i></button></td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-block d-md-none pb-4">
        <div className="row gy-4">
          <div className="px-3 card-body">
            {materialsSearch.map((material) => (
              <div className="col-12 border rounded p-3 shadow-sm bg-light" key={material.material_id}>
                <div className="d-flex">
                  <img src={API_URL_PICTURE + material.materialpic_name} className="img-fluid rounded" alt={material.material_name} style={{ maxHeight: '75px', maxWidth: '120px' }}/>
                  <div className="ms-3 d-flex flex-column justify-content-between w-100">
                    <h6 className="mb-3">{material.material_name}</h6>
                    <div>
                      <Link to={`view/${material.material_id}`} className="btn btn-info btn-sm text-light"><i className="bi bi-eye"></i> ดู </Link>
                    </div>
                  </div>
                </div>
                <div className="small text-secondary mt-3">
                  <p className="mb-1">ปริมาณ: {material.quantity} กรัม</p>
                  <p className="mb-1">ต้นทุน: {material.cost} บาท</p>
                  <p className="mb-1">ต้นทุน/ปริมาณ: {material.cost_per_quantity} บาท</p>
                  <p className="mb-1">วันที่สร้าง: {formatDate(material.created_at)}</p>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <button onClick={() => handleDelete(material.material_id)} className="btn btn-danger btn-sm"><i className="bi bi-trash"></i> ลบ </button>
                  <Link to={`edit/${material.material_id}`} className="btn btn-warning btn-sm"><i className="bi bi-pencil"></i> แก้ไข </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
  );
};

export default ListMaterial;
