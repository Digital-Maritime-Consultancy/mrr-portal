import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import D3Tree from "../components/d3/d3tree";
import { MaritimeResourceControllerApi, MaritimeResourceDTO } from "../generated-client";
import Namespace from "./namespace";
import Resource from "./resource";

export default function TreeView() {
  const [mrn, setMrn] = useState("");
  const [resources, setResources] = useState<MaritimeResourceDTO[]>([]);

  useEffect(() => {
    const apiHandler = new MaritimeResourceControllerApi();
    apiHandler.getAllMaritimeResources()
      .then((res: any) => res.data)
      .then((data: MaritimeResourceDTO[]) => setResources(data))
      .catch(e => alert(e));
  }, []);
  
  return (
    <div>
      <Container fluid>
        <Row style={{height: "30em"}}>
          <Col sm={3} style={{ backgroundColor: "#BDDCDE" }}>
            <Resource resources={resources} mrn={mrn}></Resource>
          </Col>
          <Col sm={9}>
            <D3Tree resource={resources} onSelect={(mrn) => setMrn(mrn)}></D3Tree>
          </Col>
        </Row>
        <Row>
          <Col style={{ backgroundColor: "#F3FFB6"}}>
            <Namespace mrn={mrn}></Namespace>
          </Col>
        </Row>
      </Container>
      
    </div>
  )
}