document.getElementById("analyseButton").addEventListener("click", analyze);

function analyze(){
	document.getElementById("output").innerHTML = '';
	document.getElementById("imageDisplay").innerHTML = '';
	
	var imgSrc = document.getElementById('input').value;
	if (imgSrc) {
		var imgDisplayElement = document.getElementById("imageDisplay");
		var imgElement = document.createElement('img');		
		imgElement.onerror = function() { 
			alert("Invalid image URL");
			imgDisplayElement.innerHTML = '';
		}
		imgElement.onload = analyzeImage;
		imgElement.src = imgSrc;	
		imgDisplayElement.appendChild(imgElement);
	}	
}

function analyzeImage() {
	var imgSrc = document.getElementById('input').value;
	
	var reqBody = {
		"url": imgSrc
	};

	var myHeader =  new Headers({
		'Content-Type': 'application/json',
		'Ocp-Apim-Subscription-Key':'e24e76e30df7432cb0a635964469c87a'
	});
	
	var initObject = {
		method: 'POST',
		body: JSON.stringify(reqBody),
		headers: myHeader
	}
	
	var request = new Request('https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=age,gender&returnFaceLandmarks=false', initObject);
	fetch(request).then(function(response){
		if(response.ok){
			return response.json();
		}
		else{
			return Promise.reject(new Error(response.statusText));
		}
	}).then(function(response){
		if (response.length == 0) {
			document.getElementById("output").innerHTML = "No Faces Detected";
		} else {		
			var output = '';
			Object.keys(response[0].faceAttributes).forEach(function(key) {
				var field = key.charAt(0).toUpperCase() + key.slice(1);
				output += field + ': ' + response[0].faceAttributes[key] + '<br>';
			});
			document.getElementById("output").innerHTML = output;
		}		
	}).catch(function(err){
		alert(err);  
		document.getElementById("output").innerHTML = "";
	});
}