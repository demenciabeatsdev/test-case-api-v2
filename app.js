const express = require('express');
const app = express();
const path = require('path');
const testSuiteRoutes = require('./routes/testSuiteRoutes');


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/test-suites', testSuiteRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});