import React, { useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateAddressCustomer, getOrderAddress, updatePaymentOrder, getOrdersService } from '../../../API/customer/paymentService';
import { numberGrouping } from '../../untils/frommatters/numberFormatting';
import LoadingPopup from '../../untils/popUp/loading';
import ErrorPopup from '../../untils/popUp/errorPopup';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const cartProduct = () => {
  const id = useParams().id //เพราะว่ามันส่งมาจาก navigate ของหน้า orders เลยมาเป็น object ทำให้เกิดปัญหากับหลังบ้านเลยต้อง .id ในกรณีที่ไม่ใส่ {id}
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState([])
  const [productOrder, setProductOrder] = useState([])
  const [totalPriceProduct, setTotalPriceProduct] = useState(0); 
  const [totalPrice, setTotalPrice] = useState(0); 
  const [Picture, setPicture] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // await new Promise((resolve) => setTimeout(resolve, 3000)); //ถ้าอยากลองดูหน้า loading
        // โหลดข้อมูลพร้อมกันเพื่อลดปัญหาการโหลดข้อมูลไม่ทัน
        const [
          orders,
          addressCustomer,
        ] = await Promise.all([
          getOrdersService(id),
          getOrderAddress(id),

        ]);
        if(orders){
          console.log(orders.data[0]);
          setProductOrder(orders.data[0])
          setTotalPriceProduct(orders.data[0].price)
        }else{
          navigate(-1)
        }
        if(addressCustomer){
          setAddress(addressCustomer.data[0])
        }else{
          navigate(-1)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(error.message);
      }finally {
        setIsLoading(false);
      }
    };
    fetchData();

  }, []); 
  
  // 
  useEffect(() => {
    const total = (totalPriceProduct || 0 )+ (productOrder.cost_shipping || 0) + (productOrder.cost_package || 0)/* อนาคตต้องทำคำนวนต้นทุนค่าส่ง */;
    setTotalPrice(total);
  }, [productOrder]);

  const handleSubmmit = async(event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();  
      formData.append('file', Picture);
      formData.append('totalPrice', totalPrice);
      const response = await updatePaymentOrder(formData, id)
      console.log(response);
      if(response.data){
        navigate("/home")
      }else {
        throw new Error("เกิดข้อผิดพลาดบ้างอย่าง")
      }
    } catch (error) {
      console.log(error);
      setError(error)
    }finally{
      setIsLoading(false);
    }
  }
  
  return (
    <form className="container my-5" onSubmit={handleSubmmit}>
      <div className="px-3 card-body">
        <div className="row bg-light p-3 border rounded mb-4">
          <h2 className="mb-2 text-center">ชำระเงิน</h2>
          <hr className="my-4 border-secondary" />
          <h3>ที่อยู่ที่ใช้ในการจัดส่ง</h3>
          <p>
            <strong>
              {address.f_name} {address.l_name} | โทร: {address.phone_number}
            </strong>
            <br />
            {address.house_no} ตำบล {address.tambon_name} อำเภอ {address.amphure_name} จังหวัด {address.province_name} {address.zip_code}
          </p>
        </div>
        <div className="row flex-column align-items-center p-3 border rounded bg-light mt-3">
          <div className="col-12 col-md-6 text-center justify-content-center p-3">
            <div>
              <h3>ช่องทางการชำระเงิน</h3>
              <div>
                <h5>พร้อมเพย์: <strong>0891175751</strong></h5>
                <h5><strong>นางสาาว รุ่งรวีกาณ บุญเอี่ยม</strong></h5>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-4">
              <div className="w-100 p-4 border rounded bg-white">
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <strong className="text-uppercase">ราคารวมสินค้า</strong>
                    <span>{numberGrouping(totalPriceProduct)} ฿</span>
                  </div>
                  <hr className="my-4" style={{ borderTop: '2px dashed grey' }} />
                  <div className="d-flex justify-content-between">
                    <strong className="text-uppercase">ราคาส่ง</strong>
                    <span>{numberGrouping(parseInt(productOrder.cost_shipping || 0))} ฿</span>
                  </div>
                  <hr className="my-4" style={{ borderTop: '2px dashed grey' }} />
                  <div className="d-flex justify-content-between">
                    <strong className="text-uppercase">ราคากล่อง</strong>
                    <span>{numberGrouping(parseInt(productOrder.cost_package || 0))} ฿</span>
                  </div>
                  <hr className="my-4" style={{ borderTop: '2px dashed grey' }} />
                  <div className="d-flex justify-content-between">
                    <strong className="text-uppercase text-danger">ราคารวม</strong>
                    <span className="text-danger">{numberGrouping(totalPrice)} ฿</span>
                  </div>
                  <hr className="my-4" style={{ borderTop: '2px dashed red' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="position-relative mb-4 bg-white" style={{ margin: '2%', width: '300px', height: '300px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Picture ? (
              <img src={URL.createObjectURL(Picture)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>เพิ่มรูปยืนยันการโอนเงิน</span>
            )}
            <input 
              type="file" 
              className="position-absolute top-0 start-0 w-100 h-100" 
              style={{ opacity: 0, cursor: 'pointer' }} 
              onChange={(e) => setPicture(e.target.files[0])} 
            />
          </div>
        </div>
        <div className="d-flex flex-row-reverse bd-highlight mt-4">
          <button type='submit' className="btn btn-success btn-lg" disabled={!Picture}>ชำระเงิน</button>
        </div>
      </div>
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
      {error && (
        <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />
      )}
    </form>
  );
};

export default cartProduct;