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
from newsapi import NewsApiClient
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer,String, Float, Boolean
import os
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from yfinance import ticker

app = Flask(__name__)
CORS(app)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///' + os.path.join(basedir,'users.db')
app.config['SECRET_KEY']='secret-key'
#MIGHT NOT BE NEEDED
s = URLSafeTimedSerializer('SECRET_KEY')

db=SQLAlchemy(app)
@app.cli.command('dbCreate')
def db_create():
    db.create_all()
    print('Database created')

@app.cli.command('dbDrop')
def db_drop():
    db.drop_all()
    print('Database Dropped')

cred = credentials.Certificate('key.json')
firebase = firebase_admin.initialize_app(cred)
pb = pyrebase.initialize_app(json.load(open('config.json')))

class StockPortfolio(db.Model):
    id=Column(Integer, primary_key=True)
    public_id=Column(String(), unique=True)
    name = Column(String(), unique=True)
    stocks=Column(String())
    shares=Column(String())
    tracking= Column(String())
    trackers = Column(String())
   
    

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

@app.route('/api/getAllPortfolio')
@TokenRequired
def getAll():
    stockPortfolio=StockPortfolio.query.filter_by().all()
    output=[]

    if stockPortfolio:
        for portfolio in stockPortfolio:
            stockPortfolioDICT ={}
            stockPortfolioDICT['ticker'] =portfolio.stocks
            stockPortfolioDICT['share'] = portfolio.shares
            stockPortfolioDICT['trackers'] =portfolio.trackers
            stockPortfolioDICT['tracking'] =portfolio.tracking


            tickerArray = stockPortfolioDICT['ticker'].split(',')
            tickerArrays =[]
            shareArray = stockPortfolioDICT['share'].split(',')
            shareArrays =[]
            trackersArray = stockPortfolioDICT['trackers'].split(',')
            trackersArrays=[]
            trackingArray = stockPortfolioDICT['tracking'].split(',')
            trackingArrays =[]
            for i in range(len(tickerArray)):
                tickerArrays.append(tickerArray[i])
                shareArrays.append(shareArray[i])
            for i in range(len(trackersArray)):
                trackersArrays.append(trackersArray[i])
            for i in range(len(trackingArray)):
                trackingArrays.append(trackingArray[i])

            stockPortfolioDICT['shareArray']= shareArrays
            stockPortfolioDICT['tickerArray']= tickerArrays
            stockPortfolioDICT['trackersArray']= trackersArrays
            stockPortfolioDICT['trackingArray']= trackingArrays

            stockPortfolioDICT['userName'] = portfolio.name
            output.append(stockPortfolioDICT)
    return jsonify(data=output)
@app.route('/api/unfollow', methods =['DELETE'])
@TokenRequired
def unfollow ():
    user=StockPortfolio.query.filter_by(public_id=request.user['uid']).first()
    other= StockPortfolio.query.filter_by(name= request.json['userName']).first()

    if(user):
        if user.tracking =="":
            return {"message": "You do not track anyone"}
        else: 
            tracking = user.tracking.split(',')
            for users in tracking:
                if(users == request.json['userName']):
                    tracking.remove(request.json['userName'])
                    break
            currentTracking = ",".join(tracking)
            user.tracking=currentTracking    
    if (other):
        if other.trackers == "":
            return {"message": "You do not have any followers"}
        else:
            trackers = other.trackers.split(',')
            for users in trackers:
                if(users ==  user.name):
                    trackers.remove(user.name)
                    break
            currentTrackers = ",".join(trackers)
            other.trackers=currentTrackers     
    db.session.commit()
    return {"message": "You have unfollowed"}

            
