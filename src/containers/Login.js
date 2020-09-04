import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import Recaptcha from "react-recaptcha";
import "./Login.css";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });
  const {isBot}=useState(false);
	
  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0 && isBot;	
  }
	function verifyCallback(response){
		if (response){
			isBot(true);
		}
	}
	function callbackFun(){
		
	}
  async function handleSubmit(event) {
    event.preventDefault();
	
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
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
		<Recaptcha
			sitekey="6LeL7scZAAAAAKDot3OxylOqwIp-PVsiLSGzdlld"
			render="explicit"
			onloadCallback={callbackFun}
			verifyCalback={verifyCallback}
		  />
		
      </form>
    </div>
  );
}