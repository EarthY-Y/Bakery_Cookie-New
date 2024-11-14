import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getAddressCustomer } from '../../../API/customer/paymentService';
import { numberGrouping } from '../../untils/frommatters/numberFormatting';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const cartProduct = () => {
  const [address, setAddress] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const validateAddress = async() => {
      try {
          const response = await getAddressCustomer()
          if(!response.data || response.data.length === 0){
            throw new Error("ไม่มีข้อมูล")
          }
          console.log(response.data);
          setAddress(response.data)
        }
        catch (error) {
          alert("คุณยังไม่ได้กรอกข้อมูลที่อยู่")
          navigate('/create/address')
        }
    }
    validateAddress()
  },[])
  
  return (    
      <div className="container my-5">
      </div>
  );
};

export default cartProduct;