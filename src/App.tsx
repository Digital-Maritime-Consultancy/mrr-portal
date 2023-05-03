import './App.css';
import { Container, Row } from 'react-bootstrap';
import { Header } from './routes/components/header';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { Footer } from './routes/components/footer';
import LookupComponent from './routes/lookup';
import keycloak from './auth/mrrKeycloak';
import { SubmitResult } from './routes/components/submitResult';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from './routes/components/protectedRoute';
import { NamespaceRegistration } from './routes/components/namespaceRegistration';
import { ResourceRegistration } from './routes/components/resourceRegistration';
import { useSearchParams } from 'react-router-dom';

export enum Mode{
  LOOKUP = 0,
  REGISTER_RESOURCE,
  REGISTER_NAMESPACE,
  SHOW_RESULT,
}

export interface IContext {
  mode: Mode;
  namespace?: string;
  mrn?: string;
  version?: string;
  creationId?: string;
}

function App() {
  const [context, setContext] = useState<IContext>({mode: Mode.LOOKUP, namespace: "", mrn: ""});
  const [searchParams, setSearchParams ] = useSearchParams();
  const [mrn, setMrn] = useState("");

  useEffect( () => {
    // fetching search parameters from URL
    if (searchParams.get("mrn")) {
      setMrn(searchParams.get("mrn")!);
    }
  }, []);

  return (
    <div className="App" style={{ paddingTop: "3rem"}}>
      <ReactKeycloakProvider authClient={keycloak} initOptions={{onLoad: 'check-sso', autoRefreshToken: true, checkLoginIframe: true}}>
      <Container>
        <Header context={context} setContext={setContext}/>
        <Row>
          {
            context.mode === Mode.LOOKUP ?
            <LookupComponent givenMrn={mrn}/> :
            context.mode === Mode.REGISTER_RESOURCE ?
            <ProtectedRoute><ResourceRegistration context={context} setContext={setContext}/></ProtectedRoute> :
            context.mode === Mode.REGISTER_NAMESPACE ?
            <ProtectedRoute><NamespaceRegistration context={context} setContext={setContext}/></ProtectedRoute> : 
            context.mode === Mode.SHOW_RESULT ?
            <SubmitResult context={context} setContext={setContext} /> :
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        </Row>
        <Footer />
      </Container>
    </ReactKeycloakProvider>
    </div>
  );
}

export default App;
