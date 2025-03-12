// server.js

// Import necessary modules
const express = require('express'); // Express.js for creating the server
const bodyParser = require('body-parser'); // Body-parser to handle request bodies
const fs = require('fs'); // File system module to work with files

const app = express(); // Create an Express application
const port = 3000; // Define the port the server will listen on (you can change this)

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
// Middleware to parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// User data file (JSON format) - you can change the path if needed
const usersFilePath = 'users.json';

// Function to read user data from users.json file
const readUsers = () => {
    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(usersData);
    } catch (error) {
        // If the file doesn't exist or is empty/invalid JSON, return an empty array
        return [];
    }
};

// Function to write user data to users.json file
const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2)); // Use 2 spaces for indentation in JSON file
};

// --- Signup Endpoint ---
app.post('/signup', (req, res) => {
    const { email, password } = req.body; // Extract email and password from the request body

    if (!email || !password) {
        return res.status(400).send('Email and password are required.'); // Respond with an error if email or password is missing
    }

    let users = readUsers(); // Read existing users from the file

    // Check if the user with the given email already exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(409).send('User with this email already exists.'); // Respond with an error if user already exists
    }

    // Create a new user object
    const newUser = {
        email: email,
        password: password, // In a real application, you should hash the password!
        timestamp: new Date().toISOString() // Add a timestamp for when the user signed up
    };

    users.push(newUser); // Add the new user to the users array
    writeUsers(users); // Write the updated users array back to the file

    console.log(`New user signed up: ${email}`); // Log signup activity on the server side
    res.status(201).send('Signup successful!'); // Respond with a success message
});

// --- Login Endpoint ---
app.post('/login', (req, res) => {
    const { email, password } = req.body; // Extract email and password from the request body

    if (!email || !password) {
        return res.status(400).send('Email and password are required.'); // Respond with an error if email or password is missing
    }

    const users = readUsers(); // Read users from the file

    // Find the user by email
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(404).send('User not found.'); // Respond with an error if user is not found
    }

    // Check if the password matches (In real apps, compare hashed passwords!)
    if (user.password === password) {
        console.log(`User logged in: ${email}`); // Log login activity on the server side
        res.status(200).send('Login successful!'); // Respond with a success message
    } else {
        res.status(401).send('Invalid password.'); // Respond with an error if password does not match
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`); // Log when the server starts
});
