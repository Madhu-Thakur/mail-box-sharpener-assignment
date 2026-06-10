import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Welcome from "./components/Welcome";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Spinner, Container } from "react-bootstrap";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (user) {
    return <Welcome />;
  }

  return showLogin ? (
    <LoginForm onToggle={() => setShowLogin(false)} />
  ) : (
    <SignupForm onToggle={() => setShowLogin(true)} />
  );
}

export default App;
