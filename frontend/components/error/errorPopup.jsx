// Pop-up Modal Component
export const Modal = ({ messages, onClose }) => {
    message = messages.response.data.msg
    
    return (
      <div style={modalStyles}>
        <div style={modalContentStyles}>
          <h2>เกิดข้อผิดพลาด</h2>
          <p>{message}</p>
          <button onClick={onClose}>ปิด</button>
        </div>
      </div>
    );
  };
  
  // Styles for Modal
  const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  
  const modalContentStyles = {
    background: '#fff',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
  };