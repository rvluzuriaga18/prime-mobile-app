import {
  IonSplitPane,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonFooter,
  IonList,
  IonItem,
  IonLabel,
  IonAlert,
  IonAvatar,
  IonLoading
} from "@ionic/react";
import React, {useState, useEffect} from "react";
import OAuth2 from "fetch-mw-oauth2";
import Menu from "./Menu";

const ViewUsers: React.FC = () => {
  const uris = JSON.parse(window.localStorage.getItem("uri") || "");

  const [uri] = useState<any>(uris);
  const [userList, setUserList] = useState([]);

  const [showAlertBox, setAlertBox] = useState(false);
  const [showAlertMsg, setAlertMsg] = useState("");

  let [isDataLoaded, setDataIsLoaded] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!isDataLoaded){
      getUserList();
      setDataIsLoaded(true);
    }
  }, [])
  
  function getUserList(){
    setLoading(true);
    const tokenEndpoint = uri[0].url.tokenEndpoint;
    const getAllUsers = uri[0].url.getAllUsers;

    const oauth2 = new OAuth2({
      grantType: "password",
      clientId: "clientId101",
      clientSecret: "clientSecret101",
      userName: "admin",
      password: "system",
      tokenEndpoint: tokenEndpoint,
    });
  
    oauth2
      .fetch(getAllUsers,{method: "GET"})
      .then((response) => response.json())
      .then((data) => processSuccessResponse(data))
      .catch((error) => processFailedResponse(error));
  
      function processSuccessResponse(data: any){
        setLoading(false);
        setUserList(data);
      }
  
      function processFailedResponse(error: any) {    
          let message: string;
          setLoading(false);

          if (error.message === "Failed to fetch")
              message = "Unable to connect to the server.";
          else message = "Unable to retrieve list of users. Please contact the system administrator.";
  
          setAlertMsg(message);
          setAlertBox(true);
     }   
  }

  return (
    <IonSplitPane contentId="main">
      <Menu />
      <IonPage id="main">
        <IonHeader>
          <IonToolbar color="light">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Registered Users</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonList>
            {userList.map((value: any, i: any) => 
            <IonItem key={i}>
              <IonAvatar slot="start">
                <img src="../assets/img/avatar.svg" alt=""/>
              </IonAvatar>
              <IonLabel key={i}>{value.Title + ". " + value.FirstName + " " + value.LastName}</IonLabel>
            </IonItem>
            )}
          </IonList>
          <IonAlert
          isOpen={showAlertBox}
          onDidDismiss={() => setAlertBox(false)}
          header={"Message"}
          message={showAlertMsg}
          buttons={["Ok"]}
          cssClass="ion-text-center ion-alert-custom-class"
        />
        <IonLoading isOpen={isLoading} message={"Retrieving data. Please wait..."} /> 
        </IonContent>
        <IonFooter>
        <IonToolbar>
          <IonTitle className="ion-text-right" size="small">
            Prime v1.0
          </IonTitle>
        </IonToolbar>
        </IonFooter>
      </IonPage>
    </IonSplitPane>
  );
};

export default ViewUsers;
