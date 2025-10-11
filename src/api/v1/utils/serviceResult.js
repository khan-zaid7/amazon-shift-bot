class ServiceResult {
    constructor({ success, data, code, message }) {
        this.success = success ?? false;
        this.data = data ?? null;
        this.code = code ?? ResultCode.DEFAULT;
        this.message = message ?? null;
    };
};

module.exports = ServiceResult;