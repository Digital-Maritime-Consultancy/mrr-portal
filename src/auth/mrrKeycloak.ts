import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
 url: "https://test-maritimeid.maritimeconnectivity.net/auth",
 realm: "MCP",
 clientId: "MCP-Portal",
});

export default keycloak;