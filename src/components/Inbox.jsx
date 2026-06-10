import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import ComposeMail from "./ComposeMail";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/Inbox.css";

function Inbox() {
  const [showCompose, setShowCompose] = useState(false);
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMails = async (currentUser) => {
    try {
      const response = await fetch(
        "https://netflixgpt-d9389-default-rtdb.firebaseio.com/mails.json"
      );

      const data = await response.json();

      const loadedMails = [];

      for (const key in data) {
        if (data[key].to === currentUser.email) {
          loadedMails.push({
            id: key,
            ...data[key],
          });
        }
      }

      setMails(loadedMails);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);

      if (currentUser) {
        fetchMails(currentUser);
      }
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

  if (showCompose) {
    return <ComposeMail onBack={() => setShowCompose(false)} />;
  }

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={2}>
          <Button
            className="w-100 mb-3"
            onClick={() => setShowCompose(true)}
          >
            Compose
          </Button>

          <ListGroup>
            <ListGroup.Item active>
              Inbox
            </ListGroup.Item>

            <ListGroup.Item>
              Sent
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={10}>
          <h3 className="mb-3">Inbox</h3>

          <ListGroup>
            {mails.length === 0 ? (
              <ListGroup.Item>
                No mails available
              </ListGroup.Item>
            ) : (
              mails.map((mail) => (
                <ListGroup.Item key={mail.id}>
                  <strong>{mail.subject}</strong>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default Inbox;