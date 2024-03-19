import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "@aws-amplify/ui-react/styles/reset.layer.css"; // global CSS reset
import "@aws-amplify/ui-react/styles/base.layer.css"; // base styling needed for Amplify UI
import "@aws-amplify/ui-react/styles/button.layer.css"; // component specific styles
import awsConfig from "./awsConfig";
import { Amplify } from "aws-amplify";
import { Button } from "@aws-amplify/ui-react";
import { signOut } from "@aws-amplify/auth";
import { useState, useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import style from "./styles.module.css";
import axios from "axios";

export const App = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolClientId: awsConfig.USER_POOL_APP_CLIENT_ID,
        userPoolId: awsConfig.USER_POOL_ID,
        loginWith: {
          username: "false",
          email: "true",
          phone: "false",
        },
      },
    },
  });

  const [token, setToken] = useState("");
  const [userData, setUserData] = useState("");
  const API_URL =
    "http://agroex-elb-446797069.us-east-1.elb.amazonaws.com/team3/api/categories";

  const goToSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.log("Something went wrong during signOut");
    }
  };

  // const getUserData = async (token) => {
  //   axios.get(API_URL, config).then(console.log).catch(console.log);
  // };

  // const postTestDataToDB = (token) => {
  //   const postConfig = {
  //     headers: { Authorization: `Bearer ${token}` },
  //   };
  //   const body = {
  //     data: {
  //       first_name: "SomeFirstName",
  //       last_name: "SomeLastName",
  //       preferred_currency: "USD",
  //       phoneNumber: "+375 59 585-78-67",
  //     },
  //     avatar:
  //       "https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg",
  //   };
  //   axios
  //     .post(
  //       "http://agroex-elb-446797069.us-east-1.elb.amazonaws.com/team3/api/users",
  //       body,
  //       postConfig
  //     )
  //     .then(console.log)
  //     .catch(console.log);
  // };

  const getUser = async () => {
    try {
      const result = await fetchAuthSession({ forceRefresh: true });
      const token = result.tokens.idToken.toString();
      if (token) setToken(token);
    } catch (e) {
      console.log("Something went wrong during getUser");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className={style.logedInwrapper}>
      <Authenticator loginMechanisms={["email"]}>
        <div className={style.logedInwrapper}>
          <Button variation="primary" onClick={() => goToSignOut()}>
            SignOut
          </Button>
          {/* <Button variation="primary" onClick={() => postTestDataToDB(token)}>
            Post Test data to DB
          </Button> */}
        </div>
        <div className={style.text}>
          <p>ID_TOKEN</p>
          {token}
        </div>
      </Authenticator>
    </div>
  );
};

export default App;
