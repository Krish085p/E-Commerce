import React, { useState } from "react";
import "./CSS/LoginSignup.css";
const apiUrl = import.meta.env.VITE_API_URL;

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [agree, setAgree] = useState(false);

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckbox = () => {
    setAgree(!agree);
  };

  const login = async () => {
    setError(""); // Clear any previous errors
    console.log("Login function Executed");
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("auth-token", data.token); // Correct method to set localStorage item
        window.location.replace("/");
      } else {
        setError(data.error || "Login failed"); // Check for error field in response
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred during login. Please try again.");
    }
  };
  

  const signup = async () => {
    setError(""); // Clear any previous errors
    console.log("Sign Up function Executed", formData);
    
    try {
      const response = await fetch(`${apiUrl}/api/signup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("auth-token", data.token); // Correct method to set localStorage item
        // Redirect to homepage or dashboard after successful signup
        window.location.replace("/"); // Replace with history.push("/") if using React Router
      } else {
        setError(data.error || "Signup failed"); // Check for error field in response
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setError("An error occurred during signup. Please try again.");
    }
  };
  

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
        </div>
        <button
          onClick={() => {
            if (agree) {
              state === "Login" ? login() : signup();
            } else {
              setError("You must agree to the terms of use & privacy policy");
            }
          }}
        >
          Continue
        </button>
        {error && <p className="loginsignup-error">{error}</p>}
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={() => setState("Login")}>Login</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}
        <div className="loginsignup-agree">
          <input
            type="checkbox"
            checked={agree}
            onChange={handleCheckbox}
            name="terms"
            id="terms"
          />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
