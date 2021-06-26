from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore, initialize_app, auth 
from flask_jsonpify import jsonpify
from datetime import datetime
from yahoo_fin import stock_info as si 
import yfinance as yf
import requests
import json 
import pyrebase
import firebase_admin
import pyrebase
import json
from flask_cors import CORS
from functools import wraps
from firebase_admin import firestore 

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate('key.json')
firebase = firebase_admin.initialize_app(cred)
pb = pyrebase.initialize_app(json.load(open('config.json')))

def TokenRequired(f):
    @wraps(f)
    def wrap(*args,**kwargs):
        if not request.headers.get('x-access-tokens'):
            return {'message': 'No token provided'},400
        try:
            user = auth.verify_id_token(request.headers['x-access-tokens'])
            request.user = user
        except:
            return {'message':'Invalid token provided.'},400
        return f(*args, **kwargs)
    return wrap

@app.route('/listofStocks', methods = ['GET'])
def listofStocks ():
    f = open('sp500.json')
    data = json.load(f)
    return jsonify(data)

@app.route('/marketValue',methods =['GEt'])
def stockValues():
    ticker =request.json['TICKER']
    startDate = request.json['START']
    endDate = request.json['END']
    stock = yf.Ticker(ticker)
    history = stock.history(start=startDate, end=endDate)
    historyToList = history.values.tolist()
    data = jsonpify(historyToList)

    return data


@app.route('/stockInfo', methods =['GET'])
def stockInfo():
    ticker = request.json['TICKER']
    stock = yf.Ticker(ticker)
    return stock.info

if __name__ == "__main__":
    app.run(debug=True)