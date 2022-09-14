import { useKeycloak } from "@react-keycloak/web";

const PrivateRoute = ({ children }: any) => {
 const { keycloak } = useKeycloak();

 const isLoggedIn = keycloak.authenticated;

 return isLoggedIn ? children : "You need to login to see the webpage";
};

export default PrivateRoute;