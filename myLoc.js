let options = { enableHightAccuracy: true, timeout: 100, maximumAge:0};
window.onload = getMyLocation;
let watchId = null;
let ourCoords = {
    latitude: 59.877068, 
    longitude: 30.345234
};
let map;

function getMyLocation () {
    if (navigator.geolocation){
        //navigator.geolocation.getCurrentPosition(displayLocation);
        let watchButton = document.getElementById('watch');
        watchButton.onclick = watchLocation;
        let clearButton = document.getElementById('clearWatch');
        clearButton.onclick = clearWatch;
    } else {
        alert ("Не получить геоданные");
    }
}

let prevCoords = null;

function displayLocation (position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let div = document.getElementById("location");
    div.innerHTML = "Ваше местоположение: широта: " + latitude + ", долгота: " + longitude;
    div.innerHTML +=  "( с " + position.coords.accuracy + " метрами точности)";
    div.innerHTML += " (найдено за  " + options.timeout + " миллисекунд)";

    let km = computeDistance(position.coords, ourCoords);
    
    let distance = document.getElementById("distance");
    distance.innerHTML = "На данный момент вы на " + km + " км от Тусяныча";

    if (map == null){
        showMap(position.coords);
		prevCoords = position.coords;
    } else {
		let meters = computeDistance(position.coords, prevCoords) * 1000;
		if (meters > 20) {
			scrollMapToPosition(position.coords);
			prevCoords = position.coords;
		}
	}
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

// Show Map

function showMap (coords) {
    let googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);

    // GoogleMaps params

    let mapOptions = {
    zoom: 15,     // Значение может быть от 0 до 21
    center: googleLatAndLong,
    mapTypeId: google.maps.MapTypeId.navigator   // or SATELLITE or HYBRID
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

// Вывод ошибок на экран

function displayError(error) {
	var errorTypes = {
		0: "Unknown error",
		1: "Permission denied",
		2: "Position is not available",
		3: "Превышено время ожидания"
	};
        var errorMessage = errorTypes[error.code];
        if (error.code == 0 || error.code == 2) {
		    errorMessage = errorMessage + " " + error.message;
	    }
        var div = document.getElementById("location");
        div.innerHTML = errorMessage;
        options.timeout += 100;
        navigator.geolocation.getCurrentPosition(
        displayLocation,
        displayError,
        options);
    div.innerHTML += " ... проверяем снова с задержкой " + options.timeout; 
}

function watchLocation() {
    watchId = navigator.geolocation.watchPosition(
                        displayLocation, 
                        displayError,
                        options);
}

//show new position

function scrollMapToPosition(coords){
    let latitude = coords.longitude;
    let longitude = coords.longitude;
    let latlong = new google.maps.LatLng(latitude, longitude);

    map.panTo(latlong);

    addMarker(map, latlong, "Ваше новое местоположение", "Вы продвинулись на позицию: " + 
                                latitude + ", " + longitude);
}

function clearWatch() {
    if(watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        alert ("Слежение за вами приостановлено");
    }
}
