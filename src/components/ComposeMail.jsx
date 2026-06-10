import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
} from "draft-js";

import { database, auth } from "../firebase";
import { ref, push } from "firebase/database";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import "../styles/ComposeMail.css";

function ComposeMail({ onBack }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty()
  );

  const handleSend = () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    const content = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );

    const mailData = {
      from: user.email,
      to: to,
      subject: subject,
      content: content,
      createdAt: new Date().toISOString(),
    };

    push(ref(database, "mails"), mailData)
      .then(() => {
        alert("Mail Sent Successfully");

        setTo("");
        setSubject("");
        setEditorState(EditorState.createEmpty());
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <Container className="mt-4">
      <div className="d-flex align-items-center mb-3">
        <Button
          variant="outline-secondary"
          className="me-2"
          onClick={onBack}
        >
          ← Back
        </Button>
        <h4 className="mb-0">New Message</h4>
      </div>

      <Form.Control
        type="email"
        placeholder="To"
        className="mb-3"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <Form.Control
        type="text"
        placeholder="Subject"
        className="mb-3"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <div className="editor-wrapper">
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          editorClassName="editor"
        />
      </div>

      <Button
        className="mt-3"
        variant="primary"
        onClick={handleSend}
      >
        Send
      </Button>
    </Container>
  );
}

export default ComposeMail;