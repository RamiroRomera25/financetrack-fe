const API_URL_DEV = 'http://localhost'
const API_URL_PROD = 'https://financetrack-be.onrender.com'
const production = false;

export const enviroment = {
    auth: `${production ? API_URL_PROD : API_URL_DEV}/api/v1/auth`,
    users: `${production ? API_URL_PROD : API_URL_DEV}/api/v1/users`,
}
