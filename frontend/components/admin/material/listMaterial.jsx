import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { listMaterialService } from '../../../API/materialService';
import { formatDate } from '../../datetime';

const ListMaterial = () => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {

    const getPosts = async () => {
      try {
        const res = await listMaterialService()
        console.log(res.data);
        
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    getPosts();
  }, []);

  return (
    <div className="container mt-5">
      <div className="col-12">
        <Link className="btn btn-primary nav-link active" to="/material/create">เพิ่มวัตถุดิบ</Link>
      </div>

      <p>จำนวน {posts.length} รายการ</p>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">รูปปลากรอบ</th>
            <th scope="col">ชื่อวัตถุดิบ</th>
            <th scope="col">จำนวน</th>
            <th scope="col">ต้นทุน</th>
            <th scope="col">วันที่สร้าง</th>
          </tr>
        </thead>
        <tbody>
          
          {posts.map((posts, index) => (
              <tr key={index}>
                <td><img src={"http://localhost:5000/picture/" + posts.materialpic_name} height={75} width={120} className='text-center'/></td>
                <td>{posts.material_name}</td>
                <td>{posts.quantity}</td>
                <td>{posts.cost}</td>
                <td>{formatDate(posts.create_at)}</td>
            </tr>
          ) )}
        </tbody>
      </table>
    </div>
  );
};

export default ListMaterial;
