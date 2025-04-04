import pandas as pd
from flask import Flask, jsonify, render_template, redirect, request
from sqlHelper import SQLHelper  # Ensure sqlHelper.py is in the same directory

#################################################
# Flask Setup
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Remove caching

# SQL Helper
sqlHelper = SQLHelper()

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

@app.route("/works_cited")
def works_cited():
    return render_template("works_cited.html")

#################################################
# API Routes
#################################################

@app.route("/api/v1.0/bar_data/<country_input>")
def bar_data(country_input):
    # Execute queries
    df = sqlHelper.queryBarData(country_input)
    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)

@app.route("/api/v1.0/table_data")
def table_data():
    # Execute queries
    df = sqlHelper.queryTableData()
    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)

@app.route("/api/v1.0/burst_data")
def burst_data():
    # Execute queries
    df = sqlHelper.queryBurstData()
    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)

@app.route("/api/v1.0/map_data")
def map_data():
    # Execute queries
    df = sqlHelper.queryMapData()
    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)

@app.route('/map')
def map_page():
    return render_template('map.html')  # This serves the map.html from the templates folder

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