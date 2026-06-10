import { Container, Card, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../styles/Signup.css";

function LoginForm({ onToggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="signup-card p-4 shadow">
        <h2 className="text-center mb-4">Login</h2>

        {error && (
          <p className="text-danger text-center">
            {error}
          </p>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            disabled={!email || !password}
          >
            Login
          </Button>
        </Form>

        <p className="text-center mt-3 mb-0">
          Don't have an account?{" "}
          <span
            style={{ color: "#0d6efd", cursor: "pointer", textDecoration: "underline" }}
            onClick={onToggle}
          >
            Sign Up
          </span>
        </p>
      </Card>
    </Container>
  );
}

export default LoginForm;