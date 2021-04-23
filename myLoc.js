window.onload = getMyLocation;

let ourCoords = {
    latitude: 59.877068, 
    longitude: 30.345234
};

function getMyLocation () {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(displayLocation);
    } else {
        alert ("Не получить геоданные");
    }
}

function displayLocation (position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let div = document.getElementById("location");
    div.innerHTML = "Ваше местоположение: широта: " + latitude + ", долгота: " + longitude;


    // Координаты точки А и В

    let km = computeDistance(position.coords, ourCoords);
    let distance = document.getElementById("distance");
    distance.innerHTML = "На данный момент вы на " + km + " км от Тусяныча";

    showMap(position.coords);
}

function displayError(error) {
	var errorTypes = {
		0: "Unknown error",
		1: "Permission denied",
		2: "Position is not available",
		3: "Request timeout"
	};
	var errorMessage = errorTypes[error.code];
	if (error.code == 0 || error.code == 2) {
		errorMessage = errorMessage + " " + error.message;
	}
	var div = document.getElementById("location");
	div.innerHTML = errorMessage;
}

// distance between two coord

function computeDistance(startCoords, destCoords) {
    let startLatRads = degreesToRadians (startCoords.latitude);
    let startLongRads = degreesToRadians (startCoords.longitude);
    let destLatRads = degreesToRadians (destCoords.latitude);
    let destLongRads = degreesToRadians (destCoords.longitude);

    let Radius = 6371; // радиус Земли в км
    let distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + 
                    Math.cos(startLatRads) * Math.cos(destLatRads) * 
                    Math.cos(startLongRads - destLongRads)) * Radius;
    return distance;
}

function degreesToRadians (degrees) {
    let radians = (degrees * Math.PI) / 180;
    return radians;
}

let map;

function showMap (coords) {
    let googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);

    // GoogleMaps params

let mapOptions = {
    zoom: 10,     // Значение может быть от 0 до 21
    center: googleLatAndLong,
    mapTypeId: google.maps.MapTypeId.ROADMAP   // or SATELLITE or HYBRID
};

let mapDiv = document.getElementById("map");
map = new google.maps.Map(mapDiv, mapOptions);

let title = "Ваше местоположение";
let content = "Вы здесь: " + coords.latitude + ", " + coords.longitude;
addMarker(map, googleLatAndLong, title, content); 
}

// Добавление маркера местоположения на карту

function addMarker(map, latlong, title, content) {
    let markerOptions = {
        position: latlong,
        map: map,
        title: title,
        clickable: true
    };

    let marker = new google.maps.Marker(markerOptions);

    let infoWindowOptions = {
        content: content,
        position: latlong
    };
    let infoWindow = new google.maps.InfoWindow( infoWindowOptions );
    google.maps.event.addListener( marker, "click", function() {
        infoWindow.open(map);
    });
}

