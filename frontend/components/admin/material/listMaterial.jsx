import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { listMaterialService } from '../../../API/materialService';
import { formatDate } from '../../datetime';
import { Table, Button } from 'react-bootstrap';

const ListMaterial = () => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {

    const getPosts = async () => {
      try {
        const res = await listMaterialService()
        console.log(res.data);
        
        setPosts(res.data);
      } catch (err) {
        console.error("Error data:", err);
      }
    };

    getPosts();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>วัตถุดิบ</h2>
        <Link to="/material/create" className="btn btn-outline-warning text-black">
          เพิ่มวัตถุดิบ
        </Link>
      </div>

      <p>จำนวน {posts.length} รายการ</p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-center align-middle" style={{width: '20%' }}>รูปภาพ</th>
            <th className="text-center align-middle" style={{width: '30%' }}>ชื่อวัตถุดิบ</th>
            <th className="text-center align-middle" style={{width: '10%' }}>ต้นทุน</th>
            <th className="text-center align-middle" style={{width: '10%' }}>จำนวน</th>
            <th className="text-center align-middle" style={{width: '10%' }}>สถานะ</th>
            <th className="text-center align-middle" style={{width: '10%' }}>แก้ไข</th>
            <th className="text-center align-middle" style={{width: '10%' }}>ลบ</th>
          </tr>
        </thead>
      
        <tbody>
          
          {posts.map((posts, index) => (
              <tr key={index}>
                <td className="text-center align-middle"><img src={"http://localhost:3000/picture/" + posts.materialpic_name} height={75} width={120} className='text-center'/></td>
                <td className="text-center align-middle">{posts.material_name}</td>
                <td className="text-center align-middle">{posts.quantity}</td>
                <td className="text-center align-middle">{posts.cost}</td>
                <td className="text-center align-middle">{formatDate(posts.create_at)}</td>
            </tr>
          ) )}
        </tbody>
      </Table>
    </div>
  );
};

export default ListMaterial;
