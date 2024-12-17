import React, { useEffect, useState} from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { updateCategoryPackageService, getListPackageService, getCategoryPackageByIdService } from '../../../../API/admin/categoryPackageService';
import { formatDate } from '../../../untils/frommatters/datetime';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_PACKAGE

const EditCategoryPackage = () => {
  const {id} = useParams()
  const [categoryName, setCategoryName] = useState("");
  const [listPackage, setListPackage] = useState([]);
  const [listCategoryPackage, setListCategoryPackage] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const initialSelected = listCategoryPackage.map((item) => item.package_id);
    const addedPackages = selectedPackages.filter((id) => !initialSelected.includes(id));
    const removedPackages = initialSelected.filter((id) => !selectedPackages.includes(id));
    const isNameChanged = categoryName !== listCategoryPackage[0]?.category_name;
    const hasChanges = isNameChanged || addedPackages.length > 0 || removedPackages.length > 0;
    if (!hasChanges) {
      console.log("ไม่มีการเปลี่ยนแปลง ไม่จำเป็นต้องส่งข้อมูล");
      return;
    }
    try {
      const changes = {
        ...(isNameChanged && { category_name: categoryName }),
        added: addedPackages.map((id) => ({ package_id: id })),
        removed: removedPackages.map((id) => ({ package_id: id })),
      };
      console.log('การเปลี่ยนแปลง:', changes);
      const res = await updateCategoryPackageService(id, changes);
      navigate(-1);
    } catch (err) {
      console.error('Error:', err);
    }
  };
  
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

  useEffect(() => {
    const getCategoryById = async() => {
      try {
        const response = await getCategoryPackageByIdService(id)
        console.log(response.data);
        setListCategoryPackage(response.data)
        setCategoryName(response.data[0]?.package_category_name || '')
        const initialSelected = response.data.map((item) => item.package_id); //map เอาเเค่ package_id
        setSelectedPackages(initialSelected);
      } catch (error) {
        
      }
    }
    getCategoryById()
  },[])
  
  return (
    <div className="container mt-5 p-3">
      <button className="btn btn-outline-secondary mb-4" onClick={() => {navigate(-1)}}>
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </button>
      <div className="mb-4 card col-md-12 px-40 bg-light card-body">
        <h4>แก้ไขสถานะ</h4>
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
                              prev.includes(packageId) //ตรวจสอบค่าที่อยู่ใน Array productId ปัจจุบันด้วยการใช้ prev
                                  ? prev.filter(id => id !== packageId) //ถ้าถ้าเคยมีเเล้วเพิ่มเข้ามาให้จะลบออก เป็นเหมือนการทำงานของ checkbox
                                  : [...prev, packageId]
                          );
                        }}
                        checked={selectedPackages.includes(packages.package_id)} //ตรวยสอบค่า ถ้ามี id นี้จะ check
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
            <button className="btn btn-secondary mt-3 px-4 me-5" type="button">ล้าง</button>
            <button className="btn btn-success mt-3 px-4 ms-5" type="submit">บันทึก</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryPackage;