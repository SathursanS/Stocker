from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore, initialize_app
from flask_jsonpify import jsonpify
from datetime import datetime
from yahoo_fin import stock_info as si 
import yfinance as yf
import requests

app = Flask(__name__)






if __name__ == "__main__":
    app.run(debug=True)