import axios from 'axios'

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

const authInterceptor = config => {
    if (localStorage.getItem('token')) {
        config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    }
    
    return config
}

API.interceptors.request.use(authInterceptor)

export {
    API
}
