const auth_utils = require('./auth_utils')

export async function handler(event, context, callback) {
    try {
        let token = event.headers['Authorization']
        let user_info = await auth_utils.validate_token(token)
        let response_text
        if(user_info.valid) {
            response_text = `Hello, ${user_info.name}!`
        }
        else {
            response_text = 'Invalid token.'
        }
        callback(null, {
            statusCode: 200,
            headers: {
                'content-type': 'text/plain'
            },
            body: response_text 
        })
    } catch (err) {
        callback(null, {
            statusCode: 500,
            headers: {
                'content-type': 'text/plain'
            },
            body: `An error occurred: ${err}`
        })
    }
}