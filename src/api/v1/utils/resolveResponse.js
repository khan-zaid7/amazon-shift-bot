const statusCode = require('../utils/responseMapping');

const resolveResponse = (result, res) => {
    if ((result.success === true) && (result.data) && (result.code === 'SUCCESS')) {
        return res.status(statusCode[result.code]).json(result.data);
    }
    if ((result.success === true) && (result.data) && (result.code === 'CREATED')) {
        return res.status(statusCode[result.code]).json(result.data);
    }
    if ((result.success === true) && (result.code === 'NO_CONTENT')) {
        return res.status(statusCode[result.code]).json();
    }
    if ((result.success === false) && (result.code === 'DUPLICATE_ENTRY')) {
        return res.status(statusCode[result.code]).json({ message: result.message });
    }
    if ((result.success === false) && (result.code === 'NOT_FOUND')) {
        return res.status(statusCode[result.code]).json({ message: result.message });
    }
    if ((result.success === false) && (result.code === 'VALIDATION_ERROR')) {
        return res.status(statusCode[result.code]).json({ message: result.message });
    }
    if ((result.success === false) && (result.code === 'INTERNAL_ERROR' || result.code === 'DEFAULT')) {
        return res.status(statusCode[result.code]).json({ message: result.message });
    }
}

module.exports = resolveResponse;