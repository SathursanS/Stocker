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

@app.route('/api/userdata')
@TokenRequired
def userdata():
    return {'data': request.user}, 200

@app.route('/api/signup')
def signup():
    email = request.json['email']
    password = request.json['password']
    if email is None or password is None:
        return {'message': 'Error missing email or password'},400
    try:
        user = auth.create_user(
               email=email,
               password=password
        )
        userLog = pb.auth().sign_in_with_email_and_password(email, password)
        pb.auth().send_email_verification(userLog['idToken'])
        return {'message': f'Successfully created user {user.uid}'},200
    except:
        return {'message': 'Error creating user'},400

@app.route ('/api/resetPassword')
def getAccountInfo():
    email= request.json['email']
    info = pb.auth().send_password_reset_email(email)
    return info 

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

@app.route('/newsFeed', methods =['GET'])
def newsFeed():
    newsapi = NewsApiClient(api_key='f84069d717b3400aa52221602a964b8d')

    #CODE TO GET ARRAY STRING FROM DATABASE
    tickerList = "AAPL,MSFT"
    ########################################

    tickerArray = tickerList.split(',')
    
    tickerQuery = ""
    for ticker in tickerArray:
        stock = yf.Ticker(ticker)
        if (len(tickerQuery) > 0):
            tickerQuery = tickerQuery + " OR " + stock.info["longName"]
        else:
            tickerQuery = tickerQuery + stock.info["longName"]
    

    all_articles = newsapi.get_everything(q=tickerQuery,
                                         to=datetime.today().strftime('%Y-%m-%d'),
                                        language='en',
                                        sort_by='relevancy',
                                        page_size=20,
                                        page=request.json['page'])
                                        
    return all_articles;

if __name__ == "__main__":
    app.run(debug=True)