@app.route('/api/follow', methods =['POST'])
@TokenRequired
def follow():
    userWhoIsFollowing=StockPortfolio.query.filter_by(public_id=request.user['uid']).first()
    userWhoIsFollowed = StockPortfolio.query.filter_by(name= request.json['userName']).first()

    if(userWhoIsFollowing):
        if userWhoIsFollowing.tracking =="" :
            tracking= request.json['userName']
            currentTracking=tracking
        else:
            tracking = userWhoIsFollowing.tracking.split(',')
            tracking.append(request.json['userName'])
            currentTracking=",".join(tracking)
        userWhoIsFollowing.tracking= currentTracking
    if (userWhoIsFollowed):
        if userWhoIsFollowed.trackers == "":
            trackers = userWhoIsFollowing.name
            currentTrackers=trackers
        else:
            trackers = userWhoIsFollowed.trackers.split(',')
            trackers.append(userWhoIsFollowing.name)
            currentTrackers = ",".join(trackers)

        userWhoIsFollowed.trackers=currentTrackers     
    db.session.commit()
    return {"message": "Tracking!"}

   
@app.route('/api/StockPortfolio', methods =['DELETE'])
@TokenRequired
def stockPortfolioDEL():
    data=request.json

    stockPortfolio=StockPortfolio.query.filter_by(public_id=request.user['uid']).first()
    if stockPortfolio:
        if stockPortfolio.stocks == "" and stockPortfolio.shares =="":
            return {'message': 'You do not have stocks to sell'},400
        else:
            tickerArray = stockPortfolio.stocks.split(',')
            shareArray = stockPortfolio.shares.split(',')
            if(data["TICKER"] in tickerArray):
                for j in range(len(tickerArray)):
                    if(data["TICKER"] == tickerArray[j]):
                        if(int(data["SHARE"]) > int(shareArray[j])):
                            return  {'message': 'You do not own enough shares'},400
                        elif (int(data["SHARE"]) < int(shareArray[j])):
                          shareArray[j] = str(int(shareArray[j]) - int(data['SHARE']))
                        else:
                            del tickerArray[j]
                            del shareArray[j]
            currentStocks = ",".join(tickerArray)
            currentShares=",".join(shareArray)
           
    
            stockPortfolio.stocks = currentStocks
            stockPortfolio.shares=currentShares
            db.session.commit()
            return {"message": "Deleted shares"}

    else:
        return {'message': 'You do not own this stock to sell'},400
            

@app.route('/api/StockPortfolio', methods =['POST'])
@TokenRequired
def stockPortfolio():
    data=request.json

    stockPortfolio=StockPortfolio.query.filter_by(public_id=request.user['uid']).first()

    if stockPortfolio:
        if stockPortfolio.stocks =="" and stockPortfolio.shares =="":
            currentStocks= data['TICKER']
            currentShares = data['SHARE']
        else:
            tickerArray = stockPortfolio.stocks.split(',')
            shareArray = stockPortfolio.shares.split(',')
            if(data['TICKER'] in tickerArray):
                for j in range(len(tickerArray)):
                    if(data['TICKER'] == tickerArray[j]):
                        
                        shareArray[j] = str(int(shareArray[j]) + int(data['SHARE']))
            else:
                tickerArray.append(data['TICKER'])
                shareArray.append(data['SHARE'])
            
            currentStocks = ",".join(tickerArray)
            currentShares=",".join(shareArray)
           
    
    stockPortfolio.stocks = currentStocks
    stockPortfolio.shares=currentShares

    db.session.commit()
    return (jsonify(message="Stock Added"))

@app.route('/api/StockPortfolio', methods =['GET'])
@TokenRequired
def stockPortfolioGET():
    stockPortfolio=StockPortfolio.query.filter_by(public_id=request.user['uid']).first()

    if stockPortfolio:
        stockPortfolioDICT ={}
        stockPortfolioDICT['ticker'] =stockPortfolio.stocks
        stockPortfolioDICT['share'] = stockPortfolio.shares
        stockPortfolioDICT['trackers'] =stockPortfolio.trackers
        stockPortfolioDICT['tracking'] =stockPortfolio.tracking


    tickerArray = stockPortfolioDICT['ticker'].split(',')
    tickerArrays =[]
    shareArray = stockPortfolioDICT['share'].split(',')
    shareArrays =[]
    trackersArray = stockPortfolioDICT['trackers'].split(',')
    trackersArrays=[]
    trackingArray = stockPortfolioDICT['tracking'].split(',')
    trackingArrays =[]
    for i in range(len(tickerArray)):
        tickerArrays.append(tickerArray[i])
        shareArrays.append(shareArray[i])
    for i in range(len(trackersArray)):
        trackersArrays.append(trackersArray[i])
    for i in range(len(trackingArray)):
        trackingArrays.append(trackingArray[i])

    stockPortfolioDICT['shareArray']= shareArrays
    stockPortfolioDICT['tickerArray']= tickerArrays
    stockPortfolioDICT['trackersArray']= trackersArrays
    stockPortfolioDICT['trackingArray']= trackingArrays

    stockPortfolioDICT['userName'] = stockPortfolio.name

    return jsonify(stockPortfolioDICT=stockPortfolioDICT)

