import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListMaterial = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data: res } = await axios.get("http://localhost:5000/material"); 
        setPosts(res);
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
            <th scope="col">ชื่อวัตถุดิบ</th>
            <th scope="col">จำนวน</th>
            <th scope="col">ต้นทุน</th>
            <th scope="col">วันที่สร้าง</th>
          </tr>
        </thead>
        <tbody>
          
          {posts.map((posts, index) => (
              <tr key={index}>
                <td>{posts.material_name}</td>
                <td>{posts.quantity}</td>
                <td>{posts.cost}</td>
                <td>{new Date(posts.created_at).toISOString().split('T')[0]}</td>
            </tr>
          ) )}
        </tbody>
      </table>
    </div>
  );
};

export default ListMaterial;
