import { useKeycloak } from "@react-keycloak/web";
import { useCallback, useEffect, useState } from "react";

export const useAuth = () => {
    const {keycloak, initialized} = useKeycloak();
  
    const [user, setUser] = useState({});
  
    // fetch user profile
    useEffect(() => {
      if (!initialized) {
        return;
      }
  
      const fetchUserInfo = async () => {
        try {
          const userProfile = await keycloak.loadUserProfile();
  
          setUser({ ...userProfile, fullName: `${userProfile.firstName} ${userProfile.lastName}` });
        } catch (err: any) {
          //setNotification({ isVisible: true, message: err.message });
        }
      };
  
      if (keycloak.authenticated) {
        fetchUserInfo();
      }
    }, [keycloak, initialized]);
  
    return {
      isAuthenticated: !!keycloak.authenticated,
      initialized,
      meta: {
        keycloak,
      },
      token: keycloak.token,
      user,
      manages_namespace: keycloak.tokenParsed?.manages_namespace,
      roles: keycloak.realmAccess,
      login: useCallback(() => { keycloak.login(); }, [keycloak]),
      logout: useCallback(() => { keycloak.logout(); }, [keycloak]),
      register: useCallback(() => { keycloak.register(); }, [keycloak]),
    };
  };