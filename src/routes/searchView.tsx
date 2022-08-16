import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import D3Tree from "../components/d3/d3tree";
import { MaritimeResourceControllerApi, MaritimeResourceDTO } from "../generated-client";
import Namespace from "./namespace";
import Resource from "./resource";

export default function SearchView() {
  const [mrn, setMrn] = useState("");
  const [resources, setResources] = useState<MaritimeResourceDTO[]>([]);

  useEffect(() => {
    const apiHandler = new MaritimeResourceControllerApi();
    if (mrn.length) {
      apiHandler.getAllResourcesForMrn(mrn)
        .then((res: any) => res.data.content)
        .then((data: MaritimeResourceDTO[]) => setResources(data))
        .catch(e => alert(e));
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
        { resources.length &&
          <Row style={{ backgroundColor: "#BDDCDE" }}>
            <Resource resources={resources} mrn={mrn}></Resource>
          </Row>
        }
        <Row style={{ backgroundColor: "#F3FFB6"}}>
          <Namespace mrn={mrn}></Namespace>
        </Row>
      </Container>
    </div>
  )
}