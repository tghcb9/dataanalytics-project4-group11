from flask import Flask, jsonify, request, render_template
import pickle
import numpy as np
import os  # Ensure sqlHelper.py is in the same directory
from modelHelper import ModelHelper

#################################################
# Flask Setup
app = Flask(__name__)
APP_ROOT = os.path.dirname(os.path.abspath(__file__))     
# set file directory path
MODEL_PATH = os.path.join(APP_ROOT, "App\global_sales_model_linear.pkl")  
# set path to the model
model = pickle.load(open(MODEL_PATH, 'rb')) 
# load the pickled model

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    return render_template("index.html")

@app.route("/model")
def model_page():
    return render_template("model.html")

@app.route("/tableau1")
def tableau1():
    return render_template("tableau1.html")

@app.route("/tableau2")
def tableau2():
    return render_template("tableau2.html")

@app.route("/report")
def report():
    return render_template("report.html")

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

@app.route("/works_cited")
def works_cited():
    return render_template("works_cited.html")

#################################################
# API Routes
#################################################

@app.route("/predictions", methods=["POST"])
def predictions():
    content = request.json["data"]

    # Pass the entire input dictionary to ModelHelper
    model_helper = ModelHelper(MODEL_PATH)
    preds = model_helper.predictions(content)

    return jsonify({"prediction": preds})

#############################################################

# ELIMINATE CACHING
@app.after_request
def add_header(r):
    """
    Add headers to prevent caching.
    """
    r.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

# Main
if __name__ == '__main__':
    app.run(debug=True)  # Remember to turn off debug mode in production