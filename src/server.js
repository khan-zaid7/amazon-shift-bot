// src/server.js

const app = require('./app');

// define the port 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}.`)
})