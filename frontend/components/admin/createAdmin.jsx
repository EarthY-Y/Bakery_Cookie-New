import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const createAdmin = () => {

  const [firstname, setF_name] = useState("");
  const [lastname, setL_name] = useState("");
  const [UserName, setuserName] = useState("");
  const [password, setpassWord] = useState("");
  const [comPassword, setconfPassword] = useState("");
  const [msg, setmsg] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('http://localhost:5000/admin/create',{f_name: firstname, l_name: lastname, userName:UserName, passWord: password, confPassword: comPassword})
    .then(res => {
      navigate('/admin')
      console.log(res);
    }).catch(err => console.log(err))
  }

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <p>{msg}</p>
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
        <div className="col-12">
          <button className="btn btn-primary" type="submit">Submit</button>
        </div>
        
      </form>
    </div>
  );
};

export default createAdmin;