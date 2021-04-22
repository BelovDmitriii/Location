window.onload = getMyLocation;

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



