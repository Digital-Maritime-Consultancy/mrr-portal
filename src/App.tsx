import './App.css';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <div style={{ padding: "2rem"}}>
        <h1>Maritime Resource Registry Management Portal</h1>
      </div>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="searchView">Search by MRN</Link> |{" "}
        <Link to="treeView">See MRN graph</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
