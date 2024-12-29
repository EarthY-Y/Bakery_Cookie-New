import React, { useState } from 'react';

const SelectAddress = ({ showModal, handleClose, data, handleSelect }) => {
  const [selectedAddress, setSelectedAddress] = useState(null); 

  const handleSubmit = () => {
    handleSelect(selectedAddress);
    handleClose(); 
  };


  return (
    <div className={`modal fade ${showModal ? "show" : ""}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} aria-labelledby="cancelOrderModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header justify-content-between">
                <h5 className="modal-title">เลือกที่อยู่</h5>
                <button type="button" className="close" onClick={() => handleClose(false)} >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* แสดงรายการที่อยู่ */}
                {data.map((item, index) => (
                  <div key={index} className="form-check">
                    <input className="form-check-input" type="radio" name="address" id={`address-${index}`} onChange={() => setSelectedAddress(item)}/>
                    <label className="form-check-label" htmlFor={`address-${index}`} >
                      <strong>
                        {item.f_name} {item.l_name} | โทร: {item.phone_number}
                      </strong>
                      <br />
                      {item.houseNo} ตำบล {item.tambon_nameTH} อำเภอ{" "}
                      {item.amphure_nameTH} จังหวัด {item.province_nameTH}{" "}
                      {item.zip_code}
                    </label>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose} >ปิด</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  ยืนยัน
                </button>
              </div>
            </div>
        </div>
    </div>
  );
};

export default SelectAddress;
