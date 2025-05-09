# Google Maps-Based Tracking Application And Real Time Notification Alerts

## Description
This is a real-time tracking application built using Google Maps API and Node.js. The application enables users to track locations with real-time updates, display markers on the map, and receive notifications when a user enters a specific radius.

## Features
- Display location markers on the map
- WebSockets integration for real-time markers position.
- Notification system using Toastify.js for radius alerts
- Blue circle over marker for accuracy representations

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript ,ejs
- **Real-time Communication:** WebSockets (Socket.io)

## File Structure
```
main/
│── public/
│   ├── css/
│   │   ├── style.css
│   ├── js/
│   │   ├── script.js
│── views/
│   ├── index.ejs
│── server.js
│── package.json
│── .gitignore
│── README.md
```

## Usage
- Open the web application and allow location access.
- The map will display your real-time location with a marker.
- Receive Popping notifications when you enter or exit a predefined radius.

## Contributing
Contributions are welcome! Feel free to submit a pull request or report any issues.



