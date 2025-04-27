import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import liff from "@line/liff";
import { changePasswordService } from "../../../../API/customer/customerService";
import LoadingPopup from "../../../untils/popUp/loading";
import ErrorPopup from '../../../untils/popUp/errorPopup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const changePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [patternPass, setPatternPass] = useState(true);
  const [errPatternPass, setErrPatternPass] = useState("");
  const [confPass, setConfPass] = useState(true);
  const [errConfPass, setErrConfPass] = useState("");
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await changePasswordService(
        newPassword,
        confirmNewPassword
      );
      if (response) {
        navigate(-1);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      setConfirmNewPassword("");
      setNewPassword("");
    }
  };

   useEffect(() => {
    if(newPassword.length > 0) {
      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      const hasSpecialChar = /[!@#$%^&*()_+={}\[\]:;<>,.?/\\|-]/.test(newPassword);
      const noSpecialChar = /['"]/.test(newPassword);
      const isLongEnough = newPassword.length >= 6;

      let errorMessage = "";

      if (!hasUppercase) errorMessage += "ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว\n";
      if (!hasNumber) errorMessage += "ต้องมีตัวเลขอย่างน้อย 1 ตัว\n";
      if (!hasSpecialChar) errorMessage += "ต้องมีตัวอักษรพิเศษอย่างน้อย 1 ตัว\n";
      if (noSpecialChar) errorMessage += `ใช้ ' และ " เป็นตัวอักษรพิเศษไม่ได้\n`;
      if (!isLongEnough) errorMessage += "ความยาวต้องไม่น้อยกว่า 6 ตัว\n";

      if (errorMessage) {
        setPatternPass(false);
        setErrPatternPass(errorMessage.trim());
      } else {
        setPatternPass(true);
        setErrPatternPass("");
      }
      if(confirmNewPassword.length > 0) {
        if (newPassword !== confirmNewPassword) {
          setConfPass(false);
          setErrConfPass("รหัสผ่านไม่ตรงกัน");
        } else {
          setConfPass(true);
          setErrConfPass("");
        }
      }
    }

  },[confirmNewPassword, newPassword]);
  return (
    <div className="p-4">
      <h4>เปลี่ยนรหัสผ่าน</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">รหัสผ่านใหม่</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? < FaEye/> : <FaEyeSlash />}
            </span>
          </div>
          {!patternPass && (
            <div className="text-danger text-end" style={{ whiteSpace: 'pre-line' }}>{errPatternPass}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">ยืนยันรหัสผ่านใหม่</label>
          <div className="input-group">
            <input
              type={showConfPassword ? "text" : "password"}
              className="form-control"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => setShowConfPassword(!showConfPassword)}>
              {showConfPassword ? < FaEye/> : <FaEyeSlash />}
            </span>
          </div>
          {!confPass && (
            <div className="text-danger text-end" style={{ whiteSpace: 'pre-line' }}>{errConfPass}</div>
          )}
        </div>
        <div className="text-end">
          <button type="submit" className="btn btn-danger col-3">
            บันทึก
          </button>
        </div>
        {error && (
          <ErrorPopup
            message={error}
            text="เชื่อมต่อล้มเหลว"
            onClose={() => setError(null)}
          />
        )}
      </form>
      <LoadingPopup isLoading={isLoading} />
      {isLoading ? (
        <div className="modal-backdrop fade show"></div>
      ) : (
        <div className=""></div>
      )}
    </div>
  );
};

export default changePassword;
