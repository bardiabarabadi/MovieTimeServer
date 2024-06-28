# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, request
from flask_cors import CORS, cross_origin
import datetime

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Route for seeing a data
@app.route('/data')
def get_time():
	print("Hi world!")

	# Returning an api for showing in reactjs
	return {
		'Name':"geek", 
		"Age":"22",
		"Date":x, 
		"programming":"python"
		}

@app.route('/button',  methods=["POST"], strict_slashes=False)
@cross_origin()
def get_button():
	data = request.json
	print("Button Clicked: " + str(data['data']))
	# Returning an api for showing in reactjs
	return {
		"result": "1"
    }
	
# Running app
if __name__ == '__main__':
	app.run(debug=True)
