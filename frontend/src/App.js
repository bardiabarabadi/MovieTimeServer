// Filename - App.js

// Importing modules
import React, { useState, useEffect } from "react";
import "./App.css";
import styled from "styled-components";

const theme = {
  blue: {
    default: "#3f51b5",
    hover: "#283593",
  }
}

const Button = styled.button`
  background-color: ${(props) => theme[props.theme].default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  border: 0; 
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: ${(props) => theme[props.theme].hover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

Button.defaultProps = {
  theme: "blue",
};

const ButtonToggle = styled(Button)`
  opacity: 0.7;
  ${({ active }) =>
    active &&
    `
    opacity: 1; 
  `}
`;

function speakerButtonClicked() {
  fetch(`http://localhost:5000/buttons`, {
    'method': 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "data": "Speaker" })
  }).then(res => res.json())
    .then(function (data) {
      console.log(data);
    })
}

function projectorButtonClicked() {
  fetch(`http://localhost:5000/buttons`, {
    'method': 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "data": "Projector" })
  }).then(res => res.json())
    .then(function (data) {
      console.log(data);
    })
}

function App() {


  return (
    <div className="App">
      <header className="App-header">
        <div className="flex-row">
          <div>
            <Button onClick={speakerButtonClicked}>Toggle Speaker</Button>
          </div>
          <div>
            <Button onClick={projectorButtonClicked}>Toggle Projector</Button>
          </div>
        </div>
      </header>
      <body>

      </body>

    </div>
  );
}

export default App;
