import { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Modal, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { MaritimeResourceControllerApi, MaritimeResourceDTO, NamespaceSyntaxControllerApi, NamespaceSyntaxDTO } from "../../generated-client";
import { checkMrnSyntax, checkUrlSyntax } from "../../util/syntaxCheck";
import Namespace from "../namespace";

export default function ResourceRegistration() {
    const [value, setValue] = useState<MaritimeResourceDTO>({});
    const [validated, setValidated] = useState(false);
    const [mrnError, setMrnError] = useState(false);
    const [urlError, setUrlError] = useState(false);
    const [namespaceInfo, setNamespaceInfo] = useState<NamespaceSyntaxDTO | undefined>();
    const [namespaceModalShow, setNamespaceModalShow] = useState(false);
    const [errorShow, setErrorShow] = useState(false);

    const handleClose = () => setNamespaceModalShow(false);
    const handleShow = () => setNamespaceModalShow(true);

    const resourceApiHandler = new MaritimeResourceControllerApi();
    const syntaxApiHandler = new NamespaceSyntaxControllerApi();

    const {namespace} = useParams();

    useEffect(() => {
        if (namespace!.length) {
            syntaxApiHandler.getNamespaceSyntaxForMrn(namespace!)
            .then(value => {
                setNamespaceInfo(value.data as NamespaceSyntaxDTO);
            })
            .catch(() => setNamespaceInfo(undefined));
        }
      }, [namespace]);

    const handleSubmit = (e: any) => {
        if (validate(value)) {
            resourceApiHandler.createResource(value)
                .then((res) => console.log(res));
            setErrorShow(false);
        } else {
            setErrorShow(true);
        }
        e.preventDefault();
        setValidated(true);
    }

    const validate = (value: MaritimeResourceDTO): boolean => {
        let property: keyof typeof value; // Type is 'foo' | 'bar'

        for (property in value) {
            if (!value[property]){
                return false;
            }
        }
        return !mrnError && !urlError;
    }

    const checkMrnInput = (event: any) => {
        const valid = checkMrnSyntax(event.currentTarget.value, namespaceInfo);
        setMrnError(valid);
        setValue({...value, mrn: valid ? event.currentTarget.value : undefined});
        if (valid) {
            
        }
    }

    const checkUrlInput = (event: any) => {
        const valid = checkUrlSyntax(event.currentTarget.value);
        setUrlError(valid);
        setValue({...value, location: valid ? event.currentTarget.value : undefined});
    }

    return (
        <Container style={{ textAlign: "left", padding: "1rem"}}>
            {errorShow && <Alert variant="danger" onClose={() => setErrorShow(false)} dismissible>
                <Alert.Heading>There is some problem in your input!</Alert.Heading>
                <p>
                    You might need to check whether all your input is correctly entered. Please check error messages under each input field.
                </p>
            </Alert>
            }
            {namespaceInfo &&
            <>
                <Row>
                <h3>Register a resource</h3>
                </Row>
                <Row>
                    <Form validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formMRN">
                            <Form.Label>Maritime Resource Name (MRN)</Form.Label>
                            <Form.Control type="text" required onChange={checkMrnInput} defaultValue={namespace + ':'} isInvalid={!mrnError} />
                            <Form.Control.Feedback type="invalid">Invalid MRN for '{namespaceInfo?.namespace}'</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                            MRN of resource complying with the <a className={"fw-bold"} onClick={handleShow}>{namespaceInfo?.namespace} namespace syntax</a>
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVersion">
                            <Form.Label>Version</Form.Label>
                            <Form.Control required placeholder="e.g., 0.1.0" onChange={(e) => setValue({...value, version: e.currentTarget.value})}/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                            Version of resource
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required onChange={(e) => setValue({...value, name: e.currentTarget.value})}/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control required onChange={(e) => setValue({...value, description: e.currentTarget.value})}/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" required placeholder="https://example.com" onChange={checkUrlInput} isInvalid={!urlError} />
                            <Form.Control.Feedback type="invalid">Enter a valid URL address</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Link to resource in the form of a URL (uniform resource locator)
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Row>

                <Modal show={namespaceModalShow} size="lg" onHide={handleClose}>
                    <Modal.Body><Namespace namespaceInfo={namespaceInfo}></Namespace></Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </>
            }
            
        </Container>
    );
}