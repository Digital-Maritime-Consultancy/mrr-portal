import { Container, Row, Table } from "react-bootstrap";

export default function Introduction() {

    return (
        <Container fluid style={{ textAlign: "left", padding: "1rem"}}>
            <Row>
                <h5>Introduction to MRR</h5>
            </Row>
            <Row>
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <th>Maritime Resource Registry (MRR)</th>
                            <td>Maritime Resource Registry (MRR) is a MRN (Maritime Resource Names) centric registry capable of holding information about resource that has been assigned an MRN.</td>
                        </tr>
                        <tr>
                            <th>What is MRN?</th>
                            <td>IALA guideline G1143 ‘UNIQUE IDENTIFIERS FOR MARITIME RESOURCES’ provides further information about MRN.</td>
                        </tr>
                        <tr>
                            <th>What is MRN?</th>
                            <td>MRN are identifiers that can be used for virtually anything in the maritime domain. Obvious examples are IALA documents, buoys and technical services. i.e., this can be both virtual or physical entities. IALA guideline G1143 ‘UNIQUE IDENTIFIERS FOR MARITIME RESOURCES’ provides further information about MRN.</td>
                        </tr>
                        <tr>
                            <th>What is MRN?</th>
                            <td>IALA guideline G1143 ‘UNIQUE IDENTIFIERS FOR MARITIME RESOURCES’ provides further information about MRN.</td>
                        </tr>
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
  }