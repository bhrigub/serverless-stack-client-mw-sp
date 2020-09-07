import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Login.css";
import ReCAPTCHA from 'react-google-recaptcha'

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });
  const recaptchaRef = React.createRef();
  //const [isBot]=useState(false);
	
  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;	
  }
	/* var verifyCallback = function (response) {
		console.log(response);
		if (response){
		isBot(true);}
		console.log(isBot);
		validateForm();
	};
	function callbackFun(){
		console.log('Captcha Done');
	} */
  async function handleSubmit(event) {
    event.preventDefault();
    
	//recaptcha
	const recaptchaValue = recaptchaRef.current.getValue();   
    
    if(!recaptchaValue.length) {
        alert('Verify human existence using Recaptcha')
        return
	}
	setIsLoading(true);
    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
		<ReCAPTCHA
			ref = {recaptchaRef}
			sitekey = "6LfJ8McZAAAAAKosOVKpJj0Tl0C6k6YRugeiQVDb"
		/>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
		
		
      </form>
    </div>
  );
}