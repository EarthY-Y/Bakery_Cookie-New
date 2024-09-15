import React from 'react';

const Login = () => {
  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center">เข้าสู่ระบบ</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">อีเมล</label>
                  <input type="email" className="form-control" id="email" placeholder="อีเมล หรือ เบอร์โทรศัพท์" />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">รหัสผ่าน</label>
                  <input type="password" className="form-control" id="password" placeholder="รหัสผ่าน" />
                  <label ></label>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">เข้าสู่ระบบ</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;