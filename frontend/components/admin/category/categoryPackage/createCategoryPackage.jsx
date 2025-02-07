import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createCategoryPackageService, getListPackageService } from '../../../../API/admin/categoryPackageService';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../untils/frommatters/datetime';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const CreateCategoryPackge = () => {
  const [categoryName, setCategoryName] = useState("");
  const [listPackage, setListPackage] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const selectedPackagesMap = selectedPackages.map(packageId => {
        // หาข้อมูลของสินค้าโดยใช้ PackageId
        const packages = listPackage.find(item => item.package_id === packageId);
        return {
          package_id: packages.package_id,
          // Package_name: Package.Package_name
        }
      })
      console.log(categoryName,selectedPackagesMap);      
      const res = await createCategoryPackageService(categoryName,selectedPackagesMap);
      navigate(-1);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const getlistPackage = async() => {
      try {
        const response = await getListPackageService()
        console.log(response.data);
        setListPackage(response.data)
      } catch (error) {
        
      }
    }
    getlistPackage()
  },[])
  
  return (
    <div className="container mt-5 p-3">
      <div className="mb-4 card col-md-12 px-40 bg-light card-body">
        <h4>เพิ่มประเภทบรรจุภัณฑ์</h4>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อประเภทบรรจุภัณฑ์</label>
            <div className="row col-sm-4">
              <input type="text" className="form-control" required placeholder="เช่น ซองใส่คุกกี้ s, ซองใส่คุกกี้ m" 
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
              <thead>
                <tr className="table-success">
                  <th className="text-center align-middle" style={{ width: '25%' }} >เลือก</th>
                  <th className="text-center align-middle" style={{ width: '25%' }} >รูปบรรจุภัณฑ์</th>
                  <th className="text-center align-middle" style={{ width: '25%' }} >ชื่อบรรจุภัณฑ์</th>
                </tr>
              </thead>
              <tbody>
                {listPackage.map((packages) => (
                  <tr key={packages.package_id}>
                    <td className="text-center align-middle">
                      <input type="checkbox" value={packages.package_id} className='form-check-large' style={{width:'20px', height:'20px'}}
                        onChange={(e) => {
                          const packageId = e.target.value; //เก็บค่าที่มีการเปลี่ยนเเปลง
                          setSelectedPackages(prev => //setSelect 
                              prev.includes(packageId) //ตรวจสอบค่าที่อยู่ใน Array PackageId ปัจจุบันด้วยการใช้ prev
                                  ? prev.filter(id => id !== packageId) //ถ้าถ้าเคยมีเเล้วเพิ่มเข้ามาให้จะลบออก เป็นเหมือนการทำงานของ checkbox
                                  : [...prev, packageId]
                          );
                        }}
                      /></td>
                    <td><img src={API_URL_PICTURE + packages.package_pic } className="img-fluid rounded" alt={packages.package_name} style={{ maxHeight: '75px', maxWidth: '120px' }}/></td>
                    <td>{packages.package_name}</td>
                    {/* <td className="text-center">
                      <Link to={`view/detail/packages/${packages.orders_id}`} className="btn btn-outline-warning text-black">View</Link>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center gap-3 my-4">
            <button className="btn btn-success mt-3 px-4 ms-5" type="submit">เพิ่ม</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryPackge;