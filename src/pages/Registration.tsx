import {
  IonContent,
  IonHeader,
  IonFooter,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItem,
  IonRow,
  IonCol,
  IonRadioGroup,
  IonRadio,
  IonAlert,
  IonLoading
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import "./Registration.css";
import OAuth2 from "fetch-mw-oauth2";

const Registration: React.FC = () => {
  const uri = JSON.parse(window.localStorage.getItem("uri") || "");

  const [countries, setCountries] = useState([]);
  const [cancelReg, cancelRegistration] = useState(false);

  const [showAlertBox, setAlertBox] = useState(false);
  const [showAlertMsg, setAlertMsg] = useState("");

  const [showAlertSuccess, setAlertSuccess] = useState(false);
  const [showAlertSuccessMsg, setAlertSuccessMsg] = useState("");
  const [showAlertFailed, setAlertFailed] = useState(false);
  const [showAlertFailedMsg, setAlertFailedMsg] = useState("");

  const [showLoading, setShowLoading] = useState(false);

  const [isUserNameEmpty, setUserName] = useState(true);
  const [isPasswordEmpty, setPassword] = useState(true);
  const [isCPasswordEmpty, setCPassword] = useState(true);
  const [isTitleEmpty, setTitle] = useState(true);
  const [isFirstNameEmpty, setFirstName] = useState(true);
  const [isLastNameEmpty, setLastName] = useState(true);
  const [isAgeEmpty, setAge] = useState(true);
  const [isAddressEmpty, setAddress] = useState(true);
  const [isCityEmpty, setCity] = useState(true);
  const [isPostalCodeEmpty, setPostalCode] = useState(true);
  const [isCountryEmpty, setCountry] = useState(true);

  const personState = {
    username: "",
    password: "",
    cpassword: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    age: "",
    addressLine1: "",
    addressLine2: null,
    city: "",
    postalCode: "",
    countryRegionCode: "",
    addressType: 5,
  };

  const [person, setPerson] = useState(personState);

  useEffect(() => {
    fetch("../assets/countries.json")
      .then((result) => result.json())
      .then((result) => {
        setCountries(result);
      });
  }, []);

  function register() {
    let errorMsg: string = "";

    if (person.username.trim().length === 0){
      errorMsg = "Please input Username.";
      setUserName(false);
    }
    else if (person.password.trim().length === 0){
      errorMsg = "Please input Password.";
      setPassword(false);
    }
    else if (person.cpassword.trim().length === 0){
      errorMsg = "Please input Confirm Password.";
      setCPassword(false);
    }
    else if (person.password !== person.cpassword){
      errorMsg = "Password did not match.";
      setPassword(false);
      setCPassword(false);
    }
    else if (person.firstName.trim().length === 0){
      errorMsg = "Please input First Name.";
      setFirstName(false);
    }
    else if (person.lastName.trim().length === 0){
      errorMsg = "Please input Last Name.";
      setLastName(false);
    }
    else if (person.addressLine1.trim().length === 0){
      errorMsg = "Please input Address.";
      setAddress(false);
    }
    else if (person.city.trim().length === 0){
      errorMsg = "Please input City / Province.";
      setCity(false);
    }
    else if (person.postalCode.trim().length === 0){
      errorMsg = "Please input valid Postal Code.";
      setPostalCode(false);
    }
    else if (person.countryRegionCode.length === 0){
      errorMsg = "Please select Country.";
      setCountry(false);
    }
    else if (person.title.length === 0){
      errorMsg = "Please select Gender.";
      setTitle(false);
    }
    else if (person.age.trim().length === 0){
      errorMsg = "Please input valid Age.";
      setAge(false);
    }
   
    if(errorMsg !== ""){
      setAlertMsg(errorMsg);
      setAlertBox(true);
    }    
    else {
      setShowLoading(true);

      const tokenEndpoint = uri[0].url.tokenEndpoint;
      const registerUser = uri[0].url.registerUser;
      
      const oauth2 = new OAuth2({
        grantType: "password",
        clientId: "clientId101",
        clientSecret: "clientSecret101",
        userName: 'admin',
        password: 'system',
        tokenEndpoint: tokenEndpoint,
      });

      // Mapping
      const mappedRequest: any = {
        "Username": person.username,
        "Password": person.password,
        "Person": {
          "Title": person.title,
          "FirstName": person.firstName,
          "MiddleName": person.middleName,
          "LastName": person.lastName,
          "Suffix": person.suffix,
          "Age": person.age
        },
        "PersonAddresses":[{
          "AddressLine1": person.addressLine1,
          "AddressLine2": person.addressLine2,
          "City": person.city,
          "PostalCode": person.postalCode,
          "CountryRegionCode": person.countryRegionCode,
          "AddressTypeId": person.addressType
        }]
      };
      
      const jsonString = JSON.stringify(mappedRequest);
      const request = JSON.parse(jsonString);

      oauth2
      .fetch(registerUser,{method: "POST",
                              headers: {  'Content-Type': 'application/json'}, 
                              body: JSON.stringify(request)})
      .then((response) => response.json())
      .then((data) => processSuccessResponse(data))
      .catch((error) => processFailedResponse(error));
    }

    function processSuccessResponse(data: any){
      setShowLoading(false);

      if(data.IsSuccess){
        setAlertSuccessMsg("Record successfully saved.");
        setAlertSuccess(true);
      }
      else{
        setAlertMsg(data.Message);
        setAlertBox(true);
      }
    }

    function processFailedResponse(error: any) {
      let message: any;
      setShowLoading(false);

      if (error.message === "Failed to fetch")
        message = "Unable to connect to the server.";
      else message = "Unable to save your data. Please contact the system administrator.";

      setAlertFailedMsg(message);
      setAlertFailed(true);
    }
  }
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Registration</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem style={isUserNameEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isUserNameEmpty ? "medium" : "danger"}>
              Username *
            </IonLabel>
            <IonInput
              onIonFocus={() => setUserName(true)}
              onIonChange={(e: any) =>
                setPerson({ ...person, username: e.target.value })
              }
              maxlength={50}
            ></IonInput>
          </IonItem>
          <IonItem style={isPasswordEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isPasswordEmpty ? "medium" : "danger"}>
              Password *
            </IonLabel>
            <IonInput
              onIonFocus={() => setPassword(true)}
              onIonChange={(e: any) =>
                setPerson({ ...person, password: e.target.value })
              }
              type="password"
              maxlength={100}
            ></IonInput>
          </IonItem>
          <IonItem style={isCPasswordEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isCPasswordEmpty ? "medium" : "danger"}>
              Confirm Password *
            </IonLabel>
            <IonInput
              onIonFocus={() => setCPassword(true)}
              onIonChange={(e: any) =>
                setPerson({ ...person, cpassword: e.target.value })
              }
              type="password"
              maxlength={100}
            ></IonInput>
          </IonItem>
          <IonItem style={isFirstNameEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isFirstNameEmpty ? "medium" : "danger"}>
              First Name *
            </IonLabel>
            <IonInput
              onIonFocus={() => setFirstName(true)}
              onIonChange={(e: any) =>
                setPerson({ ...person, firstName: e.target.value })
              }
              maxlength={100}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="medium">
              Middle Name
            </IonLabel>
            <IonInput
              onIonChange={(e: any) =>
                setPerson({ ...person, middleName: e.target.value })
              }
              maxlength={100}
            ></IonInput>
          </IonItem>
          <IonItem style={isLastNameEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isLastNameEmpty ? "medium" : "danger"}>
              Last Name *
            </IonLabel>
            <IonInput
              onIonFocus={() => setLastName(true)}
              onIonChange={(e: any) =>
                setPerson({ ...person, lastName: e.target.value })
              }
              maxlength={100}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="medium">
              Suffix
            </IonLabel>
            <IonInput
              onIonChange={(e: any) =>
                setPerson({ ...person, suffix: e.target.value })
              }
              maxlength={10}
            ></IonInput>
          </IonItem>
          <IonItem style={isAddressEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isAddressEmpty ? "medium" : "danger"}>
              Address *
            </IonLabel>
            <IonInput
              onIonFocus={() => setAddress(true)}
              onIonChange={(e: any) =>
                setPerson({ ...person, addressLine1: e.target.value })
              }
              maxlength={60}
            ></IonInput>
          </IonItem>
          <IonItem style={isCityEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isCityEmpty ? "medium" : "danger"}>
              City / Province *
            </IonLabel>
            <IonInput
              onIonFocus={() => setCity(true)}
              onIonChange={(e: any) =>
                setPerson({ ...person, city: e.target.value })
              }
              maxlength={30}
            ></IonInput>
          </IonItem>
          <IonItem style={isPostalCodeEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isPostalCodeEmpty ? "medium" : "danger"}>
              Postal Code *
            </IonLabel>
            <IonInput
              onIonFocus={() => setPostalCode(true)}
              value={person.postalCode}
              onIonInput={(e: any) =>
                isNaN(Number(e.target.value))
                  ? e.preventDefault()
                  : setPerson({ ...person, postalCode: e.target.value })
              }
              maxlength={15}
            ></IonInput>
          </IonItem>
          <IonItem style={isCountryEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isCountryEmpty ? "medium" : "danger"}>
              Country *
            </IonLabel>
            <IonSelect
              onIonFocus={() => setCountry(true)}
              onIonChange={(e: any) =>
                setPerson({ ...person, countryRegionCode: e.target.value })
              }
              interface="action-sheet"
            >
              {countries.map((e: any, i: any) => (
                <IonSelectOption key={i} value={e.code}>{e.name}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonRadioGroup>
            <IonItem lines="none">
              <IonLabel color={isTitleEmpty ? "medium" : "danger"}>Gender *</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel color="medium">Male</IonLabel>
              <IonRadio
                onIonFocus={() => setTitle(true)}
                onClick={(e: any) =>
                  setPerson({ ...person, title: e.target.value })
                }
                color="primary"
                value="Mr"
                slot="end"
              ></IonRadio>
            </IonItem>
            <IonItem>
              <IonLabel color="medium">Female</IonLabel>
              <IonRadio
                onIonFocus={() => setTitle(true)}
                onClick={(e: any) =>
                  setPerson({ ...person, title: e.target.value })
                }
                color="primary"
                value="Ms"
                slot="end"
              ></IonRadio>
            </IonItem>
          </IonRadioGroup>
          <IonItem lines="none" style={isAgeEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isAgeEmpty ? "medium" : "danger"}>
              Age *
            </IonLabel>
            <IonInput
              value={person.age}
              onIonFocus={() => setAge(true)}
              onIonInput={(e: any) =>
                isNaN(Number(e.target.value))
                  ? e.preventDefault()
                  : setPerson({ ...person, age: e.target.value })
              }
              maxlength={3}
            ></IonInput>
          </IonItem>
        </IonList>     
        <Route
          render={() => {
            return (
              cancelReg && (
                <Redirect
                  to={{
                    pathname: "/login",
                    state: { register: false, cancelReg: false },
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
          cssClass="ion-text-center ion-alert-custom-class"
        />
        <IonAlert
          isOpen={showAlertSuccess}
          onDidDismiss={() => setAlertSuccess(false)}
          header={"Message"}
          message={showAlertSuccessMsg}
          cssClass="ion-text-center ion-alert-custom-class"
          buttons={[
            {
              text: 'Ok',
              handler: () => {
                cancelRegistration(true)
              }
            }
          ]}
        />        
        <IonAlert
          isOpen={showAlertFailed}
          onDidDismiss={() => setAlertFailed(false)}
          cssClass="ion-text-center ion-alert-custom-class"
          header={"Message"}
          message={showAlertFailedMsg}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              handler: blah => {
                console.log("Cancelled");
              }
            },
            {
              text: 'Retry',
              handler: () => {
                register()
              }
            }
          ]}
        />        
        <IonLoading isOpen={showLoading} message={"Saving your record. Please wait..."} />           
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonRow>
            <IonCol size="6">
              <IonButton
                onClick={() => register()}
                className="ion-text-center"
                expand="block"
                color="success"
              >
                Register
              </IonButton>
            </IonCol>
            <IonCol size="6">
              <IonButton
                onClick={() => cancelRegistration(true)}
                className="ion-text-center"
                color="medium"
                expand="block"
              >
                Cancel
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Registration;
