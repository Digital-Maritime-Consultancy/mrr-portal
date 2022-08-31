import './App.css';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <div style={{ padding: "2rem"}}>
        <h1>Maritime Resource Registry Portal</h1>
        <p>Search resources by Maritime Resource Name</p>
      </div>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "0rem",
        }}
      >
        {/*
          <Link to="searchView">Search by MRN</Link> |{" "}
          <Link to="treeView">See MRN graph</Link>
          */
        }
        
      </nav>
      <Outlet />
      <div style={{ fontSize: "80%", paddingTop: "1rem"}}>
          The development of MRR is a part of the project titled “Development of Open Platform Technologies for Smart Maritime Safety and Industries”<br />funded by the Korea Research Institute of Ships and Ocean Engineering (PES4070).
      </div>
    </div>
  );
}

export default App;
