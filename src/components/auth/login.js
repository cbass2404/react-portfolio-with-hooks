import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleChange = (e) => {
    [e.target.name] == "email"
      ? setEmail(e.target.value)
      : setPassword(e.target.value);
    setErrorText("");
  };

  const handleSubmit = (e) => {
    axios
      .post(
        "https://api.devcamp.space/sessions",
        {
          client: {
            email: email,
            password: password,
          },
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.status === "created") {
          props.handleSuccessfulAuth();
        } else {
          setErrorText("Wrong email or password");
          props.handleUnsuccessfulAuth();
        }
      })
      .catch(() => {
        setErrorText("An error occurred...");

        props.handleUnsuccessfulAuth();
      });

    e.preventDefault();
  };

  return (
    <div>
      <h1>LOGIN TO ACCESS YOUR DASHBOARD</h1>

      <div>{errorText}</div>

      <form onSubmit={handleSubmit} className="auth-form-wrapper">
        <div className="form-group">
          <FontAwesomeIcon icon="envelope" />

          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <FontAwesomeIcon icon="lock" />

          <input
            type="password"
            name="password"
            placeholder="Your password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