@app.route('/api/userdata')
@TokenRequired
def userdata():
    return {'data': request.user}, 200

@app.route('/api/signup', methods = ['POST'])
def signup():
    email = request.json['email']
    password = request.json['password']
    userName=request.json['userName']
    if email is None or password is None or userName is None:
        return {'message': 'Error missing email or password'},400
    try:
        user = auth.create_user(
               email=email,
               password=password
        )
        
        userLog = pb.auth().sign_in_with_email_and_password(email, password)
        pb.auth().send_email_verification(userLog['idToken'])
        newPortfolio=StockPortfolio(
                             public_id=user.uid,
                             name = userName,
                             stocks= "",
                             shares="",
                             tracking="",
                             trackers="",
                            
                        )
        db.session.add(newPortfolio)
        db.session.commit()
        return {'message': 'Successfully created user'},200
    except:
        return {'message': 'Error creating user'},400

@app.route ('/api/resetPassword')
def getAccountInfo():
    email= request.json['email']
    info = pb.auth().send_password_reset_email(email)
    return info 

@app.route('/api/login', methods = ['POST'])
def token():
    email = request.json['email']
    password = request.json['password']
    try:
        user = pb.auth().sign_in_with_email_and_password(email, password)
        token = user['idToken']
        val = pb.auth().get_account_info(token)
        if( val['users'][0]['emailVerified']):
            return {'token': token}, 200
        else:
            return {'message':'verify email'},400         
    except:
       return {'message': 'There was an error logging in'},400

@app.route('/listofStocks', methods = ['GET'])
def listofStocks ():
    f = open('response.json')
    data = json.load(f)
    return jsonify(data)

@app.route('/allStockInfo', methods =['GET'])
def getAllStockInfo():
    f = open('sp500.json')
    data = json.load(f)
    for stock in data:
        stockInfo = yf.Ticker(stock['Symbol'])
        stock['value']=stockInfo.info
        ##stock['price']= stockInfo

    return jsonify(data)

@app.route('/marketValue',methods =['GET'])
def stockValues():
    ticker =request.json['TICKER']
    startDate = request.json['START']
    endDate = request.json['END']
    stock = yf.Ticker(ticker)
    history = stock.history(start=startDate, end=endDate)
    historyToList = history.values.tolist()
    data = jsonpify(historyToList)

    return data

@app.route('/stockInfo', methods =['POST'])
def stockInfo():
    ticker = request.json['TICKER']
    stock = yf.Ticker(ticker)
    return stock.info

@app.route('/newsFeed', methods =['POST'])
@TokenRequired
def newsFeed():
    #newsapi = NewsApiClient(api_key='f84069d717b3400aa52221602a964b8d')
    newsapi = NewsApiClient(api_key='8bd68343819f420a9c9f37c7db4cbd94')

    stockPortfolio=StockPortfolio.query.filter_by(public_id=request.user['uid']).first()
    tickerList = stockPortfolio.stocks

    tickerArray = tickerList.split(',')
    
    tickerQuery = ""
    for ticker in tickerArray:
        stock = yf.Ticker(ticker)
        if (ticker != ''):
            if (len(tickerQuery) > 0):
                tickerQuery = tickerQuery + " OR " + stock.info["longName"]
            else:
                tickerQuery = tickerQuery + stock.info["longName"]
    

    if (tickerQuery != ''):
        all_articles = newsapi.get_everything(q=tickerQuery,
                                            to=datetime.today().strftime('%Y-%m-%d'),
                                            language='en',
                                            sort_by='relevancy',
                                            page_size=20,
                                            page=request.json['page'])

        return all_articles

    return { "articles": [] }

if __name__ == "__main__":
    app.run(debug=True)