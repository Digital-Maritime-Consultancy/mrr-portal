import { useState } from "react";
import { Alert, Button, Container, Form, Row } from "react-bootstrap";
import CountrySelect from "react-bootstrap-country-select";
import { useParams } from "react-router-dom";
import { NamespaceSyntaxDTO } from "../../generated-client";
import { useBeforeunload } from 'react-beforeunload';

export default function NamespaceRegistration() {
    const [validated, setValidated] = useState(false);
    const {type, namespace} = useParams();
    const [ country, setCountry ] = useState<any>("");
    const [errorShow, setErrorShow] = useState(false);
    const [hangingMsgShow, setHangingMsgShow] = useState(false);
    const [ value, setValue ] = useState<NamespaceSyntaxDTO>({});
    const [hanging, setHanging] = useState(false);

    useBeforeunload((event) => {
        if (hanging) {
            event.preventDefault();
            return 'Test';
        }
    });

    const handleSubmit = (e: any) => {
        if ('country' in value.namespaceOwner! && value.namespaceOwner.country) {
            const convertedAbnf = value.abnfSyntax?.replaceAll('\n', '\r\n');
            setValue({...value, abnfSyntax: convertedAbnf! + convertedAbnf!.endsWith('\r\n') ? '': '\r\n'})
            console.log(value);
            setErrorShow(false);
            setHangingMsgShow(true);
            setValidated(true);
        } else {
            setErrorShow(true);
        }
        e.preventDefault();
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
            {hangingMsgShow && <Alert variant="warning" onClose={() => setErrorShow(false)}>
                <Alert.Heading>Please hold this page! MRR is now validating your syntax</Alert.Heading>
                    <p>
                        More than 5 mins of processing time is expected to complete the validation. We strongly encourage you to leave this page. This page will check the process and notify you when it is done.
                    </p>
                </Alert>
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
                            }/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                            Root of namespace
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formAbnf">
                            <Form.Label>ABNF syntax</Form.Label>
                            <Form.Control as="textarea" rows={3} required onChange={
                                (e: any)=> setValue({...value, abnfSyntax: e.target.value})
                            }/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                            <a href="https://en.wikipedia.org/wiki/Augmented_Backus%E2%80%93Naur_form" target="_blank">Augmented Backus–Naur form</a> syntax for namespace
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegex">
                            <Form.Label>Regular expression</Form.Label>
                            <Form.Control required onChange={
                                (e: any)=> setValue({...value, regex: e.target.value})
                            }/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                            <Form.Text className="text-muted">
                            Regular expression form equivalent to the ABNF syntax above
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Namespace owner name</Form.Label>
                            <Form.Control required onChange={
                                (e: any)=> {
                                    const owner = value?.namespaceOwner? {... value?.namespaceOwner, name: e.target.value} : {name: e.target.value};
                                    setValue({...value, namespaceOwner: owner});
                                }
                            }/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Namespace owner e-mail</Form.Label>
                            <Form.Control required placeholder="name@example.com" onChange={
                                (e: any)=> {
                                    const owner = value?.namespaceOwner? {... value?.namespaceOwner, email: e.target.value} : {email: e.target.value};
                                    setValue({...value, namespaceOwner: owner});
                                }
                            }/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPhone">
                            <Form.Label>Namespace owner phone</Form.Label>
                            <Form.Control required onChange={
                                (e: any)=> {
                                    const owner = value?.namespaceOwner? {... value?.namespaceOwner, phone: e.target.value} : {phone: e.target.value};
                                    setValue({...value, namespaceOwner: owner});
                                }
                            }/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formUrl">
                            <Form.Label>Namespace owner URL</Form.Label>
                            <Form.Control required onChange={
                                (e: any)=> {
                                    const owner = value?.namespaceOwner? {... value?.namespaceOwner, url: e.target.value} : {url: e.target.value};
                                    setValue({...value, namespaceOwner: owner});
                                }
                            }/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formAddress">
                            <Form.Label>Namespace owner address</Form.Label>
                            <Form.Control required onChange={
                                (e: any)=> {
                                    const owner = value?.namespaceOwner? {... value?.namespaceOwner, address: e.target.value} : {address: e.target.value};
                                    setValue({...value, namespaceOwner: owner});
                                }
                            }/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formCountry">
                            <Form.Label>Namespace owner country</Form.Label>
                            <CountrySelect value={country} onChange={(val: any) => {
                                const owner = value?.namespaceOwner? {... value?.namespaceOwner, country: val && typeof val !== 'string' ? val.name : undefined} :
                                {country: val && typeof val !== 'string' ? val.name : undefined};
                                setValue({...value, namespaceOwner: owner});
                                setCountry(val);
                                }} onTextChange={() => {}}/>
                            <Form.Control.Feedback type="invalid">This field is mandatory</Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Row>
            </>
            }
            
        </Container>
    );
}