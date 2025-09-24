module.exports = {
    // tell jest that code will be running on 'node' note browser
    testEnvironment: 'node',
    //Best practice: clear mock history between tests.
    clearMocks: true,
    // where the output code coverage reports
    coverageDirectory: 'coverage',
};