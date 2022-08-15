import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1>Maritime Resource Registry Portal</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/resources">Resources</Link> |{" "}
        <Link to="/namespaces">Namespaces</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
