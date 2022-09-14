import './App.css';
import { Outlet } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import { Header } from './routes/components/header';

function App() {
  return (
    <div className="App" style={{ paddingTop: "3rem"}}>
      <Container>
        <Header />
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
