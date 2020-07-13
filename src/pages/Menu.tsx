import {
  IonMenu,
  IonMenuToggle,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonLoading
} from "@ionic/react";
import React, {useState} from "react";
import { Redirect, Route } from "react-router-dom";
import { person, peopleCircleOutline, arrowBackCircleOutline } from "ionicons/icons";

const Menu: React.FC = () => {
  const [isRedirect, setRedirectValue] = useState(false);
  const [isLoading, setLoadingValue] = useState(false);
  const [url, setUrl] = useState("");

  function setUrlLink(url: string){
    let urlValue = window.localStorage.getItem("menuUrl") ?? "";
    
    if (urlValue !== url) {
      if (url !== "/home"){
        setLoadingValue(false);
        window.localStorage.setItem("userDetailsColor", "medium");
        window.localStorage.setItem("viewUserDetailsColor", "primary");
      }
      else{
        setLoadingValue(true);
        window.localStorage.setItem("viewUserDetailsColor", "medium");
        window.localStorage.setItem("userDetailsColor", "primary");
      }

      setUrl(url);
      setRedirectValue(true);
    }

    window.localStorage.setItem("menuUrl", url);
  }

  function getUserDetailsColor(){
    const color = window.localStorage.getItem("userDetailsColor") ?? "";
    return color;
  }

  function getViewUserDetailsColor(){
    const color = window.localStorage.getItem("viewUserDetailsColor") ?? "";
    return color;
  }

  return (
    <>     
      <IonMenu side="start" contentId="main">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonMenuToggle auto-hide="true">
              <IonItem onClick={() => setUrlLink("/home")}>
                <IonIcon icon={person} slot="start" color={getUserDetailsColor()}/>
                <IonLabel color={getUserDetailsColor()}>User Details</IonLabel>  
              </IonItem>
              <IonItem onClick={() => setUrlLink("/viewUsers")}>
                <IonIcon icon={peopleCircleOutline} slot="start" color={getViewUserDetailsColor()} />
                <IonLabel color={getViewUserDetailsColor()}>View Users</IonLabel>
              </IonItem>
              <IonItem onClick={() => setUrlLink("/login")}>
                <IonIcon icon={arrowBackCircleOutline} slot="start" color="medium"/>
                <IonLabel color="medium">Sign Out</IonLabel> 
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>   
      <Route
        render={() => {
          return (
            isRedirect && (
              <Redirect
                to={{
                  pathname: url,
                  state: {isRedirect: false, auth: false, logout: false}
                }}
              />
            )
          );
        }}
      ></Route>   
      <IonLoading isOpen={isLoading} message={"Retrieving data. Please wait..."} />      
    </>
  );
};

export default Menu;
