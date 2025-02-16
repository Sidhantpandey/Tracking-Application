const socket = io();

try {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0,
      }
    );
  }
} catch (error) {
  console.log(error);
}

const map = L.map("map").setView([0, 0], 20);

// Bottom Right Corner
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Indian Maps ",
}).addTo(map);

// For Markers
const markers = {};

// Handlign the location updates
socket.on("receive-location", ({ id, latitude, longitude, distances }) => {
  // Update or create user marker
  map.setView([latitude, longitude, 26]);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }

  // Update distance display
  let distanceText = "Nearby Users:<br>";
  for (const userId in distances) {
    distanceText += `User ${userId[1]}: ${distances[userId].toFixed(2)} km<br>`;
  }

  L.popup()
    .setLatLng([latitude, longitude])
    .setContent(distanceText)
    .openOn(map);
});

// This shows the radius of locator in a circle
const userMarker = L.marker([0, 0]).addTo(map);
const accuracyCircle = L.circle([0, 0], { radius: 10 }).addTo(map);

navigator.geolocation.watchPosition((position) => {
  const { latitude, longitude, accuracy } = position.coords;
  userMarker.setLatLng([latitude, longitude]);
  accuracyCircle.setLatLng([latitude, longitude]);
  accuracyCircle.setRadius(accuracy);
});

// Code for informing within the range or not
// If you are within 1 km of the Muradnagar  Station you will be warned
const GEOFENCE_CENTER = [28.771646, 77.507561];
const GEOFENCE_RADIUS = 10000;

navigator.geolocation.watchPosition((position) => {
  const { latitude, longitude } = position.coords;
  const distance = map.distance(GEOFENCE_CENTER, [latitude, longitude]);

  if (distance < GEOFENCE_RADIUS) {
    console.log("✅ Inside Geofence");
    // notifying the users
    Toastify({
      text: "You have Entered the RESTRICTED AREA | BEAWARE!",
      duration: 5000,
      backgroundColor:
        "linear-gradient(to right,rgb(255, 0, 47),rgb(255, 221, 0))",
    }).showToast();
  } else {
    console.log("🚨 Outside Geofence");
    // Notifying the users
    Toastify({
      text: "You have left the DANGER ZONE | HURRAY ! ",
      duration: 5000,
      backgroundColor:
        "linear-gradient(to right,rgb(6, 123, 17),rgb(94, 255, 0))",
    }).showToast();
  }
});

// To delete the markers when not in use
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
