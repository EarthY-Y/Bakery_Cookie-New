import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const createMaterial = () => {

  const [MaterialName, setMaterial_name] = useState("");
  const [Quantities, setQuantity] = useState("");
  const [Costes, setCost] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('http://localhost:5000/material/create',{material_name: MaterialName, quantity: Quantities, cost:Costes})
    .then(res => {
      navigate('/material')
      console.log(res);
    }).catch(err => console.log(err))
  }

  // const [posts, setPosts] = useState([]);
  // const [selectedOption, setSelectedOption] = useState(''); // To store the selected option
  // useEffect(() => {
  //   const getPosts = async () => {
  //     try {
  //       const { data: res } = await axios.get("http://localhost:5000/admin"); 
  //       setPosts(res);
  //     } catch (err) {
  //       console.error("Error fetching data:", err);
  //     }
  //   };

  //   getPosts();
  // }, []);

  // const handleSelectChange = (e) => {
  //   setSelectedOption(e.target.value);
  // };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">ชื่อสินค้า</label>
          <input type="text" className="form-control" placeholder="ชื่อสินค้า" 
            value={MaterialName} 
            onChange={(e) => setMaterial_name(e.target.value)}
            />
        </div>
        <div className="mb-3">
          <label className="form-label">ปริมาณ</label>
          <input type="number" className="form-control" placeholder="กิโล" 
            value={Quantities} 
            onChange={(e) => setQuantity(e.target.value)}
            />
        </div>
        <div className="mb-3">
          <label  className="form-label">ต้นทุน</label>
          <input type="number" className="form-control"  placeholder="100 บาท"
            value={Costes} 
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
        {/* <label  className="form-label">เลือกชื่อพนักงาน</label>
        <select className="form-select mb-3" aria-label="Default select example" onChange={handleSelectChange} value={selectedOption}>
          <option value="">เลือก admin</option>
          {posts.map((post, index) => (
            <option  key={index} value={post.value}>
              {post.userName} {}
            </option> 
          ))}
        </select> */}
        <div className="col-12">
          <button className="btn btn-primary" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default createMaterial;