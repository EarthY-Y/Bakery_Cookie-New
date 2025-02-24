import React, { useEffect, useState} from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { updateCategoryOrderStatusService, getCategoryOrderStatusByIdService } from '../../../../API/admin/categoryOrderStatusService';
import { getStatusOrderListService } from '../../../../API/admin/ordersService';
import { formatDate } from '../../../untils/frommatters/datetime';
import LoadingPopup from '../../../untils/popUp/loading';
import ErrorPopup from '../../../untils/popUp/errorPopup';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const EditCategoryStatusOrder = () => {
  const {id} = useParams()
  const [categoryName, setCategoryName] = useState("");
  const [listOrderStatus, setListOrderStatus] = useState([]);
  const [listCategoryOrderStatus, setListCategoryOrderStatus] = useState([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);;
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    const initialSelected = listCategoryOrderStatus.map((item) => item.status_order_id);
    const addedOrderStatuss = selectedOrderStatus.filter((id) => !initialSelected.includes(id));
    const removedOrderStatuss = initialSelected.filter((id) => !selectedOrderStatus.includes(id));
    const isNameChanged = categoryName !== listCategoryOrderStatus[0]?.category_name;
    const hasChanges = isNameChanged || addedOrderStatuss.length > 0 || removedOrderStatuss.length > 0;
    if (!hasChanges) {
      console.log("ไม่มีการเปลี่ยนแปลง ไม่จำเป็นต้องส่งข้อมูล");
      return;
    }
    try {
      const changes = {
        ...(isNameChanged && { category_name: categoryName }),
        added: addedOrderStatuss.map((id) => ({ status_order_id: id })),
        removed: removedOrderStatuss.map((id) => ({ status_order_id: id })),
      };
      console.log('การเปลี่ยนแปลง:', changes);
      const res = await updateCategoryOrderStatusService(id, changes);
      if(res){
        setIsLoading(false)
        navigate(-1);
      }
    } catch (err) {
      console.error('Error:', err);
    }finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // ตั้งค่า loading ก่อนเริ่ม
      try {
        const [
          getStatusOrderList,
          getCategoryOrderStatusById,
        ] = await Promise.all([
          getStatusOrderListService(),
          getCategoryOrderStatusByIdService(id),
        ]);

        console.log(getStatusOrderList.data);
        console.log(getCategoryOrderStatusById.data);
      
        const categoryOrderStatusData = getCategoryOrderStatusById.data || [];
        const statusOrderData = getStatusOrderList.data || [];
  
        // ตั้งค่าชื่อหมวดหมู่
        setListCategoryOrderStatus(categoryOrderStatusData);
        setCategoryName(categoryOrderStatusData[0]?.category_status_order_name || '');
  
        // กรอง status_order_id ที่ต้องการ
        const filterListOrderStatus = statusOrderData.filter((item) => //filter เพื่อกรองข้อมูล map เพื่อเลือกเอาข้อมูลเฉพาะ Key
          categoryOrderStatusData.some((orderStatusItem) => orderStatusItem.status_order_id === item.status_order_id || item.category_status_order_id == null) //some ทำหน้าที่เหมือน Where
        );
        setListOrderStatus(filterListOrderStatus);
  
        // Map status_order_id สำหรับการเลือกเบื้องต้น
        const initialSelected = categoryOrderStatusData.map((item) => item.status_order_id);
        setSelectedOrderStatus(initialSelected);
  
      } catch (error) {
        setError(error); // ตั้งค่า error
      } finally {
        setIsLoading(false); // ปิด loading
      }
    };
  
    fetchData();
  }, [id]); // เพิ่ม id เป็น dependency
  
  return (
    <div className="container mt-5 p-3">
      <div className="mb-4 card col-md-12 px-40 bg-light card-body">
        <h4>แก้ไขสถานะคำสั่งซื้อ</h4>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อประเภทสถานะคำสั่งซื้อ</label>
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
                  <th className="text-center align-middle" style={{ width: '25%' }} >ชื่อประเภทสถานะคำสั่งซื้อ</th>
                </tr>
              </thead>
              <tbody>
                {listOrderStatus.map((orderStatus) => (
                  <tr key={orderStatus.status_order_id}>
                    <td className="text-center align-middle">
                      <input type="checkbox" value={orderStatus.status_order_id} className='form-check-large' style={{width:'20px', height:'20px'}}
                        onChange={(e) => {
                          const categoryStatusOrderId = e.target.value; //เก็บค่าที่มีการเปลี่ยนเเปลง
                          setSelectedOrderStatus(prev => //setSelect 
                              prev.includes(categoryStatusOrderId) //ตรวจสอบค่าที่อยู่ใน Array productId ปัจจุบันด้วยการใช้ prev
                                  ? prev.filter(id => id !== categoryStatusOrderId) //ถ้าถ้าเคยมีเเล้วเพิ่มเข้ามาให้จะลบออก เป็นเหมือนการทำงานของ checkbox
                                  : [...prev, categoryStatusOrderId]
                          );
                        }}
                        checked={selectedOrderStatus.includes(orderStatus.status_order_id)} //ตรวยสอบค่า ถ้ามี id นี้จะ check
                      /></td>
                    <td>{orderStatus.status_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center gap-3 my-4">
            <button className="btn btn-success mt-3 px-4 ms-5" type="submit">บันทึก</button>
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

export default EditCategoryStatusOrder;