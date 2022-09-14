import { Button, ButtonGroup, Col, Dropdown, Row } from "react-bootstrap";
import keycloak from "../../auth/mrrKeycloak";

export const Header = () => {
    const testNamespaces = ["urn", "urn:mrn"];
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
              <Dropdown className="d-flex">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Add
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {!keycloak.authenticated && <Dropdown.Item onClick={() => keycloak.login()}>Login</Dropdown.Item>}
                    {!!keycloak.authenticated && <>
                      <Dropdown.Item onClick={() => keycloak.login()}>Logout ({keycloak.tokenParsed!.preferred_username})</Dropdown.Item>
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
                    </>}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
        </Row>
    );
}