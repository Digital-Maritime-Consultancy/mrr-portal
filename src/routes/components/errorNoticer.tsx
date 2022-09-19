import { Alert } from "react-bootstrap";

export interface ErrorNoticerProp{
    variant: string;
    header: string;
    content: string;
    setErrorShow: (value: boolean) => void;
}

export const ErrorNoticer = ({variant, header, content, setErrorShow}: ErrorNoticerProp) => {
    return (
        <Alert variant={variant} onClose={() => setErrorShow(false)} dismissible>
            <Alert.Heading>{header}</Alert.Heading>
            <p>{content}</p>
        </Alert>
    );
}