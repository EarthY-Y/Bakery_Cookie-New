import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { listAdminService } from '../../API/adminService';

const ListAdmin = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data: res } = await listAdminService()
        setPosts(res)
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    getPosts();
  }, []);

  return (
    <div className="container mt-5">
      <div className="col-12">
        <Link className="btn btn-primary nav-link active" to="/admin/create">เพิ่มพนักงาน</Link>
      </div>

      <p>จำนวน {posts.length} รายการ</p>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ชื่อผู้ใช้</th>
            <th scope="col">ชื่อ</th>
            <th scope="col">นามสกุล</th>
            <th scope="col">ตำเเเหน่ง</th>
          </tr>
        </thead>
        <tbody>
          
          {posts.map((posts, index) => (
              <tr key={index}>
                <td>{posts.userName}</td>
                <td>{posts.f_name}</td>
                <td>{posts.l_name}</td>
                <td>{posts.role_function}</td>
            </tr>
          ) )}
        </tbody>
      </table>
    </div>
  );
};

export default ListAdmin;
