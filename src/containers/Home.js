import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  
	useEffect(() => {
	  async function onLoad() {
		if (!isAuthenticated) {
		  return;
		}

		try {
		  const notes = await loadNotes();
		  setNotes(notes);
		} catch (e) {
		  onError(e);
		}

		setIsLoading(false);
	  }

	  onLoad();
	}, [isAuthenticated]);

	function loadNotes() {
	  return API.get("saveAppNotes", "/saveAppNotes");
	}
	
	
	function renderNotesList(memories) {
	  return [{}].concat(memories).map((note, i) =>
		i !== 0 ? (
		  <LinkContainer key={note.noteId} to={`/memories/${note.noteId}`}>
			<ListGroupItem header={note.content.trim().split("\n")[0]}>
			  {"Created: " + new Date(note.createdAt).toLocaleString()}
			</ListGroupItem>
		  </LinkContainer>
		) : (
		  <LinkContainer key="new" to="/memories/new">
			<ListGroupItem>
			  <h4>
				<b>{"\uFF0B"}</b> Save a new memorable moment
			  </h4>
			</ListGroupItem>
		  </LinkContainer>
		)
	  );
	}

	function renderLander() {
	return (
	  <div className="lander">
		<h1>Must Reminiscence Wanderlust</h1>
		<p>Capture your memories forever.</p>
	  </div>
	);
	}

	function renderMemories() {
	return (
	  <div className="memories">
		<PageHeader>Your Memories</PageHeader>
		<ListGroup>
		  {!isLoading && renderNotesList(notes)}
		</ListGroup>
	  </div>
	);
	}

	return (
	<div className="Home">
	  {isAuthenticated ? renderMemories() : renderLander()}
	</div>
	);
}

