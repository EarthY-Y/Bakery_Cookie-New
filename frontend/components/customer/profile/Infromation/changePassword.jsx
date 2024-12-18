import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import liff from "@line/liff";
import { changePasswordService } from "../../../../API/customer/customerService";
import LoadingPopup from "../../../untils/popUp/loading";
import ErrorPopup from "../../../error/errorPopup";

const changePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
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
  return (
    <div className="p-4">
      <h4>เปลี่ยนรหัสผ่าน</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">รหัสผ่านใหม่</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">ยืนยันรหัสผ่านใหม่</label>
          <input
            type="password"
            className="form-control"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
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
