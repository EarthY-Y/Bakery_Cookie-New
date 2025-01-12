const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_MANUAL

const steps = [
  {
    title: "1) เลือกสินค้าที่ต้องการสินค้าที่ต้องการ",
    imgName: "step1.png",
  },
  {
    title: "2) เพิ่มจำนวนสินค้าตามที่ต้องการ จากนั้นกด เพิ่มไปยังตะกร้าสินค้า",
    imgName: "step2.png",
  },
  {
    title: "3) กดที่ตะกร้าสินค้า เพื่อเข้าสู่หน้าตะกร้าสินค้า",
    imgName: "step2.5.png",
  },
  {
    title: "4) กดปุ่ม สั่งซื้อ เพื่อสรุปยอดการสั่งซื้อ",
    imgName: "step3.png",
  },
  {
    title: "5) ระบบจะเเจ้งเตือนกรุณาอ่านคำเตือนก่อนกดยืนยัน เพื่อให้เเน่ใจว่าท่านยอมรับกับเงื่อนไขในการสั่งซื้อได้",
    imgName: "step4.png",
  },
  {
    title: "6) กรุณาเพิ่มที่อยู่ก่อนสั่งซื้อ หากมีที่อยู่มากกว่า 1 ที่ ระบบจะให้เลือกที่อยู่ในการจัดส่ง",
    imgName: "step5.png",
  },
  {
    title: "7) อัปโหลดสลิปการชำระเงินตามยอดที่ระบุ จากนั้นอัปโหลดสลิปการชำระเงินเพื่อส่งให้ Admin ตรวจสอบ จากนั้นกด ชำระเงิน",
    imgName: "step6.png",
  },
];

const CategoryProductList = () => {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col text-center mb-4">
          <h2>ขั้นตอนการสั่งซื้อสินค้า</h2>
        </div>
      </div>
      {steps.map((step, index) => (
        <div key={index} className="row align-items-center mb-5">
          <div className="col-md-8 text-center">
            <img
              src={`${API_URL_PICTURE}${step.imgName}`}
              alt={`ขั้นตอนที่ ${index + 1}`}
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-4">
            <h4 className="text-primary">{step.title}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryProductList;

