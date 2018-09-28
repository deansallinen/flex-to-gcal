## Flex to Gcal 

This project consumes the Flex Rental Solutions API for our event schedule to allow us to run better reporting, create custom Google Calendars, Slackbots, etc. after saving it to a cloud database.

## Scraper

This is the code that accesses the Flex API and pulls down the calendar for our given timeframe, gets additional information for each event, compiles those events into an array and sends them to our Server API to be inserted or updated in our database.

### Moment.js 

I’ve chosen moment over the lighterweight date-fns for it’s parsing with format-mask ability. Our dates come through from Flex in a string with a non-standard date format (DD-MM-YYYY HH:ss) that makes it difficult to parse with date-fns. Moment also makes it easy to do calculations and comparisons on dates.

### The workflow

Using async/await we first fetch our list of events. Next we need to send GET requests for each event Id to retrieve additional details (like Load In information) and financial details (like planned revenue). 

Previous iterations of this scraper used a map function to run these requests asynchronously, however this was sending too many requests per second and the API started rate-limiting. To solve this issue, I wrapped the two secondary requests in a promise chain so they resolve sequentially instead of all at once. This does slow down the scraping process (as it essentially makes that section of code synchronous and blocking) however as this is meant to be run on an interval the timeliness of the process is not a huge factor. 

Once the additional information is added to each event, metadata is also added and the previously mentioned dates are correctly formatted.

### Checking for action needed

The reason why the server exists (and why this whole project was rewritten to begin with) is that we needed some way of checking the most recently scraped event against our previously scraped events. This is so that we can efficiently send update, insert, and delete requests to the Google Calendar.

For each scraped event we check it against our database to see if a) it exists and b) if it needs updating. These are tagged and send to the database with a POST request. 

### Testing

Throughout development I adopted the TDD (Test Driven Development) pattern. I found this was the most effective way of rewriting large chunks of code while maintaining correct functionality. It also helped immensely during debugging, particularly when trying to setup the promise chain and the logic for returning the correct actions in the getAction function.

I’ve used Mocha and Chai before, but wanted to try Jest so this project is tested with Jest. I’ve found it to be easy to use, reliable, and fast enough for my needs. I’ll definitely reach for it next time. 

## Server

This is a simple server with a REST API connected to our hosted mongodb database. There are routes for CRUD operations of events, for retrieving arrays to send to Google Calendar, and for retrieving custom reports. Down the road we will be using these reporting routes to send updates to a Slack channel. 

### Koa vs Express

I chose Koa for this project over Express. I wanted to see what the difference was and if I could get away with the stripped down successor to the more popular Express. It turns out to be very easy to navigate, especially when starting from scratch. Not sure it would be worth it to migrate a project already using Express. 

To get up and running quickly I used Daniel Balastegui’s “Koalerplate” which is a boilerplate repo for a simple Koa server. This saved a lot of setup time and allowed me to immediately start writing Models, Routes, and Controllers.

### Event Model

I’ve chosen to send all fields to the server and let the Model decide which to save to the database (rather than send only the fields that match the model). This should allow for easier expansion in the future if additional fields are required to be saved. 

I’m also making use of virtuals to do some formatting on retreival. For example, the ‘load’ and ‘strike’ virtuals will allow the client code in Google Apps script to do less processing after hitting our API. They are essentially different views for the same event object, so it makes sense to me to generate them virtually rather than save them.

