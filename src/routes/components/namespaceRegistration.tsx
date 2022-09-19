import { useState } from "react";
import { Alert, Button, Container, Form, Row, Spinner } from "react-bootstrap";
import CountrySelect from "react-bootstrap-country-select";
import { useParams } from "react-router-dom";
import { NamespaceSyntaxControllerApi, NamespaceSyntaxDTO, SyntaxCreationDTO } from "../../generated-client";
import { useBeforeunload } from 'react-beforeunload';
import { useAuth } from "../../auth/useAuth";
import { ErrorNoticer } from "./errorNoticer";

export default function NamespaceRegistration() {
    const [validated, setValidated] = useState(false);
    const {type, namespace} = useParams();
    const [ country, setCountry ] = useState<any>("");
    const [errorShow, setErrorShow] = useState(false);
    const [hangingMsgShow, setHangingMsgShow] = useState(false);
    const [ value, setValue ] = useState<SyntaxCreationDTO>({});
    const [hanging, setHanging] = useState(false);
    const [errorHeader, setErrorHeader] = useState("");
    const [errorContent, setErrorContent] = useState("");
    const { token, initialized: authInitialized } = useAuth();
    const [creationId, setCreationId] = useState("");
    const syntaxApiHandler = new NamespaceSyntaxControllerApi();

    useBeforeunload((event) => {
        if (hanging) {
            event.preventDefault();
            return '';
        }
    });

    const validate = (value: SyntaxCreationDTO): boolean => {
        let property: keyof typeof value;

        for (property in value) {
            if (!value[property]){
                return false;
            }
        }
        return 'country' in value.namespaceOwner! && value.namespaceOwner.country !== undefined;
    }

    const delay = (ms: number) => {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    const handleSubmit = (e: any) => {
        if (validate(value)) {
            const convertedAbnf = value.abnfSyntax?.replaceAll('\n', '\r\n');
            setValue({...value, abnfSyntax: convertedAbnf! + convertedAbnf!.endsWith('\r\n') ? '': '\r\n'})

            // call the api
            syntaxApiHandler.createNamespaceSyntax(value, {headers: { Authorization: `Bearer ${token}` }})
                .then((res) => {
                    // show error
                    setHangingMsgShow(true);
                    // hanging and disable input
                    setHanging(true);
                    setCreationId(res.data);
                    let done = false;
                    (async () => { 
                        // 20 sec wait
                        await delay(5000);
                
                        // Do something after
                        syntaxApiHandler.getSyntaxCreationStatus(res.data, {headers: { Authorization: `Bearer ${token}` }})
                            .then(res => console.log(res));
                            done = true;
                    })();
                })
                .catch(err => {
                    setErrorShow(true);
                    if (err.response && err.response.data) {
                        setErrorHeader(err.response.data.error);
                        setErrorContent(err.response.data.message);
                    } else {
                        setErrorHeader("Something went wrong");
                        setErrorContent("Server can't process your input with some reason.");
                    }
                });
            setErrorShow(false);
            setValidated(true);
        } else {
            setErrorShow(true);
            setErrorHeader("There is some problem in your input!");
            setErrorContent("You might need to check whether all your input is correctly entered. Please check error messages under each input field.");
        }
        e.preventDefault();
    }

    return (
        <Container style={{ textAlign: "left", padding: "1rem"}}>
            {errorShow && 
                <ErrorNoticer variant="danger" header={errorHeader}
                    content={errorContent}
                    setErrorShow={setErrorShow} />
            }
            {hangingMsgShow && 
                <ErrorNoticer variant="warning" header={"Please hold this page! MRR is now validating your syntax"}
                    content={"More than 5 mins of processing time is expected to complete the validation. We strongly encourage you to leave this page. This page will check the process and notify you when it is done."}
                    setErrorShow={setErrorShow} />
            }
            {namespace &&
            <>
                <Row>
                <h3>Register namespace</h3>
                </Row>
                <Row>
                    <Form validated={validated && typeof country !=='string'} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formNamespace">
                            <Form.Label>Namespace</Form.Label>
                            <Form.Control type="text" required placeholder={namespace + ':...'} onChange={
                                (e: any)=> setValue({...value, namespace: e.target.value})
                            } disabled={hanging}/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                            Root of namespace
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formParentNamespace">
                            <Form.Label>Parent namespace</Form.Label>
                            <Form.Control required onChange={
                                (e: any)=> setValue({...value, parentNamespace: e.target.value})
                            } disabled={hanging}/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                            Parent namespace for the namespace to be registered
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formAbnf">
                            <Form.Label>ABNF syntax</Form.Label>
                            <Form.Control as="textarea" rows={3} required onChange={
                                (e: any)=> setValue({...value, abnfSyntax: e.target.value})
                            } disabled={hanging} />
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                            <a href="https://en.wikipedia.org/wiki/Augmented_Backus%E2%80%93Naur_form" target="_blank">Augmented Backus–Naur form</a> syntax for namespace
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Namespace owner name</Form.Label>
                            <Form.Control required onChange={
                                (e: any)=> {
                                    const owner = value?.namespaceOwner? {... value?.namespaceOwner, name: e.target.value} : {name: e.target.value};
                                    setValue({...value, namespaceOwner: owner});
                                }
                            } disabled={hanging}/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Namespace owner e-mail</Form.Label>
                            <Form.Control required placeholder="name@example.com" onChange={
                                (e: any)=> {
                                    const owner = value?.namespaceOwner? {... value?.namespaceOwner, email: e.target.value} : {email: e.target.value};
                                    setValue({...value, namespaceOwner: owner});
                                }
                            } disabled={hanging}/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPhone">
                            <Form.Label>Namespace owner phone</Form.Label>
                            <Form.Control required onChange={
                                (e: any)=> {
                                    const owner = value?.namespaceOwner? {... value?.namespaceOwner, phone: e.target.value} : {phone: e.target.value};
                                    setValue({...value, namespaceOwner: owner});
                                }
                            } disabled={hanging}/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formUrl">
                            <Form.Label>Namespace owner URL</Form.Label>
                            <Form.Control required onChange={
                                (e: any)=> {
                                    const owner = value?.namespaceOwner? {... value?.namespaceOwner, url: e.target.value} : {url: e.target.value};
                                    setValue({...value, namespaceOwner: owner});
                                }
                            } disabled={hanging}/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formAddress">
                            <Form.Label>Namespace owner address</Form.Label>
                            <Form.Control required onChange={
                                (e: any)=> {
                                    const owner = value?.namespaceOwner? {... value?.namespaceOwner, address: e.target.value} : {address: e.target.value};
                                    setValue({...value, namespaceOwner: owner});
                                }
                            } disabled={hanging}/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formCountry">
                            <Form.Label>Namespace owner country</Form.Label>
                            <CountrySelect value={country} onChange={(val: any) => {
                                const owner = value?.namespaceOwner? {... value?.namespaceOwner, country: val && typeof val !== 'string' ? val.name : undefined} :
                                {country: val && typeof val !== 'string' ? val.name : undefined};
                                setValue({...value, namespaceOwner: owner});
                                setCountry(val);
                                }} disabled={hanging} onTextChange={() => {}}/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={hanging}>
                            {hanging && <Spinner animation="border" role="status" >
                            </Spinner>}
                            Submit
                        </Button>
                    </Form>
                </Row>
            </>
            }
            
        </Container>
    );
}