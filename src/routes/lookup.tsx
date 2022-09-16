import { useEffect, useState } from "react";
import { Form, Row } from "react-bootstrap";
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
        .catch(() => {setConnected(-1); setResources([])});
      syntaxApiHandler.getNamespaceSyntaxForMrn(mrn)
      .then(value => setNamespaceInfo(value.data as NamespaceSyntaxDTO))
      .catch(() => setNamespaceInfo(undefined));
    } else {
      setResources([]);
      setNamespaceInfo(undefined);
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
        { connected > 0 && resources.length > 0 && namespaceInfo &&
          <>
            <Row>
              <Resource resources={resources} mrn={mrn} namespaceInfo={namespaceInfo!}></Resource>
            </Row>
          </>
        }
        { connected > 0 && namespaceInfo && mrn === namespaceInfo.namespace &&
          <>
            <Row>
              <Namespace namespaceInfo={namespaceInfo!}></Namespace>
            </Row>
          </>
        }
        { connected < 0 &&
          <Row style={{ backgroundColor: "red"}}>
            <h2>Connection error:</h2> <h5>seems like you have a problem in the MRR server</h5>
          </Row>
        }
    </div>
  )
}