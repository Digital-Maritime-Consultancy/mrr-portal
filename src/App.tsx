import './App.css';
import { Link, Outlet } from 'react-router-dom';
import { Button, ButtonGroup, Col, Container, Dropdown, Row } from 'react-bootstrap';

function App() {
  const testNamespaces = ["urn", "urn:mrn"];

  return (
    <div className="App" style={{ paddingTop: "3rem"}}>
      <Container>
        <Row>
            <Col xs={1}>
                <ButtonGroup className="d-flex">
                  <Button href={'/'} variant="primary">Home</Button>
                </ButtonGroup>
            </Col>
            <Col xs={10}>
                <h1>Maritime Resource Registry</h1>
            </Col>
            <Col xs={1}>
              <Dropdown className="d-flex">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Add
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {testNamespaces.map((namespace, index) =>
                    <div key={index}>
                      <Dropdown.Header>{namespace}</Dropdown.Header>
                      <Dropdown.Item href={`/register/resource/`+namespace}>Resource</Dropdown.Item>
                      <Dropdown.Item href={`/register/namespace/`+namespace}>Namespace</Dropdown.Item>
                      {index < testNamespaces.length-1 &&
                        <Dropdown.Divider></Dropdown.Divider>
                      }
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
        </Row>
        <Row>

          <Outlet />
        </Row>
      </Container>
      <div style={{ fontSize: "80%", paddingTop: "1rem"}}>
          The development of MRR is a part of the project titled “Development of Open Platform Technologies for Smart Maritime Safety and Industries”<br />funded by the Korea Research Institute of Ships and Ocean Engineering (PES4070).
      </div>
    </div>
  );
}

export default App;
