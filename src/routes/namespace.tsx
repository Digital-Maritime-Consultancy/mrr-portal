import { useEffect } from "react";
import { Container, ListGroup, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { NamespaceSyntaxDTO } from "../generated-client";

export interface INamespaceProp{
    namespaceInfo: NamespaceSyntaxDTO;
}

export default function Namespace({namespaceInfo}: INamespaceProp) {

    useEffect( () => {
    }, [namespaceInfo]);

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
            <div>{content}</div>
            {children}
        </ListGroup.Item>
      );
    const renderItems = (id: string, title: string, content?: string, description?: string) => (
    <li>
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={
                <Tooltip id={`tooltip-${id}`}>
                    {description!}
                </Tooltip>
                } >
            <span className="fw-bold">{title}{content && ' : '}</span>
        </OverlayTrigger>
        <span>{content}</span>
    </li>
    );
      
    return (
        <Container fluid style={{ textAlign: "left", padding: "1rem"}}>
            <Row>
                <h4>Namespace</h4>
                <div className="p-3 fw-light">A namespace is a collection of names that obey three constraints: uniqueness, consistent assignment, and assignment by common definition, i.e., syntax definition and process.
                    [<a href="https://www.rfc-editor.org/rfc/rfc8141.html#page-20" target="_blank">RFC8141</a>], [<a href="https://www.iana.org/assignments/urn-formal/mrn" target="_blank">MRN namespace</a>] </div>
            </Row>
            <Row>
                { namespaceInfo ?
                    <ListGroup variant="flush">
                        {renderListGroupItem('mrn-namespace', 'namespace', namespaceInfo?.namespace!, 'assigned MRN namespace')}
                        {renderListGroupItem('abnf-syntax', 'ABNF syntax', namespaceInfo?.abnfSyntax!, 'a full syntax for MRNs belonging to that namespace')}
                        {renderListGroupItem('regex', 'Regular expression', namespaceInfo?.regex!, 'a regular expression form equivalent to the ABNF syntax')}
                        {renderListGroupItem('regex', 'Namespace owner', undefined, 'information of the MRN namespace owner', <ul>
                            {renderItems('owner-name', 'Name', namespaceInfo?.namespaceOwner!.name!, 'name of the owner')}
                            {renderItems('owner-url', 'URL', namespaceInfo?.namespaceOwner!.url!, 'URL for the website of the owner')}
                            {renderItems('owner-address', 'Address', namespaceInfo?.namespaceOwner!.address!, 'address of the owner')}
                            {renderItems('owner-country', 'Country', namespaceInfo?.namespaceOwner!.country!, 'country of the owner')}
                            {renderItems('owner-email', 'email', namespaceInfo?.namespaceOwner!.email!, 'mail for the point of contact of the owner')}
                            {renderItems('owner-phone', 'Phone', namespaceInfo?.namespaceOwner!.phone!, 'phone number for the point of contact of the owner')}
                        </ul>)}
                        
                    </ListGroup>:
                    <h6>No corresponding namespace</h6>
                }
            </Row>
        </Container>
    );
  }