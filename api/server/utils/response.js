class Response {
    static SUCCESS(code = 200, message = "", data = null) {
        return {
            code,
            result: true,
            message,
            data,
        };
    }

    static ERROR(code = 500, message = "", data = null) {
        return {
            code,
            result: false,
            message,
            data,
        };
    }

    static WARN(code = 400, message = "", data = null) {
        return {
            code,
            result: false,
            message,
            data,
        };
    }
}

export default Response;
