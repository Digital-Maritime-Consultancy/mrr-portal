import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import D3Tree from "../components/d3/d3tree";
import { MaritimeResourceControllerApi, MaritimeResourceDTO } from "../generated-client";
import Namespace from "./namespace";
import Resource from "./resource";

export default function SearchView() {
  const [mrn, setMrn] = useState("");
  const [resources, setResources] = useState<MaritimeResourceDTO[]>([]);
  const [connected, setConnected] = useState(0);

  useEffect(() => {
    const apiHandler = new MaritimeResourceControllerApi();
    if (mrn.length && connected >= 0) {
      apiHandler.getAllResourcesForMrn(mrn)
        .then((res: any) => {setConnected(1); return res.data.content;})
        .then((data: MaritimeResourceDTO[]) => setResources(data))
        .catch(() => setConnected(-1));
    }
  }, [mrn]);
  
  return (
    <div>
      <Container fluid>
        <Row>
          <Form onSubmit={(e)=>{
            e.preventDefault();
            console.log(e.target);
            }}>
            <Form.Group className="mb-3" controlId="searchMrn">
              <Form.Label></Form.Label>
              <Form.Control type="text" placeholder="Enter an MRN of resource"
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
              />
              <Form.Text className="text-muted">
                Search resources by Maritime Resource Name
              </Form.Text>
            </Form.Group>
          </Form>
        </Row>
        { connected > 0 && resources.length > 0 &&
          <>
            <Row style={{ backgroundColor: "#BDDCDE" }}>
              <Resource resources={resources} mrn={mrn}></Resource>
            </Row>
            <Row style={{ backgroundColor: "#F3FFB6"}}>
              <Namespace mrn={mrn}></Namespace>
            </Row>
          </>
        }
        { connected < 0 &&
          <Row style={{ backgroundColor: "red"}}>
            <h2>Connection error:</h2> <h5>seems like you have a problem in the MRR server</h5>
          </Row>
        }
      </Container>
    </div>
  )
}