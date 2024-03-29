import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSplitPane,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonRadioGroup,
  IonRadio,
  IonButtons,
  IonButton,
  IonFooter,
  IonRow,
  IonCol,
  IonAlert,
  IonLoading
} from "@ionic/react";
import React, {useState} from "react";
import OAuth2 from "fetch-mw-oauth2";
import Menu from "./Menu";
import "./Home.css";

const Home: React.FC = () => {

  const uri = JSON.parse(window.localStorage.getItem("uri") || "");
  const pwd = window.localStorage.getItem("password") || "";
  const data = JSON.parse(window.localStorage.getItem("personData") || "");
  const listOfCountry = JSON.parse(window.localStorage.getItem("countries") || "");

  const [countries] = useState<[]>(listOfCountry);

  const [showAlertBox, setAlertBox] = useState(false);
  const [showAlertMsg, setAlertMsg] = useState("");
  const [showAlertSuccess, setAlertSuccess] = useState(false);
  const [showAlertSuccessMsg, setAlertSuccessMsg] = useState("");
  const [showAlertFailed, setAlertFailed] = useState(false);
  const [showAlertFailedMsg, setAlertFailedMsg] = useState("");
  const [showLoading, setShowLoading] = useState(false);

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

  const [businessEntityId] = useState<number>(data.BusinessEntityId);
  const [username] = useState(String(data.Username));
  const [password, setPasswordValue] = useState(pwd);
  const [cpassword, setCPasswordValue] = useState(pwd);
  const [title, setTitleValue] = useState(String(data.Person.Title));
  const [firstName, setFirstNameValue] = useState(String(data.Person.FirstName));
  const [middleName, setMiddleNameValue] = useState(data.Person.MiddleName != null ? String(data.Person.MiddleName) : "");
  const [lastName, setLastNameValue] = useState(String(data.Person.LastName));
  const [suffix, setSuffixValue] = useState(data.Person.Suffix != null ? String(data.Person.Suffix) : "");
  const [age, setAgeValue] = useState(String(data.Person.Age));
  const [addressLine1, setAddressLine1Value] = useState(String(data.PersonAddresses[0].AddressLine1));
  const [city, setCityValue] = useState(String(data.PersonAddresses[0].City));
  const [postalCode, setPostalCodeValue] = useState(String(data.PersonAddresses[0].PostalCode));
  const [countryRegionCode, setCountryRegionCodeValue] = useState(data.PersonAddresses[0].CountryRegionCode);
  const [addressType] = useState(5);

  function update() {
    let errorMsg: string = "";

    if (password.trim().length === 0){
      errorMsg = "Please input Password.";
      setPassword(false);
    }
    else if (cpassword.trim().length === 0){
      errorMsg = "Please input Confirm Password.";
      setCPassword(false);
    }
    else if (password !== cpassword){
      errorMsg = "Password did not match.";
      setPassword(false);
      setCPassword(false);
    }
    else if (firstName.trim().length === 0){
      errorMsg = "Please input First Name.";
      setFirstName(false);
    }
    else if (lastName.trim().length === 0){
      errorMsg = "Please input Last Name.";
      setLastName(false);
    }
    else if (addressLine1.trim().length === 0){
      errorMsg = "Please input Address.";
      setAddress(false);
    }
    else if (city.trim().length === 0){
      errorMsg = "Please input City / Province.";
      setCity(false);
    }
    else if (postalCode.trim().length === 0){
      errorMsg = "Please input valid Postal Code.";
      setPostalCode(false);
    }
    else if (countryRegionCode.length === 0){
      errorMsg = "Please select Country.";
      setCountry(false);
    }
    else if (title.length === 0){
      errorMsg = "Please select Gender.";
      setTitle(false);
    }
    else if (age.trim().length === 0){
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
      const updateUser = uri[0].url.updateUser;
      
      const oauth2 = new OAuth2({
        grantType: "password",
        clientId: "clientId101",
        clientSecret: "clientSecret101",
        userName: "admin",
        password: "system",
        tokenEndpoint: tokenEndpoint,
      });

      // Mapping
      const mappedRequest: any = {
        "BusinessEntityId": businessEntityId,
        "Username": username,
        "Password": password,
        "Person": {
          "BusinessEntityId": businessEntityId,          
          "Title": title,
          "FirstName": firstName,
          "MiddleName": middleName !== "" ? middleName : null,
          "LastName": lastName,
          "Suffix": suffix !== "" ? suffix : null,
          "Age": age
        },
        "PersonAddresses":[{
          "BusinessEntityId": businessEntityId,
          "AddressLine1": addressLine1,
          "AddressLine2": null,
          "City": city,
          "PostalCode": postalCode,
          "CountryRegionCode": countryRegionCode,
          "AddressTypeId": addressType
        }]
      };
      
      const jsonString = JSON.stringify(mappedRequest);
      const request = JSON.parse(jsonString);

      oauth2
      .fetch(updateUser,{method: "POST",
                              headers: {  'Content-Type': 'application/json'}, 
                              body: JSON.stringify(request)})
      .then((response) => response.json())
      .then((data) => processSuccessResponse(data))
      .catch((error) => processFailedResponse(error));
    }

    function processSuccessResponse(data: any){
      setShowLoading(false); 
      if (data.IsSuccess){
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
      else message = "Unable to update your data. Please contact the system administrator.";

      setAlertFailedMsg(message);
      setAlertFailed(true);
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
            <IonTitle>User Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
        <IonList>
          <IonItem>
            <IonLabel position="floating">
              Username *
            </IonLabel>
            <IonInput value={username} disabled={true}></IonInput>
          </IonItem>
          <IonItem style={isPasswordEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isPasswordEmpty ? "medium" : "danger"}>
              Password *
            </IonLabel>
            <IonInput
              value={password}
              onIonFocus={() => setPassword(true)}
              onIonInput={(e: any) =>
                setPasswordValue(e.target.value)
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
              value={cpassword}
              onIonFocus={() => setCPassword(true)}
              onIonInput={(e: any) =>
                setCPasswordValue(e.target.value)
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
              value={firstName}
              onIonFocus={() => setFirstName(true)}
              onIonInput={(e: any) =>
                setFirstNameValue(e.target.value)
              }
              maxlength={100}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="medium">
              Middle Name
            </IonLabel>
            <IonInput
              value={middleName}
              onIonInput={(e: any) =>
                setMiddleNameValue(e.target.value)
              }
              maxlength={100}
            ></IonInput>
          </IonItem>
          <IonItem style={isLastNameEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isLastNameEmpty ? "medium" : "danger"}>
              Last Name *
            </IonLabel>
            <IonInput
             value={lastName}
              onIonFocus={() => setLastName(true)}
              onIonInput={(e: any) =>
                setLastNameValue(e.target.value)
              }
              maxlength={100}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="medium">
              Suffix
            </IonLabel>
            <IonInput
              value={suffix}
              onIonInput={(e: any) =>
                setSuffixValue(e.target.value)
              }
              maxlength={10}
            ></IonInput>
          </IonItem>
          <IonItem style={isAddressEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isAddressEmpty ? "medium" : "danger"}>
              Address *
            </IonLabel>
            <IonInput
              value={addressLine1}
              onIonFocus={() => setAddress(true)}
              onIonInput={(e: any) =>
                setAddressLine1Value(e.target.value)
              }
              maxlength={60}
            ></IonInput>
          </IonItem>
          <IonItem style={isCityEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isCityEmpty ? "medium" : "danger"}>
              City / Province *
            </IonLabel>
            <IonInput
              value={city}
              onIonFocus={() => setCity(true)}
              onIonInput={(e: any) =>
                setCityValue(e.target.value)
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
              value={postalCode}
              onIonInput={(e: any) =>
                isNaN(Number(e.target.value))
                  ? e.preventDefault()
                  : setPostalCodeValue(e.target.value)
              }
              maxlength={15}
            ></IonInput>
          </IonItem>
          <IonItem style={isCountryEmpty ? {"--border-color": "#dedede"} : {"--border-color": "#eb445a"}}>
            <IonLabel position="floating" color={isCountryEmpty ? "medium" : "danger"}>
              Country *
            </IonLabel>
            <IonSelect
              value={countryRegionCode}
              onIonFocus={() => setCountry(true)}
              onIonChange={(e: any) =>
                setCountryRegionCodeValue(e.target.value) 
              }
              interface="action-sheet"
            >
              {countries.map((e: any, i: any) => (
                <IonSelectOption key={i} value={e.code}>{e.name}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonRadioGroup value={title}>
            <IonItem lines="none">
              <IonLabel color={isTitleEmpty ? "medium" : "danger"}>Gender *</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel color="medium">Male</IonLabel>
              <IonRadio
                onIonFocus={() => setTitle(true)}
                onClick={(e: any) =>
                  setTitleValue(e.target.value)
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
                  setTitleValue(e.target.value)
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
              value={age}
              onIonFocus={() => setAge(true)}
              onIonInput={(e: any) =>
                isNaN(Number(e.target.value))
                  ? e.preventDefault()
                  : setAgeValue(e.target.value)
              }
              maxlength={3}
            ></IonInput>
          </IonItem>
        </IonList>               
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
                console.log("Ok");
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
                update();
              }
            }
          ]}
        />        
        <IonLoading isOpen={showLoading} message={"Updating your record. Please wait..."} /> 
        </IonContent>
        <IonFooter>
        <IonToolbar>
          <IonRow>
            <IonCol>
              <IonButton
                onClick={() => update()}
                className="ion-text-center"
                expand="block"
                color="success"
              >
                Update
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
      </IonPage>
    </IonSplitPane>
  );
};

export default Home;
