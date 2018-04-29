var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
var SCOPES = "https://www.googleapis.com/auth/gmail.send";
var CLIENT_ID = "757012825667-rkrvc4kb1lt07rt88snngnqampvs86ai.apps.googleusercontent.com";
var API_KEY = "AIzaSyABvCVaVJbBxtSFWeN-4opFjLgAO8ipjGw";

function sendMail(to, subject, message) {
	console.log("sendMail");

	const script = document.createElement("script");
	script.src = "https://apis.google.com/js/client.js";

	script.onload = () => {
		gapi.load("client", () => {
			gapi.client.setApiKey(API_KEY);
			gapi.client.load("gmail", "v1", () => {
				console.log("gapiReady");
				initClient(to, subject, message);
			});
		});
	};

	document.body.appendChild(script);
}

function initClient(to, subject, message) {
	gapi.client
		.init({
			apiKey: API_KEY,
			discoveryDocs: DISCOVERY_DOCS,
			clientId: CLIENT_ID,
			scope: SCOPES
		})
		.then(function() {
			// Listen for sign-in state changes.
			gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

			// Handle the initial sign-in state.
			updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get(), to, subject, message);
		});
}

function updateSigninStatus(isSignedIn, to, subject, message) {
	if (isSignedIn) {
		console.log("isSignedIn true");
		console.log(to, subject, message);

		let email = [];
		email.push("To: " + to);
		email.push("Subject: " + subject);
		email.push("Content-type: text/html;charset=UTF-8");
		email.push("MIME-Version: 1.0");
		email.push("");
		email.push(message);
		email = email.join("\r\n").trim();
		email = Buffer.from(email)
			.toString("base64")
			.replace(/\+/g, "-")
			.replace(/\//g, "_");

		gapi.client.gmail.users.messages
			.send({
				userId: "me",
				resource: {
					raw: email
				}
			})
			.then(function(response) {
				if (response.status == 200) {
					console.log("Done send mail");
				} else {
					console.log("Fail send mail");
				}
			});
	} else {
		console.log("isSignedIn false");
		gapi.auth2.getAuthInstance().signIn();
	}
}

export default sendMail;
