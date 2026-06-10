import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { onAuthStateChanged } from "firebase/auth";
import { ref, update, remove } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";

import ComposeMail from "./ComposeMail";
import Sent from "./Sent";
import { auth, database } from "../firebase";
import { setInboxMails, markAsRead, deleteInboxMail } from "../store/mailSlice";

import "../styles/Inbox.css";
import { signOut } from "firebase/auth";

function Inbox() {
  const [showCompose, setShowCompose] = useState(false);
  const [showSent, setShowSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMail, setSelectedMail] = useState(null);

  const dispatch = useDispatch();

  const mails = useSelector((state) => state.mail.inboxMails);

  const openMail = async (mail) => {
    setSelectedMail(mail);

    if (!mail.read) {
      try {
        await update(ref(database, `mails/${mail.id}`), {
          read: true,
        });

        dispatch(markAsRead(mail.id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteMail = async (id) => {
    try {
      await remove(ref(database, `mails/${id}`));

      dispatch(deleteInboxMail(id));

      if (selectedMail && selectedMail.id === id) {
        setSelectedMail(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let interval;

    const fetchMails = async (currentUser) => {
      try {
        const response = await fetch(
          "https://netflixgpt-d9389-default-rtdb.firebaseio.com/mails.json",
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

        dispatch(setInboxMails(loadedMails));
      } catch (error) {
        console.log(error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);

      if (currentUser) {
        // Initial fetch
        fetchMails(currentUser);

        // Fetch every 2 seconds
        interval = setInterval(() => {
          fetchMails(currentUser);
        }, 2000);
      }
    });

    return () => {
      unsubscribe();

      if (interval) {
        clearInterval(interval);
      }
    };
  }, [dispatch]);

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

  if (showSent) {
    return <Sent onBack={() => setShowSent(false)} />;
  }

  const unreadCount = mails.filter((mail) => !mail.read).length;

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={2}>
          <Button
            className="w-100 mb-3"
            onClick={() => {
              setShowCompose(true);
              setShowSent(false);
            }}
          >
            Compose
          </Button>

          <Button
            variant="danger"
            className="w-100 mb-3"
            onClick={() => signOut(auth)}
          >
            Logout
          </Button>

          <ListGroup>
            <ListGroup.Item
              active={!showSent}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShowCompose(false);
                setShowSent(false);
              }}
            >
              Inbox ({unreadCount})
            </ListGroup.Item>

            <ListGroup.Item
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShowCompose(false);
                setShowSent(true);
              }}
            >
              Sent
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={10}>
          <h3 className="mb-3">Inbox</h3>

          <ListGroup>
            {mails.length === 0 ? (
              <ListGroup.Item>No mails available</ListGroup.Item>
            ) : (
              mails.map((mail) => (
                <ListGroup.Item
                  key={mail.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div
                    onClick={() => openMail(mail)}
                    style={{ cursor: "pointer", flex: 1 }}
                  >
                    {!mail.read && <span className="blue-dot"></span>}
                    <strong>{mail.subject}</strong>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteMail(mail.id)}
                  >
                    Delete
                  </Button>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>

          {selectedMail && (
            <div className="mt-4 border rounded p-3">
              <h4>{selectedMail.subject}</h4>

              <p>
                <strong>From:</strong> {selectedMail.from}
              </p>

              <p>
                <strong>To:</strong> {selectedMail.to}
              </p>

              <hr />

              <p style={{ whiteSpace: "pre-wrap" }}>
                {selectedMail.content
                  ? JSON.parse(selectedMail.content)
                      .blocks.map((block) => block.text)
                      .join("\n")
                  : ""}
              </p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Inbox;
