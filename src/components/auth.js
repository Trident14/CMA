import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import "../css/auth.css";
import { Navbar } from "./Navbar.js";
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [_, setCookies] = useCookies(["access_token"]);
  const Navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [rightPanelActive, setRightPanelActive] = useState(false);

  const validateUsername = () => {
    if (username.length === 0) {
      return "Username is required";
    } else {
      return null;
    }
  };

  const validatePassword = () => {
    if (password.length === 0) {
      return "Password is required";
    } else {
      return null;
    }
  };

  const makeChanges = (rightPanelActive) => {
    if (rightPanelActive) {
      return "container right-panel-active";
    } else {
      return "container";
    }
  };

  const onSignIn = () => {
    setIsSignIn(true);
    setRightPanelActive(false);
  };
  const onSignUp = () => {
    setIsSignIn(false);
    setRightPanelActive(true);
  };

  const handleSignUpClick = async (event) => {
    event.preventDefault(); // Prevent default form submit behavior

    try {
      const response = await axios.post("https://cma-backend-s3jf.onrender.com/register", {
        username: username, // Send the username from the state
        password: password, // Send the password from the state
      });

      // Notify the user that registration was successful
      alert(response.data.message); // Should display "User Created Successfully"

      // Optionally, redirect the user to the login page or dashboard after successful signup
      Navigate('/');
    } catch (err) {
      // Debugging logs
      console.log('Error:', err);
      console.log('Error response:', err.response);

      // Check for specific status codes and show appropriate messages
      if (err.response) {
        if (err.response.status === 409) {
          alert('Username already exists');
        } else if (err.response.status === 500) {
          alert('Server error. Please try again later.');
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
      } else {
        // Fallback if `err.response` is not defined
        alert('Network error or server not reachable.');
      }
    }
  };

  const handleSignInClick = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post("https://cma-backend-s3jf.onrender.com/login", { username, password });
  
      // Store the JWT token in cookies
      setCookies("access_token", response.data.token);
      
      // Optionally, store the username in localStorage
      window.localStorage.setItem("username", response.data.username);
  
      // Redirect to the dashboard for all users (no admin check needed)
      Navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Invalid credentials. Please try again.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="main">
        <div className={makeChanges(rightPanelActive)}>
          <div className="form-container sign-up-container">
            <form className="form-field-login-inner" onSubmit={handleSignUpClick}>
              <h1>Register</h1>
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
                error={validateUsername()}
              />
              <input
                className="passField"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                error={validatePassword()}
              />
              <button className="register-button" type="submit">
                Register
              </button>
            </form>
          </div>

          <div className="form-container sign-in-container">
            <form className="form-field-login-inner" onSubmit={handleSignInClick}>
              <h1>Login</h1>
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
                error={validateUsername()}
              />
              <input
                className="passField"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                error={validatePassword()}
              />
              <button className="register-button" type="submit">
                Login
              </button>
            </form>
          </div>

          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Already,CMS user</h1>
                <p>Login to to nextGen Car Management Services</p>
                <button className="ghost" id="signIn" onClick={onSignIn}>
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>New to CMS</h1>
                <p>
                  Create an account, Experience nextGen Car
                  Management Services
                </p>
                <button className="ghost" id="signUp" onClick={onSignUp}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
