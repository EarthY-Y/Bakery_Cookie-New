const CategoryProductList = () => {
  const steps = [
    {
      title: "1) เลือกสินค้าที่ต้องการสินค้าที่ต้องการ",
      imgSrc: "../../../public/stepBystep/step1.png",
    },
    {
      title: "2) เพิ่มจำนวนสินค้าตามที่ต้องการจากนั้นกด เพิ่มไปยังตะกร้าสินค้า",
      imgSrc: "../../../public/stepBystep/step2.png",
    },
    {
      title: "3) กดที่ไอคอน ตะกร้าสินค้า เพื่อเข้าสู่หน้าตะกร้าสินค้า",
      imgSrc: "../../../public/stepBystep/step2.5.png",
    },
    {
      title: "4) กดปุ่ม สั่งซื้อ เพื่อสรุปยอดการสั่งซื้อ",
      imgSrc: "../../../public/stepBystep/step3.png",
    },
    {
      title: "5) ระบบจะเเจ้งเตือนกรุณาอ่านคำเตือนก่อนกด ยืนยัน เพื่อให้เเน่ใจว่าท่านยอมรับกับเงื่อนไขในการสั่งซื้อได้",
      imgSrc: "../../../public/stepBystep/step4.png",
    },
    {
      title: "6) กรุณาเพิ่มที่อยู่ก่อนสั่งซื้อ หากมีที่อยู่มากกว่า 1 ที่ ระบบจะให้เลือกที่อยู่ในการจัดส่ง",
      imgSrc: "../../../public/stepBystep/step5.png",
    },
    {
      title: "7) อัปโหลดสลิปการชำระเงินตามยอดที่ระบุ จากนั้นอัปโหลดสลิปการชำระเงินเพื่อส่งให้ Admin ตรวจสอบ จากนั้นกด ชำระเงิน",
      imgSrc: "../../../public/stepBystep/step6.png",
    },
  ];

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
            <img src={step.imgSrc} alt={`ขั้นตอนที่ ${index + 1}`} className="img-fluid rounded shadow" />
          </div>
          <div className="col-md-4">
            <h4 className="text-danger">{step.title}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryProductList;
