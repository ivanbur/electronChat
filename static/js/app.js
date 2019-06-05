// Initialize Firebase
var config = {
	apiKey: "AIzaSyAfNcOHMO2-6wJXv--oTL3LY8sBaMtN8FM",
	authDomain: "test-366e4.firebaseapp.com",
	databaseURL: "https://test-366e4.firebaseio.com",
	projectId: "test-366e4",
	storageBucket: "test-366e4.appspot.com",
	messagingSenderId: "312399873888"
};

firebase.initializeApp(config);

var username = "";
var database = firebase.database();
var messages = [];

var today = new Date();
var date = {
	day: today.getDate(),
	month: today.getMonth() + 1
};


$(document).ready(function() {
	$("#enterMessageHere").hide();
	$("#userMessage").hide();
	$("#theTextArea").hide();
	$("#sliderFontSize").hide();
	$("#changeFontSizeText").hide();
	$("#numPeopleOnline").hide();


	database.ref("lastMonth").once("value").then(function(snapshot) {
		if (date.month > snapshot.val()) {
			database.ref("messages/").remove();
			database.ref("lastMonth").set(date.month);
			database.ref("lastDay").set(date.day);
			window.location.reload(false);
		}
	});

	database.ref("lastDay").once("value").then(function(snapshot) {
		if (date.day >= snapshot.val() + 7) {
			database.ref("messages/").remove();
			database.ref("lastDay").set(date.day);
			window.location.reload(false);
		}
	});

	database.ref("messages/").once("value").then(function(snapshot) {
		messages = snapshot.val();

		if (messages == null) {
			messages = [];
			database.ref("messages/0").set("ADMIN: Welcome to the start of a new chat!");
		}

		console.log("the messages are: " + messages);
	});
	
	database.ref("peopleOnline").once("value").then(function(snapshot) {
		database.ref("peopleOnline").set(snapshot.val() + 1);
	});

});

window.addEventListener("beforeunload", function (e) {

	database.ref("peopleOnline").once("value").then(function(snapshot) {
		database.ref("peopleOnline").set(snapshot.val() - 1);
	});

});


function usernameEntered() {
	if (event.keyCode == 13) {
		username = $("#username").val();

		$("#usernameEnter").hide();

		$("#enterMessageHere").show();
		$("#userMessage").show();
		$("#theTextArea").show();
		$("#sliderFontSize").show();
		$("#changeFontSizeText").show();
		$("#numPeopleOnline").show();

		if (messages.length != 1) {

			$("#theTextArea").html(" ");
			for (var i = 0; i < messages.length; i++) {
				$("#theTextArea").append("\n" + messages[i]);
				console.log("debug - " + messages[i]);
			}

		}

		$("#theTextArea").animate({
    		scrollTop: $("#theTextArea").get(0).scrollHeight
		}, 0.0000001);

		$("#userMessage").focus();
	}
}


function sendMessage() {
	if (event.keyCode == 13 && $("#userMessage").val() != "" && $("#userMessage").val() != " ") {
		var userMessage = $("#userMessage").val();

		$("#userMessage").val("");


		database.ref("messages/" + messages.length).set(username + ": " + userMessage);
		
	}
}


function changingSlider() {
	$("#theTextArea").css("font-size", $("#sliderFontSize").val() + "px");
}


database.ref("messages/").on("value", function(snapshot) {

	if (snapshot.val() != null) {
		messages.push(snapshot.val()[snapshot.val().length - 1]);
	}
	
	console.log(messages);
	console.log(snapshot.val());

	$("#theTextArea").html(" ");
	for (var i = 0; i < messages.length; i++) {
		$("#theTextArea").append("\n" + messages[i]);
		console.log("debug - " + i + " - " + messages[i]);
	}
	$("#theTextArea").animate({
    	scrollTop: $("#theTextArea").get(0).scrollHeight
	}, 0.0000001);
});

database.ref("peopleOnline").on("value", function(snapshot) {
	$("#numPeopleOnline").html("Number of people online: " + snapshot.val());
});