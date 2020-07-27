from models import create_classes
import os
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

app = Flask(__name__)

from flask_sqlalchemy import SQLAlchemy
engine = create_engine("sqlite:///nsBorder.sqlite")
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)



print(Base.classes.keys())

northPorts = Base.classes.northPorts
southPorts = Base.classes.southPorts
northStates = Base.classes.northStates
southStates = Base.classes.southStates

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/north_port")
def north_port_entrydata():
    session = Session(engine)
    north_port_results = session.query(northPorts.A, northPorts.PortName, northPorts.Date, northPorts.Value).all()
    north_port_info = []
    for result in north_port_results:
        north_port_entry_info = {
            "id": result.A,
            "port_name": result.PortName,
            "date": result.Date,
            "value": result.Value

        }

        north_port_info.append(north_port_entry_info)

    return jsonify(north_port_info)

@app.route("/south_port")   
def south_port_entrydata():
    session = Session(engine)
    south_port_results = session.query(southPorts.A, southPorts.PortName, southPorts.Date, southPorts.Value).all()
    south_port_info = []
    for result in south_port_results:
        south_port_entry_info = {
            "id": result.A,
            "port_name": result.PortName,
            "date": result.Date,
            "value": result.Value,

        }

        south_port_info.append(south_port_entry_info)

    return jsonify(south_port_info)

@app.route("/state")
def state_entrydata():
    session = Session(engine)
    north_state_results = session.query(northStates.A, northStates.State, northStates.Date, northStates.Value).all()
    north_state_info = []
    for result in north_state_results:
        north_state_entry_info = {
            "id": result.A,
            "state": result.State,
            "date": result.Date,
            "value": result.Value,

        }
        
        north_state_info.append(north_state_entry_info)
      
    
    south_state_results = session.query(southStates.A, southStates.State, southStates.Date, southStates.Value).all()
    south_state_info = []
    for result in south_state_results:
        south_state_entry_info = {
            "id": result.A,
            "state": result.State,
            "date": result.Date,
            "value": result.Value

        }

        south_state_info.append(south_state_entry_info)
    return jsonify(north_state_info, south_state_info)
    
if __name__ == "__main__":
    app.run(debug=True)