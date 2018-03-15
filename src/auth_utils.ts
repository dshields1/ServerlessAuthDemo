const node_fetch = require('node-fetch')
const AWS = require('aws-sdk')
const DDB = new AWS.DynamoDB()
const table_name = process.env.TABLE_NAME

exports.validate_token = async (token) => {
    let response: any = {
        valid: false
    }
    try {
        let validation_response = await node_fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)
        let validation_response_obj = await validation_response.json()
        if (validate_client_id(validation_response_obj['aud'])) {
            response = extract_user_data(validation_response_obj)
            await create_user_if_not_exists(
                response.user_id,
                response.email,
                response.name
            )
        }
    } catch (err) {
        console.log('Error occurred when attempting to validate token', err)
        response = {
            valid: false
        }
    }
    return response
}

function extract_user_data(validation_reponse) {
    return {
        valid: true,
        user_id: validation_reponse['sub'],
        email: validation_reponse['email'],
        name: validation_reponse['name']
    }
}

function validate_client_id(aud) {
    return (aud === '931800125643-42duitk2pfnn6ou31vqa6fqbgg34aune.apps.googleusercontent.com')
}

async function create_user_if_not_exists(user_id, email, name) {
    if (!(await user_exists(user_id))) {
        await create_user(user_id, email, name)
    }
}

async function user_exists(user_id) {
    let params = {
        Key: {
            "user_id": {
                S: user_id
            }
        },
        TableName: table_name
    }
    let response = await DDB.getItem(params).promise()
    return Boolean(response.data)
}

async function create_user(user_id, email, name) {
    let params = {
        Item: {
            "user_id": {
                S: user_id
            },
            "email": {
                S: email
            },
            "name": {
                S: name
            }
        }, 
        TableName: table_name
    }
    await DDB.putItem(params).promise()
}