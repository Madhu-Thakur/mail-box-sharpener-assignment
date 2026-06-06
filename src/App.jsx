import { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Welcome from "./components/Welcome";
import "./App.css";

function App() {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn");

  const [showLogin, setShowLogin] = useState(true);

  if (isLoggedIn) {
    return <Welcome />;
  }

  return showLogin ? (
    <LoginForm onToggle={() => setShowLogin(false)} />
  ) : (
    <SignupForm onToggle={() => setShowLogin(true)} />
  );
}

export default App;
