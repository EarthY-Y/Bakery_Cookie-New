import React from 'react';
import { Accordion, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Sidebaradmin() {
  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: '280px', height: '1000px'}}>
      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link to="#" style={{ color: 'Black' }}>สถิติ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link to="#" style={{ color: 'Black' }}>ประเภทสินค้า</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link to="#" style={{ color: 'Black' }}>สินค้าหน้าร้าน</Nav.Link>
        </Nav.Item>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0" style={{ border: 'none'}}>
            <Accordion.Header>คลังวัตถุดิบ</Accordion.Header>
            <Accordion.Body style={{ backgroundColor: '#f8f9fa' }}>
              <Nav.Item>
                <Nav.Link as={Link} to="/material" style={{ color: 'Black' }}>วัตถุดิบ</Nav.Link>
              </Nav.Item>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Nav.Item>
          <Nav.Link to="#" style={{ color: 'Black' }}>บรรจุภัณฑ์</Nav.Link>
        </Nav.Item>
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1" style={{ border: 'none' }}>
            <Accordion.Header>การสั่งซื้อ</Accordion.Header>
            <Accordion.Body style={{ backgroundColor: '#f8f9fa' }}>
              <Nav.Item>
                <Nav.Link to="#" style={{ color: 'Black' }}>รายการการสั่งซื้อ</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link to="#" style={{ color: 'Black' }}>ประวัติการสั่งซื้อ</Nav.Link>
              </Nav.Item>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Nav>
    </div>
    
  );
}

export default Sidebaradmin;