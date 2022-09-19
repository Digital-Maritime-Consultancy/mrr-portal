import { useEffect } from "react";
import { Button, ButtonGroup, Col, Dropdown, Row } from "react-bootstrap";
import keycloak from "../../auth/mrrKeycloak";
import { useAuth } from "../../auth/useAuth";

export const Header = () => {
  const { token, initialized: authInitialized } = useAuth();
  

    return (
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
              <Dropdown align="end" className="d-flex">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Add
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {!keycloak.authenticated && <Dropdown.Item onClick={() => keycloak.login()}>Login</Dropdown.Item>}
                    {!!keycloak.authenticated && <>
                      {keycloak.tokenParsed?.manages_namespaces?.sort((a: any, b: any) => a.length - b.length).map((namespace: any, index: number) =>
                        <div key={index}>
                        <Dropdown.Header>{namespace}</Dropdown.Header>
                        <Dropdown.Item href={`/register/resource/`+namespace}>Resource</Dropdown.Item>
                        <Dropdown.Item href={`/register/namespace/`+namespace}>Namespace</Dropdown.Item>
                        <Dropdown.Divider></Dropdown.Divider>
                        </div>
                      )}
                      <Dropdown.Item onClick={() => keycloak.logout()}>Logout ({keycloak.tokenParsed!.preferred_username})</Dropdown.Item>
                    </>}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
        </Row>
    );
}