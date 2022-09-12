import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import D3Tree from "../components/d3/d3tree";
import { MaritimeResourceControllerApi, MaritimeResourceDTO, NamespaceSyntaxControllerApi, NamespaceSyntaxDTO } from "../generated-client";
import Namespace from "./namespace";
import Resource from "./resource";

export default function LookupComponent() {
  const [mrn, setMrn] = useState("");
  const [resources, setResources] = useState<MaritimeResourceDTO[]>([]);
  const [connected, setConnected] = useState(0);
  const [namespaceInfo, setNamespaceInfo] = useState<NamespaceSyntaxDTO | undefined>();

  const syntaxApiHandler = new NamespaceSyntaxControllerApi();
  const resourceApiHandler = new MaritimeResourceControllerApi();

  useEffect(() => {
    if (mrn.length && connected >= 0) {
      resourceApiHandler.getAllResourcesForMrn(mrn)
        .then((res: any) => {setConnected(1); return res.data.content;})
        .then((data: MaritimeResourceDTO[]) => setResources(data))
        .catch(() => setConnected(-1));
      syntaxApiHandler.getNamespaceSyntaxForMrn(mrn)
      .then(value => setNamespaceInfo(value.data as NamespaceSyntaxDTO))
      .catch(() => setNamespaceInfo(undefined));
    }
  }, [mrn]);
  
  return (
    <div>
      <Row>
          <Form onSubmit={(e)=>{
            e.preventDefault();
            }}>
            <Form.Group className="mb-3" controlId="searchMrn">
              <Form.Label></Form.Label>
              <Form.Control type="text" placeholder="Lookup a resource by MRN"
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Row>
        { connected > 0 && resources.length > 0 &&
          <>
            <Row style={{ backgroundColor: "#BDDCDE" }}>
              <Resource resources={resources} mrn={mrn}></Resource>
            </Row>
            <Row>
              {resources.toString()}
            </Row>
          </>
        }
        { connected > 0 && namespaceInfo &&
          <Row style={{ backgroundColor: "#F3FFB6"}}>
            <Namespace namespaceInfo={namespaceInfo!}></Namespace>
          </Row>
        }
        { connected < 0 &&
          <Row style={{ backgroundColor: "red"}}>
            <h2>Connection error:</h2> <h5>seems like you have a problem in the MRR server</h5>
          </Row>
        }
    </div>
  )
}