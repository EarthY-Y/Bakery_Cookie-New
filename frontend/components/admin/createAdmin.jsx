import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createAdminService } from '../../API/adminService';

const createAdmin = () => {
  const [firstname, setF_name] = useState("");
  const [lastname, setL_name] = useState("");
  const [UserName, setuserName] = useState("");
  const [password, setpassWord] = useState("");
  const [comPassword, setconfPassword] = useState("");
  const [Picture, setPicture] = useState(null); 
  const [msg, setmsg] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();  // ใช้ formData แทน fromData
      formData.append('userName', UserName);
      formData.append('passWord', password);
      formData.append('confPassword', comPassword);
      formData.append('f_name', firstname); 
      formData.append('l_name', lastname);
      formData.append('file', Picture);
      console.log('file', Picture);
      
      const res = await createAdminService(formData)
      console.log(res);
      navigate('/admin')

    } catch (error) {
      setmsg(error)
      console.log(error);
      
    }

  }

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
        </div>
        <div className="mb-3">
          <label className="form-label">ชื่อจริง</label>
          <input type="text" className="form-control" placeholder="ไม่บอก" 
            value={firstname} 
            onChange={(e) => setF_name(e.target.value)}
            />
        </div>
        <div className="mb-3">
          <label className="form-label">นามสกุลจริง</label>
          <input type="text" className="form-control" placeholder="ไม่บอก" 
            value={lastname} 
            onChange={(e) => setL_name(e.target.value)}
            />
        </div>
        <div className="mb-3">
          <label  className="form-label">ชื่อผู้ใช้</label>
          <input type="text" className="form-control"  placeholder="lnwza007"
            value={UserName} 
            onChange={(e) => setuserName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label  className="form-label">รหัสผ่าน</label>
          <input type="password" className="form-control"  placeholder="pAss@1234"
            value={password} 
            onChange={(e) => setpassWord(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label  className="form-label">ยืนยันรหัสผ่าน</label>
          <input type="password" className="form-control"  placeholder="pAss@1234"
            value={comPassword} 
            onChange={(e) => setconfPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Picture</label>
          <input 
            type="file" 
            className="form-control" 
            id="fileInput" 
            placeholder=".png /.jpeg /.pdf"
            onChange={(e) => setPicture(e.target.files[0])}
          />
        </div>

        <div className="col-12">
          <button className="btn btn-primary" type="submit">Submit</button>
        </div>
        
      </form>
    </div>
  );
};

export default createAdmin;