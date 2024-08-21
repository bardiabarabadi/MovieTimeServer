# Filename - server.py

# Import necessary modules
from flask import Flask, request
from flask_cors import CORS, cross_origin
import datetime
import threading
import serial
import time

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Serial port configuration constants
SERIAL_PORT = 'COM4'
BAUD_RATE = 38400

# Global variables
serial_connection = None
serial_status = False
projector_state = False

# Helper function to establish a serial connection
def connect_serial():
    global serial_connection, serial_status
    try:
        serial_connection = serial.Serial(SERIAL_PORT, BAUD_RATE, write_timeout=2)
        serial_status = True
        print("Serial connection established.")
        time.sleep(1)
    except serial.SerialException:
        serial_connection = None
        serial_status = False
        print("Failed to connect to serial port.")

# Background thread to monitor and reconnect the serial connection
def serial_monitor():
    global serial_connection
    while True:
        if not serial_connection or not serial_connection.isOpen():
            connect_serial()
        else:
            try:
                serial_connection.write(b'\n')  # Test the connection
            except serial.SerialException:
                print("Serial connection lost. Reconnecting...")
                serial_connection = None
                connect_serial()
        time.sleep(1)

# Start the background thread for serial monitoring
serial_thread = threading.Thread(target=serial_monitor, daemon=True)
serial_thread.start()

# Function to toggle the speaker
def toggle_speaker():
    global projector_state, serial_connection
    if serial_connection and serial_connection.isOpen():
        try:
            data_to_send = "X"
            serial_connection.write(data_to_send.encode())
            projector_state = not projector_state
            print(f"Speaker toggled, state: {projector_state}")
        except serial.SerialException:
            print("Error writing to serial port.")
            connect_serial()
    else:
        print("Serial connection not available.")

# Function to toggle the projector
def toggle_projector():
    global projector_state, serial_connection
    if serial_connection and serial_connection.isOpen():
        try:
            data_to_send = "Q"
            serial_connection.write(data_to_send.encode())
            projector_state = not projector_state
            print(f"Projector toggled, state: {projector_state}")
        except serial.SerialException:
            print("Error writing to serial port.")
            connect_serial()
    else:
        print("Serial connection not available.")

# Route to handle button clicks
@app.route('/buttons', methods=["POST"], strict_slashes=False)
@cross_origin()
def handle_button_click():
    data = request.json.get('data', '')
    print(f"Button Clicked: {data}")
    
    if data == 'Speaker':
        toggle_speaker()
    elif data == 'Projector':
        toggle_projector()

    return {"result": "1"}

# Route to get the current serial connection status
@app.route('/status', methods=["POST"], strict_slashes=False)
@cross_origin()
def get_status():
    global serial_status
    # print ({"result": "1" if serial_status else "0"})
    return {"result": "1" if serial_status else "0"}

# Main entry point to run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
