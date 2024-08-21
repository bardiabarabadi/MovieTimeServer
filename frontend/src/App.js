// Filename - App.js

import React, { useState, useEffect } from "react";
import "./App.css";
import styled from "styled-components";
import backgroundImage from './assets/movie-time-background.jpg'; // Importing the local image file

// Theme configuration for buttons
const theme = {
  blue: {
    default: "#3f51b5",
    hover: "#5c6bc0",
  },
  gradient: {
    default: "linear-gradient(to right, #43cea2, #185a9d)",
    hover: "linear-gradient(to right, #185a9d, #43cea2)",
  },
};

// Styled components
const Container = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
  padding: 20px;
`;

const ButtonWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.8);  /* Semi-transparent white */
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Button = styled.button`
  background: ${(props) => props.color || theme.gradient.default};
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  outline: 0;
  border: 0;
  text-transform: uppercase;
  margin: 10px;
  cursor: ${(props) => (props.disabled || props.color === 'red' ? 'default' : 'pointer')};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.1rem;
  width: 100%;
  max-width: 300px;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: ${(props) => !props.disabled && props.hoverColor};
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

const Message = styled.div`
  color: #ffffff;
  background-color: #f57c00;
  padding: 15px 25px;
  border-radius: 8px;
  margin: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 1.1rem;
  width: 100%;
  max-width: 300px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
`;


// Function to handle button click with 5-second disable and text change
const handleButtonClick = (buttonLabel, setButtonDisabled, setButtonColor, setButtonText) => {
  if (setButtonColor !== 'red') {
    sendButtonPress(buttonLabel);
    setButtonDisabled(true);
    setButtonColor('#000000'); // Set color to black immediately after click
    setButtonText(`Toggling ${buttonLabel}...`); // Set text to indicate action

    setTimeout(() => {
      setButtonColor(theme.gradient.default); // Set color back to gradient after 5 seconds
      setButtonText(`Toggle ${buttonLabel}`); // Revert text to original
      setButtonDisabled(false);
    }, 5000);
  }
};

// Helper function to send POST requests
const sendButtonPress = (buttonLabel) => {
  fetch(`http://10.0.0.5:5000/buttons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: buttonLabel }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
};


const getStatusData = async (setColor, setError) => {
  try {
    const response = await fetch(`http://10.0.0.5:5000/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: "Hello" }),
    });
    const data = await response.json();

    if (data && typeof data.result !== 'undefined') {
      const newColor = Number(data.result) === 1 ? theme.gradient.default : 'red';
      setColor(newColor);
      setError(false);
    } else {
      setError(true);
    }
  } catch (error) {
    setError(true);
  }
};

// Main App component
function App() {
  const [speakerColor, setSpeakerColor] = useState(theme.gradient.default);
  const [projectorColor, setProjectorColor] = useState(theme.gradient.default);
  const [speakerDisabled, setSpeakerDisabled] = useState(false);
  const [projectorDisabled, setProjectorDisabled] = useState(false);
  const [speakerText, setSpeakerText] = useState('Toggle Speaker');
  const [projectorText, setProjectorText] = useState('Toggle Projector');
  const [error, setError] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      getStatusData((color) => {
        setSpeakerColor(color);
        setProjectorColor(color);
      }, setError);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <ButtonWrapper>
        <header className="App-header">
          <div className="flex-row">
            {error || speakerColor === 'red' || projectorColor === 'red' ? (
              <Message>
                <div className="spinner" />
                <span style={{ marginLeft: '10px' }}>Connecting...</span>
              </Message>
            ) : (
              <>
                <div>
                  <Button
                    onClick={() => handleButtonClick("Speaker", setSpeakerDisabled, setSpeakerColor, setSpeakerText)}
                    color={speakerColor}
                    hoverColor={theme.gradient.hover}
                    disabled={speakerDisabled || speakerColor === 'red'}
                  >
                    {speakerText}
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => handleButtonClick("Projector", setProjectorDisabled, setProjectorColor, setProjectorText)}
                    color={projectorColor}
                    hoverColor={theme.gradient.hover}
                    disabled={projectorDisabled || projectorColor === 'red'}
                  >
                    {projectorText}
                  </Button>
                </div>
              </>
            )}
          </div>
        </header>
      </ButtonWrapper>
    </Container>
  );
}

export default App;
