import { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { MaritimeResourceDTO, NamespaceSyntaxControllerApi, NamespaceSyntaxDTO } from "../../generated-client";
import { keys } from 'ts-transformer-keys';
import Namespace from "../namespace";
import { color } from "d3";

export interface MaritimeResourceDTOError {
    mrn: boolean;
    version: boolean;
    location: boolean;
    description: boolean;
    name: boolean;
}

export default function Registration() {
    const [validated, setValidated] = useState(false);
    const [ errors, setErrors ] = useState<MaritimeResourceDTOError>({mrn:false, name:false, version:false, description:false, location:false});
    const [namespaceInfo, setNamespaceInfo] = useState<NamespaceSyntaxDTO | undefined>();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const syntaxApiHandler = new NamespaceSyntaxControllerApi();

    const {namespace} = useParams();

    useEffect(() => {
        if (namespace!.length) {
          syntaxApiHandler.getNamespaceSyntaxForMrn(namespace!)
          .then(value => {
            console.log(value);
                setNamespaceInfo(value.data as NamespaceSyntaxDTO);
            })
          .catch(() => setNamespaceInfo(undefined));
        }
      }, [namespace]);

    const handleSubmit = (e: any) => {
        const formData = new FormData(e.currentTarget),
                formDataObj = Object.fromEntries(formData.entries())
          console.log(formDataObj)
        e.preventDefault();
        setValidated(true);
    }

    const checkSyntax = (value: string, regexString: string) => {
        const regex = new RegExp(regexString);
        return regex.test(value);
    }

    const checkMrnSyntax = (value: any): boolean => {
        if (namespaceInfo && namespaceInfo.regex) {
            return checkSyntax(value, namespaceInfo.regex);
        }
        return false;
    }

    const checkUrlSyntax = (value: any): boolean => {
        const urlRegexStr = '(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})';
        return checkSyntax(value, urlRegexStr);
    }

    const checkMrnInput = (event: any) => {
        setErrors({...errors!, mrn: checkMrnSyntax(event.currentTarget.value)});
    }

    const checkUrlInput = (event: any) => {
        setErrors({...errors!, location: checkUrlSyntax(event.currentTarget.value)});
    }

    return (
        <Container style={{ textAlign: "left", padding: "1rem"}}>
            {namespaceInfo &&
            <>
                <Row>
                <h3>Register a resource</h3>
                </Row>
                <Row>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formMRN">
                            <Form.Label>Maritime Resource Name (MRN)</Form.Label>
                            <Form.Control type="text" required onChange={checkMrnInput} isInvalid={!errors.mrn} />
                            <Form.Control.Feedback type="invalid">Invalid MRN for '{namespaceInfo?.namespace}'</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                            MRN of resource complying with the <a className={"fw-bold"} onClick={handleShow}>{namespaceInfo?.namespace} namespace syntax</a>
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVersion">
                            <Form.Label>Version</Form.Label>
                            <Form.Control required placeholder="e.g., 0.1.0"/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                            Version of resource
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                            Name of resource
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control required/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                            Description of resource
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" required placeholder="http:// or https://" onChange={checkUrlInput} isInvalid={!errors.location} />
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

                <Modal show={show} size="lg" onHide={handleClose}>
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