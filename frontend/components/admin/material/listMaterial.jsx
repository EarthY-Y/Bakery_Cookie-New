import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listMaterialService, deleteMaterialByIdService } from '../../../API/materialService'
import { formatDate } from '../../datetime'
import { Table, Button } from 'react-bootstrap'

const ListMaterial = () => {
  const [materials, setMaterials] = useState([])

  useEffect(() => {
    const getMaterials = async () => {
      try {
        const res = await listMaterialService()
        console.log(res.data)
        setMaterials(res.data)
      } catch (err) {
        console.error("Error fetching materials:", err)
      }
    };

    getMaterials()
  }, [])

  const handleDelete = (id) => {
    deleteMaterialByIdService(id)
      .then(() => {
        // ลบ item ที่มี id ตรงกันออกจาก materials โดยใช้ filter
        setMaterials(prevMaterials => prevMaterials.filter(material => material.material_id !== id))
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>วัตถุดิบ</h2>
        <Link to="/material/create" className="btn btn-outline-warning text-black">
          เพิ่มวัตถุดิบ
        </Link>
      </div>

      <p>จำนวน {materials.length} รายการ</p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-center align-middle" style={{ width: '20%' }}>รูปภาพ</th>
            <th className="text-center align-middle" style={{ width: '30%' }}>ชื่อวัตถุดิบ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ปริมาณ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ต้นทุน</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่สร้าง</th>
            <th className="text-center align-middle" style={{ width: '5%' }}>ดู</th>
            <th className="text-center align-middle" style={{ width: '5%' }}>แก้ไข</th>
            <th className="text-center align-middle" style={{ width: '5%' }}>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.material_id}>
              <td><img src={"http://localhost:5000/picture/" + material.materialpic_name} height={75} width={120} alt={material.material_name} /></td>
              <td>{material.material_name}</td>
              <td>{material.quantity} กรัม</td>
              <td>{material.cost}</td>
              <td>{formatDate(material.create_at)}</td>
              <td><Link to={`view/${material.material_id}`} className="btn btn-outline-warning text-black">View</Link></td>
              <td><Link to={`edit/${material.material_id}`} className="btn btn-outline-warning text-black"><i className="bi bi-pencil"></i></Link></td>
              <td><button onClick={() => handleDelete(material.material_id)} className="btn btn-outline-warning btn-danger text-black"><i className="bi bi-trash"></i></button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListMaterial;
