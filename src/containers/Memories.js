import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Memories.css";
import { s3Upload } from "../libs/awsLib";


export default function Memories() {
	const file = useRef(null);
	const { id } = useParams();
	const history = useHistory();
	const [note, setNote] = useState(null);
	const [content, setContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return API.get("saveAppNotes", `/saveAppNotes/${id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
  return content.length > 0;
}

function formatFilename(str) {
  return str.replace(/^\w+-/, "");
}

function handleFileChange(event) {
  file.current = event.target.files[0];
}

function saveNote(note) {
  return API.put("saveAppNotes", `/saveAppNotes/${id}`, {
    body: note
  });
}

async function handleSubmit(event) {
  let attachment;

  event.preventDefault();

  if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
    alert(
      `Please pick a file smaller than ${
        config.MAX_ATTACHMENT_SIZE / 1000000
      } MB.`
    );
    return;
  }

  setIsLoading(true);

  try {
    if (file.current) {
      attachment = await s3Upload(file.current);
    }

    await saveNote({
      content,
      attachment: attachment || note.attachment
    });
    history.push("/");
  } catch (e) {
    onError(e);
    setIsLoading(false);
  }
}

function deleteNote() {
  return API.del("saveAppNotes", `/saveAppNotes/${id}`);
}

async function handleDelete(event) {
  event.preventDefault();

  const confirmed = window.confirm(
    "Are you sure you want to delete this memory?"
  );

  if (!confirmed) {
    return;
  }

  setIsDeleting(true);

  try {
    await deleteNote();
    history.push("/");
  } catch (e) {
    onError(e);
    setIsDeleting(false);
  }
}
// eslint-disable-line prefer-template
	function showPosition() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var positionInfo = `Your current position is (Latitude: ${position.coords.latitude} , Longitude: ${position.coords.longitude} )`;
				var currentContent = content + "\n" + positionInfo;				
                setContent(currentContent);
            });
        } else {
            alert("Sorry, your browser does not support HTML5 geolocation.");
        }
    }

return (
  <div className="Memories">
    {note && (
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="content">
          <FormControl
            value={content}
            componentClass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </FormGroup>
		<Button 
		  bsSize="large"
		  bsStyle="primary"
		  onClick={showPosition}
		  >
		  Click me to add your GPS location to your memory
		  </Button>
        {note.attachment && (
          <FormGroup>
            <ControlLabel>Attachment</ControlLabel>
            <FormControl.Static>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={note.attachmentURL}
              >
                {formatFilename(note.attachment)}
              </a>
            </FormControl.Static>
          </FormGroup>
        )}
		
        <FormGroup controlId="file">
          {!note.attachment && <ControlLabel>Attachment</ControlLabel>}
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Save
        </LoaderButton>
        <LoaderButton
          block
          bsSize="large"
          bsStyle="danger"
          onClick={handleDelete}
          isLoading={isDeleting}
        >
          Delete
        </LoaderButton>
      </form>
    )}
  </div>
);
}