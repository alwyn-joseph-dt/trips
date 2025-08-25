import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const routeTitles: { [key: string]: string } = {
      "/login": "Login",
      "/dashboard": "Dashboard",
      "/roles": "Roles",
      "/users": "Users",
      "/markets": "Markets",
      "/acl": "Acl",
      "/addorg": "Addorg",
      "/email-template": "Email-Template",
      "/email-template-editor": "Email-Template-Editor",
      "/user/update": "UserUpdate",
      "/user/creat": "UserCreat",
      "/flight-search": "Flight-Search",
      "/checkout": "Checkout",
      "/checkout-rules": "Checkout-rules",
      "/CheckoutTerms": "CheckoutTerms",
      "/CheckOutPrivacy": "CheckOutPrivacy",
      "/payment": "Payment",
      "/bookdetail": "BookDetails",
      "/travel-policy": "TravelPolicy",
    }

    document.title = routeTitles[location.pathname] || "Musafir";
  }, [location]);
};

export default useTitle;
