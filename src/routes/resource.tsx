import { useEffect, useState } from "react";
import { Button, Col, Container, ListGroup, Modal, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { MaritimeResourceDTO, NamespaceSyntaxDTO } from "../generated-client";
import Namespace from "./namespace";

export interface IResourceProp{
    resources: MaritimeResourceDTO[];
    mrn: string;
    namespaceInfo?: NamespaceSyntaxDTO;
}

export default function Resource({resources, mrn, namespaceInfo}: IResourceProp) {
    const [namespaceModalShow, setNamespaceModalShow] = useState(false);

    const handleClose = () => setNamespaceModalShow(false);
    const handleShow = () => setNamespaceModalShow(true);
    
    useEffect( () => {
    }, [mrn, namespaceInfo]);

    const renderListGroupItem = (id: string, title: string, content?: string, description?: string, children?: any) => (
        <ListGroup.Item>
            <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={
                    <Tooltip id={`tooltip-${id}`}>
                        {description!}
                    </Tooltip>
                    } >
                <span className="fw-bold">{title}</span>
            </OverlayTrigger>
            <div>
            {
                id === 'location' ? <a href={content} target="_blank" rel="noreferrer">{content}</a> : content
            }
            </div>
            {children}
        </ListGroup.Item>
      );

    return (
        <>
            <Container fluid style={{ textAlign: "left", padding: "1rem"}}>
                <Row>
                    <Col>
                        <h4>Resource</h4>
                    </Col>
                    <Col>
                        
                    </Col>
                    
                    <div className="p-3 fw-light">
                        A physical or virtual entity associated with MRN and version.
                        {/*The MRN of the the resource complies with the <a className={"fw-bold"} onClick={handleShow}>{namespaceInfo?.mrnNamespace} namespace syntax</a>*/}
                    </div>
                </Row>
                <Row>
                    { resources && resources.length ?
                        resources.map(resource => 
                            <div key={resource.version}>
                                <hr />
                                <ListGroup variant="flush">
                                    {renderListGroupItem('mrn', 'MRN', resource?.mrn!, 'the MRN of the resource')}
                                    {renderListGroupItem('version', 'Version', resource?.version!, 'a version of the resource in the format MAJOR.MINOR.PATCH')}
                                    {renderListGroupItem('name', 'Name', resource?.name!, 'the name of the resource')}
                                    {renderListGroupItem('description', 'Description', resource?.description!, 'a short description of the resource')}
                                    {renderListGroupItem('location', 'Location', resource?.location!, 'a link to the original source of the resource')}
                                </ListGroup>
                            </div>
                        )
                        :
                        <h6>No corresponding namespace</h6>
                    }
                </Row>
            </Container>
            {
                namespaceInfo && 
                <Modal show={namespaceModalShow} size="lg" onHide={handleClose}>
                    <Modal.Body><Namespace namespaceInfo={namespaceInfo}></Namespace></Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    );
  }