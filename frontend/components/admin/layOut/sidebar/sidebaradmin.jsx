import React from 'react';
import { Accordion, Nav } from 'react-bootstrap';

function Sidebaradmin() {
  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: '280px', height: '1000px' }}>
      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link to="#">สถิติ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link to="#">ประเภทสินค้า</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link to="#">สินค้าหน้าร้าน</Nav.Link>
        </Nav.Item>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>คลังวัตถุดิบ</Accordion.Header>
            <Accordion.Body>
              <Nav.Item>
                <Nav.Link to="#">วัตถุดิบ</Nav.Link>
              </Nav.Item>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Nav.Item>
          <Nav.Link to="#">บรรจุภัณฑ์</Nav.Link>
        </Nav.Item>
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1">
            <Accordion.Header>การสั่งซื้อ</Accordion.Header>
            <Accordion.Body>
              <Nav.Item>
                <Nav.Link to="#">รายการการสั่งซื้อ</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link to="#">ประวัติการสั่งซื้อ</Nav.Link>
              </Nav.Item>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Nav>
    </div>
  );
}

export default Sidebaradmin;