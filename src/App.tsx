import './App.css';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import { Header } from './routes/components/header';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { Footer } from './routes/components/footer';
import LookupComponent from './routes/lookup';
import ResourceRegistration from './routes/components/resourceRegistration';
import NamespaceRegistration from './routes/components/namespaceRegistration';
import MrnTreeComponent from './routes/mrnTree';
import keycloak from './auth/mrrKeycloak';

function App() {
  return (
    <div className="App" style={{ paddingTop: "3rem"}}>
      <ReactKeycloakProvider authClient={keycloak} initOptions={{onLoad: 'check-sso'}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Container>
            <Header />
            <Row>
              <Outlet />
            </Row>
            <Footer />
          </Container>
          } >
            <Route path="" element={<LookupComponent />} />
            <Route path="register" element={<div><Outlet /></div>}>
              <Route path="resource/:namespace" element={<ResourceRegistration />} />
              <Route path="namespace/:namespace" element={<NamespaceRegistration />} />
            </Route>
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
}

export default App;
