const statusCode = require('../utils/responseMapping');

const resolveResponse = (result, res) => {

    if (!result || !result.code || !statusCode[result.code]) {
        return res.status(500).json({ message: 'Invalid respnose structure.' });
    }

    const { success, code, data, message } = result;
    try {
        if (success) {
            // sending no content for 204 
            if (code === 'NO_CONTENT') {
                return res.status(statusCode[code]).send();
            }
            return res.status(statusCode[code]).json(data ?? {});
        }
        return res.status(statusCode[code]).json({ message: message ?? 'An error occured' });
    }
    catch (err) {
        console.error('Error in resolveResponse:', err);
        return res.status(500).json({ message: 'Internal response resolution failure.' });
    }
}



module.exports = resolveResponse;