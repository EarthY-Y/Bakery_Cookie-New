import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListAdmin = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data: res } = await axios.get("http://localhost:5000/admin"); 
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
        <a className="btn btn-primary nav-link active" href="/admin/create">เพิ่มวัตถุดิบ</a>
      </div>

      <p>จำนวน {posts.length} รายการ</p>
      <table class="table">
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
              <tr key={posts.userName}>
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
