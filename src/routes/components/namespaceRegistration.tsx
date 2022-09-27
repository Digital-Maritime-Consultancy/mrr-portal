import { useEffect, useState } from "react";
import { Button, Container, Form, Row, Spinner } from "react-bootstrap";
import CountrySelect from "react-bootstrap-country-select";
import { NamespaceSyntaxControllerApi, SyntaxCreationDTO, SyntaxCreationResult, SyntaxCreationResultCodeEnum } from "../../generated-client";
import { useBeforeunload } from 'react-beforeunload';
import { useAuth } from "../../auth/useAuth";
import { ErrorNoticer } from "./errorNoticer";
import keycloak from "../../auth/mrrKeycloak";
import { IContext, Mode } from "../../App";

export interface INamespaceRegistrationProp{
    context: IContext;
    setContext: (context: IContext) => void;
}

export const NamespaceRegistration = ({context, setContext}: INamespaceRegistrationProp) => {
    const [validated, setValidated] = useState(false);
    const [ country, setCountry ] = useState<any>("");
    const [errorShow, setErrorShow] = useState(false);
    const [hangingMsgShow, setHangingMsgShow] = useState(false);
    const [ value, setValue ] = useState<SyntaxCreationDTO>({});
    const [hanging, setHanging] = useState(false);
    const [errorHeader, setErrorHeader] = useState("");
    const [errorContent, setErrorContent] = useState("");
    const { token, initialized: authInitialized } = useAuth();
    const [trialCount, setTrialCount] = useState(0);
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

    const checkStatus = async(creationId: string, trialNumber: number, skipPause: boolean = false, result?: SyntaxCreationResult) => {
        if (result) {
            const code = result.code as SyntaxCreationResultCodeEnum;
            if (code === SyntaxCreationResultCodeEnum.OK) {
                setHanging(false);
                setContext({mode: Mode.SHOW_RESULT, namespace: result.namespace});
            } else if (code === SyntaxCreationResultCodeEnum.ERROR) {
                setHanging(false);
                setHangingMsgShow(false);
                setErrorShow(true);
                setErrorHeader(result.code! as string);
                setErrorContent(result.message! as string);
            } else {
                // something weird happened
            }
            return ;
        }
        setTrialCount(trialNumber);
        if (!skipPause) {
            // 20 sec wait
            await delay(20000);
        }
        
        // Do something after
        checkCreationStatus(creationId, trialNumber);
    };

    const checkCreationStatus = (creationId: string, trialNumber: number) => {
        syntaxApiHandler.getSyntaxCreationStatus(creationId, {headers: { Authorization: `Bearer ${token}` }})
            .then(res => 
                {
                    checkStatus(creationId, trialNumber + 1, false, (res.data as SyntaxCreationResult).code === SyntaxCreationResultCodeEnum.CREATING ? undefined : res.data);
                }
            )
            .catch(err => {
                setHanging(false);
                setErrorShow(true);
                if (err.response) {
                    if (err.response.data) {
                        setErrorHeader(err.response.data.error);
                        setErrorContent(err.response.data.message);
                    } else {
                        setErrorHeader(err.response.statusText);
                        setErrorContent(err.message);
                    }
                    
                    if (err.response.status === 401) {
                        alert("Token expired - You need to leave this page and login again!");
                        keycloak.login();
                    }
                } else {
                    setErrorHeader("Something went wrong");
                    setErrorContent("Server can't process your input with some reason.");
                }
            });
    }

    const handleSubmit = async(e: any) => {
        if (validate(value)) {
            const convertedAbnf = value.abnfSyntax?.replaceAll('\n', '\r\n');
            setValue({...value, abnfSyntax: convertedAbnf! + convertedAbnf!.endsWith('\r\n') ? '': '\r\n'});

            // call the api
            syntaxApiHandler.createNamespaceSyntax(value, {headers: { Authorization: `Bearer ${token}` }})
                .then(async (res) => {
                    setContext({mode: Mode.REGISTER_NAMESPACE, namespace: context.namespace, creationId: res.data});
                })
                .catch(err => {
                    setHanging(false);
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

    useEffect(() => {
        if (context.creationId) {
            const uuidRegex = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
            if (uuidRegex.test(context.creationId)) {
                setHanging(true);
                setHangingMsgShow(true);
                checkStatus(context.creationId, 0, true);
            } else {
                setErrorShow(true);
                setErrorHeader("Given creation ID is wrong");
                setErrorContent("You need to use a valid creation ID generated from the MRR.");
            }
        }
        setValue( {...value, parentNamespace: context.namespace});
    }, [context]);

    return (
        <Container style={{ textAlign: "left", padding: "1rem"}}>
            {errorShow && 
                <ErrorNoticer variant="danger" header={errorHeader}
                    content={errorContent}
                    setErrorShow={setErrorShow} />
            }
            {hangingMsgShow && 
                <ErrorNoticer variant="warning" header={"Please hold this page! MRR is now validating your syntax"}
                    content={"More than 5 minutes of processing time is expected. We strongly encourage you to don't leave this page before it is done. Number of checking: " + (trialCount)}
                    setErrorShow={setErrorShow} />
            }
            {context.namespace &&
            <>
                <Row>
                <h3>Register namespace</h3>
                </Row>
                <Row>
                    <Form validated={validated && typeof country !=='string'} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formNamespace">
                            <Form.Label>Namespace</Form.Label>
                            <Form.Control type="text" required placeholder={context.namespace + ':...'} onChange={
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