import { Alert } from "react-bootstrap";

export interface ErrorNoticerProp{
    header: string;
    content: string;
    setErrorShow: (value: boolean) => void;
}

export const ErrorNoticer = ({header, content, setErrorShow}: ErrorNoticerProp) => {
    return (
        <Alert variant="danger" onClose={() => setErrorShow(false)} dismissible>
            <Alert.Heading>{header}</Alert.Heading>
            <p>{content}</p>
        </Alert>
    );
}