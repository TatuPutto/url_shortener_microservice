# URL Shortener Microservice
My solution to FreeCodeCamp assignment URL Shortener Microservice. Simple Node.js app with MongoDB. Shortens the passed URL address (if valid) and adds the original and the shortened URL to db. Redirects the user to the original link when the shortened URL is visited.

## User stories
1. I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
2. If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
3. When I visit that shortened URL, it will redirect me to my original link.

## Usage
This app is deployed in Heroku. You can use this app here: https://secret-meadow-30442.herokuapp.com/
