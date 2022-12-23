module.exports = {
    response : ({res, data = {}, status = 500, message = ''}) => {
        const result = {}
        result.status = status;
        result.message = message;
        result.data = data
        return res.status(result.status).json(result)
    },
}