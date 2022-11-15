import { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import { IContext, Mode } from "../../App";
import { useAuth } from "../../auth/useAuth";
import { MaritimeResourceControllerApi, MaritimeResourceDTO, NamespaceSyntaxControllerApi, NamespaceSyntaxDTO } from "../../generated-client";
import { checkMrnSyntax, checkUrlSyntax } from "../../util/syntaxCheck";
import Namespace from "../namespace";
import { ErrorNoticer } from "./errorNoticer";

export interface IResourceRegistrationProp{
    context: IContext;
    setContext: (context: IContext) => void;
}

export const ResourceRegistration = ({context, setContext}: IResourceRegistrationProp) => {
    const [value, setValue] = useState<MaritimeResourceDTO>({});
    const [validated, setValidated] = useState(false);
    const [mrnValidity, setMrnValidity] = useState(true);
    const [urlValidity, setUrlValidity] = useState(true);
    const [namespaceInfo, setNamespaceInfo] = useState<NamespaceSyntaxDTO | undefined>();
    const [namespaceModalShow, setNamespaceModalShow] = useState(false);
    const [errorShow, setErrorShow] = useState(false);
    const [errorHeader, setErrorHeader] = useState("");
    const [errorContent, setErrorContent] = useState("");

    const { token, initialized: authInitialized } = useAuth();

    const handleClose = () => setNamespaceModalShow(false);
    const handleShow = () => setNamespaceModalShow(true);

    const resourceApiHandler = new MaritimeResourceControllerApi();
    const syntaxApiHandler = new NamespaceSyntaxControllerApi();

    useEffect(() => {
        if (context.namespace!.length) {
            syntaxApiHandler.getNamespaceSyntaxForMrn(context.namespace!)
            .then(value => {
                setNamespaceInfo(value.data as NamespaceSyntaxDTO);
            })
            .catch(() => setNamespaceInfo(undefined));
        }
      }, [context.namespace, token]);

    const handleSubmit = (e: any) => {
        if (validate(value)) {
            resourceApiHandler.createResource(value, {headers: { Authorization: `Bearer ${token}` }})
                .then((res) => setContext({mode: Mode.SHOW_RESULT, namespace: res.data.mrn, version: res.data.version}))
                .catch(err => {
                    setErrorShow(true);
                    setErrorHeader(err.response.data.error);
                    setErrorContent(err.response.data.message);
                });
            setErrorShow(false);
        } else {
            setErrorShow(true);
            setErrorHeader("There is some problem in your input!");
            setErrorContent("You might need to check whether all your input is correctly entered. Please check error messages under each input field.");
        }
        e.preventDefault();
        setValidated(true);
    }

    const validate = (value: MaritimeResourceDTO): boolean => {
        let property: keyof typeof value;

        for (property in value) {
            if (!value[property]){
                return false;
            }
        }
        return mrnValidity && urlValidity;
    }

    const checkMrnInput = (event: any) => {
        const valid = checkMrnSyntax(event.currentTarget.value, namespaceInfo);
        setMrnValidity(valid);
        setValue({...value, mrn: valid ? event.currentTarget.value : undefined});
    }

    const checkUrlInput = (event: any) => {
        const valid = checkUrlSyntax(event.currentTarget.value);
        setUrlValidity(valid);
        setValue({...value, location: valid ? event.currentTarget.value : undefined});
    }

    return (
        <Container style={{ textAlign: "left", padding: "1rem"}}>
            {errorShow && 
                <ErrorNoticer variant="danger" header={errorHeader}
                    content={errorContent}
                    setErrorShow={setErrorShow} />
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
                        <Form.Control type="text" required onChange={checkMrnInput} placeholder={context.namespace + ':'} isInvalid={!mrnValidity} />
                        <Form.Control.Feedback type="invalid">Invalid MRN for '{namespaceInfo?.mrnNamespace}'</Form.Control.Feedback>
                        <Form.Text className="text-muted">
                        MRN of resource complying with the <a className={"fw-bold"} onClick={handleShow}>{namespaceInfo?.mrnNamespace} namespace syntax</a>
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
                        <Form.Control type="text" required placeholder="https://example.com" onChange={checkUrlInput} isInvalid={!urlValidity} />
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