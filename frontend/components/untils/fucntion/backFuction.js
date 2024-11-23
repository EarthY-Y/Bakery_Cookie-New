import { useNavigate } from 'react-router-dom';

export const goBackOrHome = (navigate) => {
    if (window.history.length > 1) {
      navigate(-1); // กลับหน้าก่อนหน้า
    } else {
      navigate('/home'); // หรือเปลี่ยนไปหน้าอื่น
    }
  };
  