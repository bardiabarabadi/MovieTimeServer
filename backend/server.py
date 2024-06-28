# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, request
from flask_cors import CORS, cross_origin
import datetime

# import libraries for BT connection
import threading
import serial
import re
import time

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# BT constants
SERIAL_PORT = 'COM5'
BAUD_RATE = 38400 


projector_state = False
serial_connection = None

# Helper function to establish serial connection
def connect_serial():
    global serial_connection
    try:
        serial_connection = serial.Serial(SERIAL_PORT, BAUD_RATE)
        serial_connection.write_timeout=2
        print("Serial connection established.")
    except serial.SerialException:
        serial_connection = None
        print("Failed to connect to serial port.")

# Background thread to continuously monitor and reconnect serial connection
def serial_monitor():
    global serial_connection
    while True:
        if serial_connection is None or not serial_connection.isOpen():
            connect_serial()
        else:
            try:
                # Check if serial connection is still active
                serial_connection.write(b'\n')
            except serial.SerialException:
                print("Serial connection lost. Reconnecting...")
                serial_connection = None
                connect_serial()
        time.sleep(1)  # Wait for 1 second before checking again

# Start the background thread for serial monitoring
serial_thread = threading.Thread(target=serial_monitor, daemon=True)
serial_thread.start()

def toggleSpeaker():
    global projector_state
    global serial_connection
    print("Projector Button Pushed: " +str(serial_connection))
    time.sleep(1)
    try:
        if serial_connection and serial_connection.isOpen():
            data_to_send = "S"
            serial_connection.write_timeout = 2
            res = serial_connection.write(data_to_send.encode())
            print(res)
            projector_state = not projector_state
            if serial_connection.in_waiting > 0:
                data = serial_connection.readline()
        else:
            print("Serial connection not available.")
    except:
        connect_serial()

def toggleProjector():
    global projector_state
    global serial_connection
    print("Projector Button Pushed: " +str(serial_connection))
    time.sleep(1)
    try:
        if serial_connection and serial_connection.isOpen():
            data_to_send = "P"
            serial_connection.write_timeout = 2
            res=serial_connection.write(data_to_send.encode())
            print(res)
            projector_state = not projector_state
            if serial_connection.in_waiting > 0:
                data = serial_connection.readline()
        else:
            print("Serial connection not available.")
    except:
        connect_serial()


@app.route('/buttons',  methods=["POST"], strict_slashes=False)
@cross_origin()
def get_button():
    data = request.json
    print("Button Clicked: " + str(data['data']))
 
    if data['data'] == 'Speaker':
        toggleSpeaker()
    
    if data['data'] == 'Projector':
        toggleProjector()
 
	# Returning an api for showing in reactjs
    return {
        "result": "1"
    }
	
# Running app
if __name__ == '__main__':
	app.run()
