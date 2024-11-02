// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSTt_BtYR07qzKHm9pBgJ93RARJjt-HNA",
    authDomain: "studysphere-8f8ae.firebaseapp.com",
    projectId: "studysphere-8f8ae",
    storageBucket: "studysphere-8f8ae.appspot.com",
    messagingSenderId: "1043087075619",
    appId: "1:1043087075619:web:10ddd930f52125a0960496",
    measurementId: "G-Q4FTB6VJEC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Login function
function login(event) {
    event.preventDefault(); // Prevent form from submitting normally
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('login-error-message');

    // Clear previous errors
    errorMessage.innerText = "";

    // Firebase login
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login successful
            window.location.href = "http://localhost:5173/"; // Redirect to dashboard or homepage
        })
        .catch((error) => {
            const errorCode = error.code;

            // Custom error handling
            errorMessage.innerText = 
                errorCode === 'auth/user-not-found' 
                ? "No user found with this email." 
                : "Incorrect username or password.";
        });
}

// Register function
function register(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const agree = document.getElementById('agree').checked;
    const errorMessage = document.getElementById('register-error-message');
    const successMessage = document.getElementById('register-success-message');

    // Clear previous messages
    errorMessage.innerText = "";
    successMessage.innerText = "";

    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessage.innerText = "Passwords do not match.";
        return;
    }

    // Check if terms are accepted
    if (!agree) {
        errorMessage.innerText = "You must agree to the Terms of Service.";
        return;
    }

    // Firebase registration
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Save username and email in Realtime Database
            firebase.database().ref('users/' + user.uid).set({
                username: username,
                email: email
            });

            // Display success message instead of alert
            successMessage.innerText = "Account created successfully!";
        })
        .catch((error) => {
            const errorMessageText = error.message;
            errorMessage.innerText = errorMessageText;
        });
}