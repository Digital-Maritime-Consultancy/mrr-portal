import { useEffect, useState } from "react";
import { Container, ListGroup, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { MaritimeResourceDTO } from "../generated-client";

export interface IResourceProp{
    resources: MaritimeResourceDTO[];
    mrn: string;
}

export default function Resource({resources, mrn}: IResourceProp) {
    const [resource, setResource] = useState<MaritimeResourceDTO | undefined>();
    
    useEffect( () => {
        setResource(resources.filter(r => r.mrn === mrn).pop());
    }, [mrn]);

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

    return (
        <Container fluid style={{ textAlign: "left", padding: "1rem"}}>
            <Row>
                <h4>Resource</h4>
                <div className="p-3 fw-light">A namespace is a collection of names that obey three constraints: uniqueness, consistent assignment, and assignment by common definition, i.e., syntax definition and process.
                    [<a href="https://www.rfc-editor.org/rfc/rfc8141.html#page-20" target="_blank" rel="noreferrer">RFC8141</a>], [<a href="https://www.iana.org/assignments/urn-formal/mrn" target="_blank" rel="noreferrer">MRN namespace</a>] </div>
            </Row>
            <Row>
                { resource ?
                    <ListGroup variant="flush">
                        {renderListGroupItem('mrn', 'MRN', resource?.mrn!, 'the MRN of the resource')}
                        {renderListGroupItem('version', 'Version', resource?.version!, 'a version of the resource in the format MAJOR.MINOR.PATCH')}
                        {renderListGroupItem('name', 'Name', resource?.name!, 'the name of the resource')}
                        {renderListGroupItem('description', 'Description', resource?.description!, 'a short description of the resource')}
                        {renderListGroupItem('location', 'Location', resource?.location!, 'a link to the original source of the resource')}
                    </ListGroup>:
                    <h6>No corresponding namespace</h6>
                }
            </Row>
        </Container>
    );
  }