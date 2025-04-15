const API_URL_DEV = 'http://localhost'
const API_URL_PROD = 'https://financetrack-be.onrender.com'
const production = false;

export const enviroment = {
  auth: `${production ? API_URL_PROD : API_URL_DEV}/api/v1/auth`,
  users: `${production ? API_URL_PROD : API_URL_DEV}/api/v1/users`,
  transactions: `${production ? API_URL_PROD : API_URL_DEV}/api/v1/transactions`,
  categories: `${production ? API_URL_PROD : API_URL_DEV}/api/v1/categories`,
  projects: `${production ? API_URL_PROD : API_URL_DEV}/api/v1/projects`,
  maturities: `${production ? API_URL_PROD : API_URL_DEV}/api/v1/maturities`,
  goals: `${production ? API_URL_PROD : API_URL_DEV}/api/v1/goals`,
  investments: `${production ? API_URL_PROD : API_URL_DEV}/api/v1/investments`,
}
