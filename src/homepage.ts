export function handler(event, context, callback) {
    callback(null, {
        statusCode: 200,
        headers: {
            'content-type': 'text/html'
        },
        body: homepage() 
    })
}

function getClientId() {
    return '931800125643-42duitk2pfnn6ou31vqa6fqbgg34aune'
}

function homepage() {
    return `
        <html>
            <head>
                <meta name="google-signin-client_id" content="${getClientId()}.apps.googleusercontent.com">
                <script src="https://apis.google.com/js/platform.js" async defer></script>
            </head>
            <body style="text-align:center">
                <h1>Welcome!</h1>
                <p>Use the button below to test Signin with Google</p>
                <div class="g-signin2" data-onsuccess="onSignIn"></div>
                <hr />
                <p>Use the following link to sign out of this application.</p>
                <a href="#" onclick="signOut();">Sign out</a>
                <hr />
                <p>Use the following link to test that signin is working.</p>
                <p>When signed in, an alert should pop up saying 'Hello, \${Name}!'</p>
                <p>When not signed in, an alert should pop up saying 'Invalid token'.</p>
                <a href="#" onclick="demoAction();">Try Demo Action</a>
            </body>
            <script>
                var token = '';
                function signOut() {
                    var auth2 = gapi.auth2.getAuthInstance();
                    auth2.signOut().then(function () {
                        console.log('User signed out.');
                    });
                    token = '';
                }
                function onSignIn(googleUser) {
                  var profile = googleUser.getBasicProfile();
                  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
                  console.log('Name: ' + profile.getName());
                  console.log('Image URL: ' + profile.getImageUrl());
                  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
                  token = googleUser.getAuthResponse().id_token;
                }
                function demoAction() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', '/Prod/demo', true);
                    xhr.setRequestHeader('Authorization', token)
                    xhr.onload = function() {
                      alert(xhr.responseText);
                    };
                    xhr.send();
                }
            </script>
        </html>`
}