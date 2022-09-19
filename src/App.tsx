import './App.css';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import { Header } from './routes/components/header';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { Footer } from './routes/components/footer';
import LookupComponent from './routes/lookup';
import ResourceRegistration from './routes/components/resourceRegistration';
import NamespaceRegistration from './routes/components/namespaceRegistration';
import keycloak from './auth/mrrKeycloak';
import { SubmitResult } from './routes/components/submitResult';
import { useAuth } from './auth/useAuth';
import { useEffect } from 'react';
import { ProtectedRoute } from './routes/components/protectedRoute';

function App() {
  return (
    <div className="App" style={{ paddingTop: "3rem"}}>
      <ReactKeycloakProvider authClient={keycloak} initOptions={{onLoad: 'check-sso', autoRefreshToken: true, checkLoginIframe: true}}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"+process.env.REACT_APP_HOMEPATH} element={
            <Container>
            <Header />
            <Row>
              <Outlet />
            </Row>
            <Footer />
          </Container>
          } >
            <Route path="" element={<LookupComponent />} />
            <Route path="register" element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }>
              <Route path="resource/:namespace" element={<ResourceRegistration />} />
              <Route path="namespace/:namespace" element={<NamespaceRegistration />} />
              <Route path="namespace/:namespace/:creationId" element={<NamespaceRegistration />} />
              <Route path="result/:name" element={<SubmitResult />} />
            </Route>
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
