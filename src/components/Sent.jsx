import { useState, useEffect } from "react";
import { Container, ListGroup, Button } from "react-bootstrap";
import { auth } from "../firebase";
import useMailApi from "../hooks/useMailApi";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { setSentMails, deleteSentMail } from "../store/mailSlice";

function Sent({ onBack }) {
  const dispatch = useDispatch();

  const { getMails, deleteMail: deleteMailApi } = useMailApi();

  const mails = useSelector((state) => state.mail.sentMails);
  const [selectedMail, setSelectedMail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentMails = async (currentUser) => {
      try {
        const response = await fetch(
          "https://netflixgpt-d9389-default-rtdb.firebaseio.com/mails.json",
        );

        const data = await getMails();

        const loadedMails = [];

        for (const key in data) {
          if (data[key].from === currentUser.email) {
            loadedMails.push({
              id: key,
              ...data[key],
            });
          }
        }

        dispatch(setSentMails(loadedMails));
      } catch (error) {
        console.log(error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);

      if (currentUser) {
        fetchSentMails(currentUser);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const openMail = (mail) => {
    setSelectedMail(mail);
  };

  const deleteMail = async (id) => {
    try {
      await deleteMailApi(id);

      dispatch(deleteSentMail(id));

      if (selectedMail && selectedMail.id === id) {
        setSelectedMail(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-3">
      <div className="d-flex align-items-center mb-3">
        {onBack && (
          <Button variant="outline-secondary" className="me-2" onClick={onBack}>
            ← Back
          </Button>
        )}
        <h3 className="mb-0">Sent Mails</h3>
      </div>

      <ListGroup className="mt-3">
        {mails.length === 0 ? (
          <ListGroup.Item>No sent mails</ListGroup.Item>
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
        <div className="border rounded p-3 mt-4">
          <h4>{selectedMail.subject}</h4>

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
    </Container>
  );
}

export default Sent;
