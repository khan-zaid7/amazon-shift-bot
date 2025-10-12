// src/api/v1/middleware/validator.js
const {body, param, validationResult} = require('express-validator');

const todoValidationRules = () => {
    return [
        // id must exist and be an integer
        body('task').notEmpty().withMessage("The 'task' field is required.").isString().withMessage("The 'task' field must be a string."),
        body('completed').notEmpty().withMessage("The 'completed' field is required.").isBoolean().withMessage("The 'completed' field must be an boolean.")
    ];
};

const updateTodoValidationRules = () => {
    return [
        body('task')
            .optional()
            .notEmpty().withMessage("The 'task' field is required.")
            .isString().withMessage("The 'task' field must be a string."),

        body('completed')
            .optional()
            .notEmpty().withMessage("The 'completed' field is required.")
            .isBoolean().withMessage("The 'completed' field must be an boolean.")
    ]
}

// create an genrice id validator 
const idValidator = (paramName) => {
    return [
        param(paramName)
            .notEmpty().withMessage(`The url parameter ${paramName} is required.`)
            .isInt().withMessage(`The url parameter ${paramName} must be an Integer.`)

    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()){
        return next();
    }

    const extractedErros = [];
    errors.array().map(err => extractedErros.push({[err.path]:err.msg}));

    return res.status(400).json({
        errors: extractedErros
    });
};

module.exports = {
    validate,
    todoValidationRules,
    updateTodoValidationRules,
    idValidator
};