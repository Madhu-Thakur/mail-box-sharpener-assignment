import { useState, useEffect } from "react";
import { Container, ListGroup } from "react-bootstrap";
import { auth } from "../firebase";

function Sent() {
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);

  useEffect(() => {
    fetchSentMails();
  }, []);

  const fetchSentMails = async () => {
    try {
      const response = await fetch(
        "https://netflixgpt-d9389-default-rtdb.firebaseio.com/mails.json"
      );

      const data = await response.json();

      const loadedMails = [];

      for (const key in data) {
        if (data[key].from === auth.currentUser.email) {
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

  const openMail = (mail) => {
    setSelectedMail(mail);
  };

  return (
    <Container className="mt-3">
      <h3>Sent Mails</h3>

      <ListGroup className="mt-3">
        {mails.length === 0 ? (
          <ListGroup.Item>No sent mails</ListGroup.Item>
        ) : (
          mails.map((mail) => (
            <ListGroup.Item
              key={mail.id}
              onClick={() => openMail(mail)}
              style={{ cursor: "pointer" }}
            >
              <strong>{mail.subject}</strong>
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
              ? JSON.parse(selectedMail.content).blocks
                  .map((block) => block.text)
                  .join("\n")
              : ""}
          </p>
        </div>
      )}
    </Container>
  );
}

export default Sent;