# Stocker
2021 EngHack <br>
A Social Media Stock Platform 
Moderninzing the way Stocks are being discussed. 

<h3>Inspiration</h3>
Over the course of the past year, many of us heard a lot about the stock market and have started investing (GME to the moon 🚀). As such there has been a lot of discussions regarding the stock market through various platforms such as Reddit, Instagram and many others. However, there does not seem to exist a social platform for the sole purpose of stocks and stock related discussions. As a result, we wanted to develop a centralized social media platform that enables individuals to showcase their stock portfolios as well as track other portfolios they may be interested in! With the understanding that many of us prefer viewing stocks on our mobile devices, we built a user-friendly app to help display stock portfolios as well as to help create a social network between stock enthusiasts.

<h3>What it does</h3>
Stocker is a stock management app that allows users to add stocks that they have invested in into a virtual portfolio. But there’s a 21st century twist! Users can follow other users of the app to find out what stocks those users are investing in, giving insight into what stocks are popular amongst investors. Users also get up to date news about the stock market. We take a look at the stocks in their portfolio and generate a series of the most recent and relevant news related to their stocks. In addition, users get the ability to discover and get information on stocks with our stock lookup feature. For the cherry on top, users can visualize their investments through an elegant pie chart in their portfolio that shows the impact of each stock on their portfolio.

<h3>How we built it </h3>
When building out Stocker, we chose 3 key design principles to help ensure our product meets our specifications as well as ease our development process. Simplicity, Elegance, and Scalability.

We wanted Stocker to be simple to design, upgrade and debug. This led to us harnessing the lightweight framework of Flask and the magic of Python to design a REST API for the needed backend endpoints. To provide real-time stock updates and news, we harnessed multiple APIs such as Yahoo Finance and NewsAPI to ease the load of our application and further simplify our app. To help build out our initial minimum viable product we used SQLite3 and Firebase for rapid development, testing, and debugging.

To create an elegant and user-friendly experience we leveraged React Native and various design libraries to present our users with a new, modern platform for stocks! React Native also worked seamlessly with our Flask backend and our third-party APIs. This integration also allowed for a concurrent development stream for both our front-end and back-end teams.


