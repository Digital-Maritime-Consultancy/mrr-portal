import { useEffect, useState } from "react";
import { Container, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { NamespaceSyntaxControllerApi, NamespaceSyntaxDTO } from "../generated-client";

export interface INamespaceProp{
    mrn: string;
}

export default function Namespace({mrn}: INamespaceProp) {
    const [namespace, setNamespace] = useState<NamespaceSyntaxDTO>();

    useEffect( () => {
        const apiHandler = new NamespaceSyntaxControllerApi();
        if (mrn.length) {
            apiHandler.getNamespaceSyntaxForMrn(mrn)
            .then(value => setNamespace(value.data))
            .catch(e => setNamespace(undefined));
        }        
    }, [mrn]);

    return (
        <Container fluid style={{ padding: "1rem"}}>
            <Row>
                <h5>Namespace for {mrn}</h5>
            </Row>
            <Row>
                { namespace ? 
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <td>MRN namespace</td>
                                <td>{namespace?.namespace}</td>
                            </tr>
                            <tr>
                                <td>ABNF syntax</td>
                                <td>{namespace?.abnfSyntax}</td>
                            </tr>
                            <tr>
                                <td>Regular expression</td>
                                <td>{namespace?.regex}</td>
                            </tr>
                        </tbody>
                    </Table> :
                    <h6>No corresponding namespace</h6>
                }
            </Row>
        </Container>
    );
  }