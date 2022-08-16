import { useEffect, useState } from "react";
import { Container, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { MaritimeResourceControllerApi, MaritimeResourceDTO, PageMaritimeResourceDTO } from "../generated-client";

export interface IResourceProp{
    resources: MaritimeResourceDTO[];
    mrn: string;
}

export default function Resource({resources, mrn}: IResourceProp) {
    const [resource, setResource] = useState<MaritimeResourceDTO | undefined>();
    
    useEffect( () => {
        setResource(resources.filter(r => r.mrn === mrn).pop());
    }, [mrn]);
    return (
        <Container fluid style={{ padding: "1rem"}}>
            <Row>
                <h5>Resource</h5>
            </Row>
            <Row>
                { resource ? 
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <td>MRN</td>
                                <td>{resource?.mrn}</td>
                            </tr>
                            <tr>
                                <td>Version</td>
                                <td>{resource?.version}</td>
                            </tr>
                            <tr>
                                <td>Title</td>
                                <td>{resource?.title}</td>
                            </tr>
                            <tr>
                                <td>Description</td>
                                <td>{resource?.description}</td>
                            </tr>
                            <tr>
                                <td>Location</td>
                                <td><a href={resource?.location} target='_blank'>Link</a></td>
                            </tr>
                        </tbody>
                    </Table> :
                    <h6>No resource selected</h6>
                }
            </Row>
        </Container>
    );
  }