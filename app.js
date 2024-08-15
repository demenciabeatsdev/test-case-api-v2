const express = require('express');
const app = express();
const path = require('path');
const testSuiteRoutes = require('./routes/testSuiteRoutes');
const testSuiteLevel2Routes = require('./routes/testSuiteLevel2Routes'); 
const actionRoutes = require('./routes/actionRoutes');
const expectedResultRoutes = require('./routes/expectedResultRoutes');
const testCaseRoutes = require('./routes/testCaseRoutes');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/test-suites', testSuiteRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/test-suites-level-2', testSuiteLevel2Routes);
app.use('/api/expected-results', expectedResultRoutes);
app.use('/api/test-cases', testCaseRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} :) `);
});

