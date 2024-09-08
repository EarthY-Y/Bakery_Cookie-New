import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const createMaterial = () => {

  const [material_name, setMaterial_name] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:5000/material/create',{material_name, quantity, cost})
    .then(res => {
      navigate('/')
      console.log(res);
    }).catch(err => console.log(err))
  }

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
          <label className="form-label">ชื่อสินค้า</label>
          <input type="text" className="form-control" placeholder="ชื่อสินค้า" 
            value={material_name} 
            onChange={(e) => setMaterial_name(e.target.value)}
            />
        </div>
        <div className="mb-3">
          <label className="form-label">ปริมาณ</label>
          <input type="number" className="form-control" placeholder="กิโล" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)}
            />
        </div>
        <div className="mb-3">
          <label  className="form-label">ต้นทุน</label>
          <input type="number" className="form-control"  placeholder="100 บาท"
            value={cost} 
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
        <div className="col-12">
          <button className="btn btn-primary" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default createMaterial;