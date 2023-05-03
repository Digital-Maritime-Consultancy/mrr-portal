import { useEffect, useState } from "react";
import { Accordion, Button, Form, InputGroup, Row } from "react-bootstrap";
import { MaritimeResourceControllerApi, MaritimeResourceDTO, NamespaceSyntaxControllerApi, NamespaceSyntaxDTO } from "../generated-client";
import Namespace from "./namespace";
import Resource from "./resource";
import * as Icon from 'react-bootstrap-icons';

export interface ILookupComponentProp{
  givenMrn: string;
}

export default function LookupComponent({givenMrn}: ILookupComponentProp) {
  const [mrn, setMrn] = useState(givenMrn);
  const [resources, setResources] = useState<MaritimeResourceDTO[]>([]);
  const [connected, setConnected] = useState(0);
  const [namespaceInfo, setNamespaceInfo] = useState<NamespaceSyntaxDTO | undefined>();
  const [childNS, setChildNS] = useState<NamespaceSyntaxDTO[]> ([]);
  const [received, setReceived] = useState(false);

  const syntaxApiHandler = new NamespaceSyntaxControllerApi();
  const resourceApiHandler = new MaritimeResourceControllerApi();
  
  const fetchNamespaceInfo = (mrnFromInput: string, data: any) => {
    const ns = data.content;
    if (ns && ns.length > 0) {
      const coreNs = ns.filter((e: NamespaceSyntaxDTO) => e.mrnNamespace === mrnFromInput).pop();
      if (coreNs) {
        setNamespaceInfo(coreNs);
        const children = ns.filter((e: NamespaceSyntaxDTO) => e.mrnNamespace !== mrnFromInput);
        setChildNS(children);
      }
    }
  }

  useEffect( () => {
    if (givenMrn.length && !received) {
      setMrn(givenMrn);
      lookup(givenMrn);
    }
  }, [givenMrn]);

  const lookup = (mrn: string) => {
    if (mrn.length && connected >= 0) {
      // initialize query results
      setResources([]);
      setNamespaceInfo(undefined);

      // get to backend
      resourceApiHandler.getAllResourcesForMrn(mrn)
        .then((res: any) => {setConnected(1); return res.data.content;})
        .then((data: MaritimeResourceDTO[]) => setResources(data))
        .then(() => setReceived(true))
        .catch(() => {setConnected(-1); setResources([])});
      syntaxApiHandler.getAllNamespaceSyntaxesUnderNamespace(mrn)
      .then(value => fetchNamespaceInfo(mrn, value.data))
      .then(() => setReceived(true))
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
                  onChange={(e) => {setReceived(false); setMrn(e.target.value);}}
                  onKeyUp={(e) => e.key === "Enter" && lookup(mrn)}
                />
                <Button onClick={(e)=>lookup(mrn)} variant="primary" id="button-addon2">
                  <Icon.Search />
                </Button>
          </InputGroup>
          </Form>
        </Row>
        { connected > 0 && resources.length > 0 &&
          <>
            <Row>
              <Resource resources={resources} mrn={mrn} namespaceInfo={namespaceInfo!}></Resource>
            </Row>
          </>
        }
        { connected > 0 && namespaceInfo && mrn === namespaceInfo.mrnNamespace &&
          <>
            <Row>
              <Namespace namespaceInfo={namespaceInfo!}></Namespace>
            </Row>
            <Row className="text-start">
              {
                childNS.length > 0 &&
                <>
                  <h5>Children namespace</h5>
                  <Accordion>
                    {
                      childNS.map((e: NamespaceSyntaxDTO, i: number) => 
                      <Accordion.Item key={i} eventKey={i.toString()}>
                      <Accordion.Header>{e.mrnNamespace}</Accordion.Header>
                      <Accordion.Body>
                        <Namespace namespaceInfo={e!}></Namespace>
                      </Accordion.Body>
                    </Accordion.Item>
                      )
                    }
                  </Accordion>
                </>
              }
            </Row>
          </>
        }
        {
          received && !namespaceInfo && resources.length === 0 &&
          <Row>
            <h2>No result from your query "{mrn}"</h2>
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