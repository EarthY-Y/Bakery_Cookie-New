import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../API/signUpService';
import { createCustomer } from '../../../API/signUpService';
import ErrorPopup from '../../untils/popUp/errorPopup';
import LoadingPopup from '../../untils/popUp/loading';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup2 = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [patternPass, setPatternPass] = useState(true);
  const [errPatternPass, setErrPatternPass] = useState("");
  const [confPass, setConfPass] = useState(true);
  const [errConfPass, setErrConfPass] = useState("");
  const [showButtonSubmit, setShowButtonSubmit] = useState(Boolean);

  const { formData, setFormData } = useContext(FormContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trimStart() });
  };

  useEffect(() => {
    const phone_number = formData.phone_number;
    const l_name = formData.l_name;
    const f_name = formData.f_name;

    if (phone_number.length !== 10 && l_name.length <= 0 && f_name.length <= 0) {
      navigate('/signup');
    }

  },[])

  useEffect(() => {
    /*ถอด pattern Regex 
    (? 0 หรือ 1 ตัว = .ตัวใดก็ได้ใน A-Z  *มากกว่า 0 ตัว) ประมาณว่า A-Z ตัวใดก็ได้มากกว่า 1 ตัว 
    ตัวเลขใดก็ได้อย่างน้อย 1 ตัว
    ตัวอักษรพิเศษตัวใดก็ได้ใน [..] หรือก็คือ !@#$%^&*()_+={}\[\]:;"'<>,.?/\\|- อย่างน้อย 1 ตัว
    .{6,} และต้องไม่น้อยกว่า 6 ตัว 
    */
    // const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|-]).{6,}$/;
    // if (!passwordRegex.test(formData.password)) { //.test คือ เมธอด (method) ของ Regular Expression (RegExp) ใน JavaScript ทดสอบว่า ข้อความที่เราตรวจสอบ ตรงกับ เงื่อนไขของ regex หรือเปล่า
    //   setError("รหัสผ่านต้องมีตัวพิมพ์ใหญ่ 1 ตัว, ตัวเลข 1 ตัว, อักษรพิเศษ 1 ตัว และมีความยาวไม่น้อยกว่า 6 ตัว");
    //   setIsLoading(false);
    //   return;
    // }

    const password = formData.password;
    const confPassword = formData.confPassword;
    let confPassMatchPassword = false;
    setShowButtonSubmit(false);

    if(password.length > 0) {
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|-]/.test(password);
      const noSpecialChar = /['"]/.test(password);
      const isLongEnough = password.length >= 6;

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
      if(confPassword.length > 0){
        if (password !== confPassword) {
          setConfPass(false);
          setErrConfPass("รหัสผ่านไม่ตรงกัน");
        } else {
          setConfPass(true);
          confPassMatchPassword = true;
          setErrConfPass("");
        }
      }if(confPassMatchPassword && hasUppercase && hasNumber && hasSpecialChar && !noSpecialChar && isLongEnough){
        setShowButtonSubmit(true);
      }
    }

  },[formData.confPassword, formData.password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);


    try {
      const response = await createCustomer(formData);
      console.log('Form Submitted:', response);
      if (response.data.status === "success") {
        console.log(response.data.message);
        navigate('/Login');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log('Error submitting form:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="px-5 card-body">
              <h3 className="mb-4 card-title text-center">ข้อมูลบัญชีผู้ใช้</h3>
              <form onSubmit={handleSubmit} encType="multipart/form-data">

                <div className="row mb-4 position-relative">
                  <label htmlFor="user" className="col-3 col-auto col-form-label">ชื่อผู้ใช้</label>
                  <div className="col-8">
                    <input name="username" type="text" minLength={5} onChange={handleChange} value={formData.username} required className="form-control" id="user" placeholder="ชื่อผู้ใช้" />
                  </div>
                </div>

                <div className="row mb-4">
                  <label htmlFor="password" className="col-3 col-auto col-form-label">รหัสผ่าน</label>
                  <div className="col-8">
                    <div className="input-group">
                      <input 
                        name="password" 
                        type={showPassword ? "text" : "password"}
                        onChange={handleChange} 
                        value={formData.password} 
                        required 
                        className="form-control" 
                        id="password" 
                        placeholder="รหัสผ่าน"
                      />
                      <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? < FaEye/> : <FaEyeSlash />}
                      </span>
                    </div>
                    {!patternPass && (
                      <div className="text-danger text-end" style={{ whiteSpace: 'pre-line' }}>{errPatternPass}</div>
                    )}
                  </div>
                </div>

                <div className="row mb-4">
                  <label htmlFor="confirmPassword" className="col-3 col-auto col-form-label">ยืนยันรหัสผ่าน</label>
                  <div className="col-8">
                    <div className="input-group">
                      <input 
                        name="confPassword" 
                        type={showConfPassword ? "text" : "password"}
                        onChange={handleChange} 
                        value={formData.confPassword} 
                        required 
                        className="form-control" 
                        id="confirmPassword" 
                        placeholder="ยืนยันรหัสผ่าน"
                      />
                      <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => setShowConfPassword(!showConfPassword)}>
                        {showConfPassword ? < FaEye/> : <FaEyeSlash />}
                      </span>
                    </div>
                    {!confPass && (
                      <div className="text-danger text-end" style={{ whiteSpace: 'pre-line' }}>{errConfPass}</div>
                    )}
                  </div>
                </div>

                <div className="mb-4 row justify-content-center">
                  <div className="col-5">
                    <Link to="/signup">
                      <button style={{ backgroundColor: '#F2EEB0' }} type="back" className="btn btn-outline-dark w-100">ย้อนกลับ</button>
                    </Link>
                  </div>
                  <div className="col-5">
                    <button style={{ backgroundColor: '#C1F2B0' }} type="submit" disabled={!showButtonSubmit} className="btn btn-outline-dark w-100">ยืนยัน (2/2)</button>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <p className="small">มีบัญชีอยู่แล้ว ? <Link to="/Login">เข้าสู่ระบบ</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorPopup message={error} text="เข้าสู่ระบบล้มเหลว" onClose={() => setError(null)} />}
      <LoadingPopup isLoading={isLoading} />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
  );
};

export default Signup2;
