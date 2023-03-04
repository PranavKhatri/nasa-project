server folder for backend and client for front end.

Server is based on MVC Architecture

npm install --save-dev nodemonß

"start": "PORT=5000 node src/server.js" ... to specify in package.json for port

All express code in app.js

const PORT = process.env.PORT || 8000; // different port than front end, it may ask the system to specify any port or 8000.

New type of creating server which is flexible. Express is just an middleware, that we add on top of the built in node HTTP server

In Get all planets function in front end, we are fetching the endpointfrom other port:
  const response = await fetch('http://localhost:8000/planets');
  return await response.json(); // the json functions also returns a response, so we need to await it

Models are separated from controllers and routers: We keep our router and controllers together because they are always one to one. There is always a controller for a router, a router that uses a controller. 
But for models , we might have many of them used in one controller
We separate our models because our data doesnt necessarily match up with the collections and API endpoints and overall functionality that our API needs to support through controller and our routes.
We might have many models being used by a single controller or we might have one model that's used in many different routes and different controllers.


What to do when we need to populate the server with data on startup? planets data is loaded and parse as  a stream.
Use Promise.

IMP: Look for streams Promises API



We can run the server and client from the root package.json:

"server": "cd server && npm run watch", OR "npm run watch --perfix server"
"client": "cd client && npm start", OR "npm start --prefix client"

In above "&&" changes make sure the first statement is done and has returned some value and then second is excuted.
So, when we do 1stStatement && 2nd Statement ,  we let 1st Statement  to get executed and , returned some value then 2nd Statement .

But in 1st Statement & 2nd Statement , 
In &, we first run the 1st Statment and dont wait to get some thing from 1st statement and then run second statment

"watch": "npm run server & npm sun client", --> It runs both the server and client together.


Logging Requests: Our server is taking in different types of requests , we want to aware what those requests are in out logs so that we can see whether things are working correctly or not.

There is existing middleware that we can use to save ourselves some work and give us some logging functionality which is Morgan Middleware
Morgan: It supports a lot of functionality that allows us to redirect our logs to various different streams. for example: files, or some log service on the internet.
We can use Morgan's Integration with nodes built in stream functionality to do what's called log rotation where we send our logs to a new file every day or every hour in large scale production servers.
Log files often huge because we are taking in  hundreds of requests per second and we fill up hard disks on our server machines with these logs,

Morgan helps us to define what data we want the logs to include , like the current date, or the HTTP method of the request, we can specify how to format the data that is logged

"combined": common format which corresponds to the log format used by APache

Model works with the data based on however it is stored , and our controller which only ever uses these acces functions to work with the data model and to put it all together into a response that's useful for our front end clients. 


Layered Architecture:

    Our applications consist of multiple layers which talk to each other.
    We can separate our application code into these layers, either stand alone or in addition with the MVC Pattern

    For example: The data access layer with our data access functions is very closely related with the our model and our business logic will then be the controllers that responds to a HTTP requests,

    And our user interface is like our views.

    In General Application Layers are part of a design principleknown as "Separation Of Concerns" where we want each part of our project , each module to be responsible for one thing snad to do that one thing well, the more different concerns we mix between modules, the more complicated it to keep track of all of the changes that are being made." And all of the relationshipd between the different components separating our concerns makes our code easier to understand, easier to update ad easier to grow into a much larger and more impressive piece of software.

    fetch function is default to get method.
    for post method fetch(url, {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(launch),
    })