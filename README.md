# Airline Tycoon
Airline Tycoon is a multiplayer airline management game where users compete with each other to build the strongest airline.  Airlines start with a billion dollars and then decide which aircraft to purchase and how to configure them (how many seats in first class, business class, etc).  From there, airlines choose fares, frequencies, and equipment to launch flights between two of the 123 airports.

# Front end (this repo)
* The front end is built primarly on Backbone.js, with a fair bit of jQuery and underscore to support it
* The UI is mostly custom, however, there is a bit of heavily modified Semantic UI
* Leaflet, Mapbox, and arc.js are used to create the markers, popups, and great circle lines
* All data is sent to and received from the backend API (https://github.com/krisziel/airlinetycoon-backend), which is hosted on AWS
