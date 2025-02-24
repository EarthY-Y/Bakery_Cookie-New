import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategoryOrderStatusService, getListOrderStatusService } from '../../../../API/admin/categoryOrderStatusService';
import LoadingPopup from '../../../untils/popUp/loading';
import ErrorPopup from '../../../untils/popUp/errorPopup';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const CreateCategoryStatusOrder = () => {
  const [categoryName, setCategoryName] = useState("");
  const [listOrderStatus, setListOrderStatus] = useState([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);;
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true)
      const selectedOrderStatusMap = selectedOrderStatus.map(statusOrderId => {
        // หาข้อมูลของสินค้าโดยใช้ PackageId
        const orderStatus = listOrderStatus.find(item => item.status_order_id === statusOrderId);
        return {
          status_order_id: orderStatus.status_order_id,
        }
      })
      console.log(categoryName,selectedOrderStatusMap);      
      const res = await createCategoryOrderStatusService(categoryName,selectedOrderStatusMap);
      if(res){
        setIsLoading(false)
        navigate(-1);
        console.log(res);
      }
    } catch (err) {
      console.log(err);
      setError(err);
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    const getlistPackage = async() => {
      try {
        const response = await getListOrderStatusService()
        console.log(response.data);
        setListOrderStatus(response.data)
      } catch (error) {
        setError(error)
      }finally{
        setIsLoading(false)
      }
    }
    getlistPackage()
  },[])
  
  return (
    <div className="container mt-5 p-3">
      <div className="mb-4 card col-md-12 px-40 bg-light card-body">
        <h4>เพิ่ประเภทมสถานะคำสั่งซ์้อ</h4>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อประเภทสถานะคำสั่งซื้อ</label>
            <div className="row col-sm-4">
              <input type="text" className="form-control" required placeholder="เช่น กำลังดำเนินการ, รอดำเนินการ" 
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
                  <th className="text-center align-middle" style={{ width: '25%' }} >ชื่อสถานะคำสั่งซื้อ</th>
                </tr>
              </thead>
              <tbody>
                {listOrderStatus.map((orderStatus) => (
                  <tr key={orderStatus.status_order_id}>
                    <td className="text-center align-middle">
                      <input type="checkbox" value={orderStatus.status_order_id} className='form-check-large' style={{width:'20px', height:'20px'}}
                        onChange={(e) => {
                          const statusOrderId = e.target.value; //เก็บค่าที่มีการเปลี่ยนเเปลง
                          setSelectedOrderStatus(prev => //setSelect 
                              prev.includes(statusOrderId) //ตรวจสอบค่าที่อยู่ใน Array PackageId ปัจจุบันด้วยการใช้ prev
                                  ? prev.filter(id => id !== statusOrderId) //ถ้าถ้าเคยมีเเล้วเพิ่มเข้ามาให้จะลบออก เป็นเหมือนการทำงานของ checkbox
                                  : [...prev, statusOrderId]
                          );
                        }}
                      /></td>
                    <td>{orderStatus.status_name}</td>
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
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
      
      {error && (
        <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default CreateCategoryStatusOrder;