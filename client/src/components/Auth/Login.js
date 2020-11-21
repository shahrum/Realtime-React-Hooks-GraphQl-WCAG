import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Context from "../../context";
import { ME_QUERY } from "../../graphql/queries";
import { BASE_URL } from "../../client";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSuccess = async (googleUser) => {
    try {
      const id_token = googleUser.getAuthResponse().id_token;
      console.log(id_token);
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: id_token },
      });
      const { me } = await client.request(ME_QUERY);
      console.log("data.me", me);
      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn });
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = (error) => console.error("Error logging in", error);
  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66, 133, 244)" }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId="664012434037-4ub12eud5d77t7ic429bgmflejsvkln7.apps.googleusercontent.com"
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
        theme="dark"
        buttonText="Login with Google"
      />
    </div>
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
