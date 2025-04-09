import pandas as pd
from flask import Flask, jsonify, render_template, redirect, request
from modelHelper import ModelHelper  # Ensure sqlHelper.py is in the same directory

#################################################
# Flask Setup
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Remove caching

# Model Helper
modelHelper = ModelHelper()

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    return render_template("index.html")

@app.route("/model")
def model():
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
    print(content)

    # parse
    name = content["name"]
    platform = content["platform"]
    Year = int(content["Year"])
    Genre = content["Genre"]
    Publisher = content["Publisher"]
    NA = float(content["NA"])
    EU = float(content["EU"])
    JP = float(content["JP"])
    Other = float(content["Other"])
    Global = float(content["Global"])
    Critic_Score = float(content["Critic_Score"])
    Critic_Count = float(content["Critic_Count"])
    User_Score = float(content["User_Score"])
    Developer = content["Developer"]
    Rating = content["Rating"]

    preds = modelHelper.predictions(name, platform, Year, Genre, Publisher, 
          NA, EU, JP, Other, Global, Critic_Score, Critic_Count, 
          User_Score, Developer, Rating)

    return(jsonify({"ok": True, "prediction": str(preds)}))

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