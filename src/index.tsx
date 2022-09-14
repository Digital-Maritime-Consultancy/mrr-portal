import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MrnTreeComponent from './routes/mrnTree';
import LookupComponent from './routes/lookup';
import ResourceRegistration from './routes/components/resourceRegistration';
import NamespaceRegistration from './routes/components/namespaceRegistration';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './auth/mrrKeycloak';
import PrivateRoute from './routes/protectedRoute';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <div>
    <>
            {console.log(keycloak)}</>
    <ReactKeycloakProvider authClient={keycloak}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} >
            <Route path="" element={<LookupComponent />} />
            <Route path="register/resource/:namespace" element={<PrivateRoute><ResourceRegistration /></PrivateRoute>}/>
            <Route path="register/namespace/:namespace" element={<PrivateRoute><NamespaceRegistration /></PrivateRoute>}/>
            <Route path="treeView" element={<MrnTreeComponent />} />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReactKeycloakProvider>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
