import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";
import Context from "../../context";
const ME_QUERY = `{
  me {
    _id
    name
    email
    picture
  }
}`;
const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSuccess = async (googleUser) => {
    console.log(googleUser);
    const id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
    const client = new GraphQLClient("http://localhost:4000/graphql", {
      headers: { authorization: id_token },
    });
    const data = await client.request(ME_QUERY);
    console.log("data", data);
    dispatch({ type: "LOGIN_USER", payload: data.me });
  };
  return (
    <GoogleLogin
      clientId="664012434037-4ub12eud5d77t7ic429bgmflejsvkln7.apps.googleusercontent.com"
      onSuccess={onSuccess}
      isSignedIn={true}
    />
    // <div className="g-signin2" onsuccess={onSignIn} />
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default withStyles(styles)(Login);
