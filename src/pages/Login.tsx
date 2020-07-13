import {
  IonContent,
  IonHeader,
  IonFooter,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonIcon,
  IonAlert,
  IonLoading,
  IonList,
  IonItem,
  IonRow,
  IonCol
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { Plugins, Capacitor } from "@capacitor/core";
import OAuth2 from "fetch-mw-oauth2";
import { key, person, eye, eyeOff } from "ionicons/icons";
import "./Login.css";

const Login: React.FC = () => {
  let countries: [] = [];
  const type: string = "prod";

  const [uri, setUri] = useState<any>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [register, registerUser] = useState(false);

  const [showLoading, setShowLoading] = useState(false);
  const [showAlertBox, setAlertBox] = useState(false);
  const [showAlertMsg, setAlertMsg] = useState("");

  const [userIconColor, setUserIconColor] = useState("");
  const [passIconColor, setPassIconColor] = useState("");
  const [isToggled, setIsToggled] = useState(false);

  const togglePassword = () => setIsToggled(!isToggled);

  useEffect(() => {
    if (Capacitor.isNative) {
      Plugins.App.addListener("backButton", (e) => {
        if (window.location.pathname === "/login") Plugins.App.exitApp();
      });
    }
  });

  useEffect(() => {
    window.localStorage.setItem("uri", JSON.stringify(uri));
    window.localStorage.setItem("userDetailsColor", "primary");
    window.localStorage.setItem("viewUserDetailsColor", "medium");
  });

  fetch("../assets/app-config.json")
    .then((result) => result.json())
    .then((result: any) => {
      setUri(result.filter((data: any) => data.type === type));
  });

  fetch("../assets/countries.json")
    .then((result) => result.json())
    .then((result) => {
      countries = result;
  });

  function loginUser() {
    if (username.trim() === "" || password.trim() === "") {
      setAlertMsg("Please enter username and password.");
      setAlertBox(true);
    } else {
      setShowLoading(true);
      const tokenEndpoint = uri[0].url.tokenEndpoint;
      const getUserIdentity = uri[0].url.getUserIdentity;

      const oauth2 = new OAuth2({
        grantType: "password",
        clientId: "clientId101",
        clientSecret: "clientSecret101",
        userName: username,
        password: password,
        tokenEndpoint: tokenEndpoint,
      });

      oauth2
        .fetch(getUserIdentity, { method: "GET" })
        .then((response) => response.json())
        .then((data) => processSuccessResponse(data))
        .catch((error) => processFailedResponse(error))
        .finally(() => setShowLoading(false));
    }

    function processSuccessResponse(data: any){
      window.localStorage.setItem("personData", JSON.stringify(data));
      window.localStorage.setItem("password", password);
      window.localStorage.setItem("countries", JSON.stringify(countries));
      window.localStorage.setItem("menuUrl", "/home");
      setAuth(true);
    }

    function processFailedResponse(error: any) {
      let message: any;

      if (error.message === "Failed to fetch")
        message = "Unable to connect to the server.";
      else message = "Invalid username or password.";

      setAlertMsg(message);
      setAlertBox(true);
      setAuth(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Prime</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding ion-text-center">
        <IonList>
          <IonItem lines="none"></IonItem>  
          <IonItem lines="none"></IonItem>          
          <IonItem lines="none"></IonItem>
          <IonItem lines="none"></IonItem>
          <IonItem>
            <IonIcon icon={person} color={userIconColor} slot="start" />
            <IonInput
              onIonChange={(e: any) => setUsername(e.target.value)}
              onIonFocus={() => setUserIconColor("primary")}
              onIonBlur={() => setUserIconColor("medium")}
              placeholder="Username"
              className="ion-text-left"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonIcon icon={key} color={passIconColor} slot="start" />
            <IonInput
              onIonChange={(e: any) => setPassword(e.target.value)}
              onIonFocus={() => setPassIconColor("primary")}
              onIonBlur={() => setPassIconColor("medium")}
              type={isToggled === true ? "text" : "password"}
              placeholder="Password"
              className="ion-text-left"
            ></IonInput>
            <IonIcon
              icon={isToggled === true ? eye : eyeOff}
              onClick={togglePassword}
              color={isToggled === true ? "primary" : "medium"}
            />
          </IonItem>
        </IonList>
        <IonRow>
          <IonCol size="6">
            <IonButton
              onClick={() => loginUser()}
              className="ion-text-center"
              expand="block"
            >
              Login
            </IonButton>
          </IonCol>
          <IonCol size="6">
            <IonButton
              onClick={() => registerUser(true)}
              className="ion-text-center"
              color="success"
              expand="block"
            >
              Register
            </IonButton>
          </IonCol>
        </IonRow>
        <Route
          render={() => {
            return (
              auth && (
                <Redirect to={{ pathname: "/home", state: { auth: auth} }} />
              )
            );
          }}
        ></Route>
        <Route
          render={() => {
            return (
              register && (
                <Redirect
                  to={{
                    pathname: "/Registration",
                    state: { register: register },
                  }}
                />
              )
            );
          }}
        ></Route>
        <IonAlert
          isOpen={showAlertBox}
          onDidDismiss={() => setAlertBox(false)}
          header={"Message"}
          message={showAlertMsg}
          buttons={["Ok"]}
          cssClass="ion-text-center"
        />
        <IonLoading isOpen={showLoading} message={"Logging in..."} />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle className="ion-text-right" size="small">
            Prime v1.0
          </IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Login;
