import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Link, Outlet } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import Namespace from './routes/namespace';
import Resources from './routes/resources';
import { MaritimeResourceControllerApi, MaritimeResourceDTO } from './generated-client';
import Resource from './routes/resource';

function App() {
  const [mrn, setMrn] = useState("");
  const [resources, setResources] = useState<MaritimeResourceDTO[]>([]);

  useEffect(() => {
    const apiHandler = new MaritimeResourceControllerApi();
    apiHandler.getAllMaritimeResources()
      .then((res: any) => res.data)
      .then((data: MaritimeResourceDTO[]) => setResources(data))
      .catch(e => alert(e));
  }, []);
  
  return (
    <div className="App">
      <h1>Maritime Resource Registry Portal</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
      </nav>
      <Container>
        <Row>
          <Resources resources={resources} onSelect={(mrn) => setMrn(mrn)}/>
        </Row>
        <Row>
          <Col>
            <h1>{mrn}</h1>
          </Col>
          <Col>
            <Namespace mrn={mrn}></Namespace>
          </Col>
          <Col>
            <Resource resources={resources} mrn={mrn}></Resource>
          </Col>
        </Row>
        
      </Container>
    </div>
  );
}

export default App;
