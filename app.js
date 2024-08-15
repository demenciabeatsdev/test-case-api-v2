const express = require('express');
const app = express();
const path = require('path');
const testSuiteRoutes = require('./routes/testSuiteRoutes');
const testSuiteLevel2Routes = require('./routes/testSuiteLevel2Routes'); 


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/test-suites', testSuiteRoutes);
app.use('/api/test-suites-level-2', testSuiteLevel2Routes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});