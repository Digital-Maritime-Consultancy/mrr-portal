import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import keycloak from "../../auth/mrrKeycloak";
import { useAuth } from "../../auth/useAuth";

export const ProtectedRoute = ({ children }: any) => {
    const { token, initialized: authInitialized } = useAuth();

    useEffect(() => {}, [keycloak]);
   
    return keycloak.authenticated ? children : <div className={"p-3"}><Spinner animation="border" role="status"></Spinner></div>;
   };