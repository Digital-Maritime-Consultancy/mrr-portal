import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import D3Tree from "../components/d3/d3tree";
import { MaritimeResourceControllerApi, MaritimeResourceDTO, NamespaceSyntaxControllerApi, NamespaceSyntaxDTO } from "../generated-client";
import Namespace from "./namespace";
import Resource from "./resource";

export default function MrnTreeComponent() {
  const [mrn, setMrn] = useState("");
  const [resources, setResources] = useState<MaritimeResourceDTO[]>([]);
  const [connected, setConnected] = useState(0);
  const [namespaceInfo, setNamespaceInfo] = useState<NamespaceSyntaxDTO>();

  const syntaxApiHandler = new NamespaceSyntaxControllerApi();
  const resourceApiHandler = new MaritimeResourceControllerApi();

  useEffect(() => {
    if (mrn.length && connected >= 0) {
      resourceApiHandler.getAllResourcesForMrn(mrn)
        .then((res: any) => {setConnected(1); console.log(res); return res.data.content;})
        .then((data: MaritimeResourceDTO[]) => setResources(data))
        .catch(() => setConnected(-1));
      syntaxApiHandler.getNamespaceSyntaxForMrn(mrn)
      .then(value => setNamespaceInfo(value as NamespaceSyntaxDTO));
    }
  }, [mrn]);
  
  return (
    <div>
      <Container fluid>
        {
          connected > 0 &&
          <>
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
              <Namespace namespaceInfo={namespaceInfo!}></Namespace>
            </Col>
          </Row>
          </>
        }
        { connected < 0 &&
          <Row style={{ backgroundColor: "red"}}>
            <h4>Connection error: seems like you have a problem in the MRR server</h4>
          </Row>
        }
      </Container>
      
    </div>
  )
}