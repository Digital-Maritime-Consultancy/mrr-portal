import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Row } from "react-bootstrap";
import { MaritimeResourceControllerApi, MaritimeResourceDTO, NamespaceSyntaxControllerApi, NamespaceSyntaxDTO } from "../generated-client";
import Namespace from "./namespace";
import Resource from "./resource";
import * as Icon from 'react-bootstrap-icons';

export default function LookupComponent() {
  const [mrn, setMrn] = useState("");
  const [resources, setResources] = useState<MaritimeResourceDTO[]>([]);
  const [connected, setConnected] = useState(0);
  const [namespaceInfo, setNamespaceInfo] = useState<NamespaceSyntaxDTO | undefined>();

  const syntaxApiHandler = new NamespaceSyntaxControllerApi();
  const resourceApiHandler = new MaritimeResourceControllerApi();
  
  const lookup = (mrn: string) => {
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
  }

  return (
    <div>
      <Row>
          <Form className="text-start" onSubmit={(e)=>{
            e.preventDefault();
            }}>
            <Form.Text>
              Type MRN of resource or namespace to lookup registered information associated with. Try 'urn:mrn' for your first trial.
            </Form.Text>
            <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Lookup a resource by MRN"
                  type="text"
                  value={mrn}
                  onChange={(e) => setMrn(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && lookup(mrn)}
                />
                <Button onClick={(e)=>lookup(mrn)} variant="primary" id="button-addon2">
                  <Icon.Search />
                </Button>
          </InputGroup>
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