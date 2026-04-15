import { API } from './api';
import { jwtDecode } from 'jwt-decode';

export const registration = async (email, full_name, password, confirm) => {
    const response = await API.post('api/auth/register', {
        email,
        full_name,
        password,
        confirm
    })
    return response.data
}

export const login = async (email, password) => {
    const {data} = await API.post('api/auth/login', {
        email,
        password
    })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const confirm = async (email, password, code) => {
    const {data} = await API.post('api/auth/verify-email', {
        email,
        password,
        code
    })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const logout = async () => {
    const {data} = await API.post('api/auth/logout')
    return data
}

export const check = async () => {
    try {
        const {data} = await API.post('api/auth/refresh')
        localStorage.setItem('token', data.token)
        return jwtDecode(data.token)
    } catch (e) {
        return null
    }
}

export const getMe = async () => {
    const { data } = await API.get(`api/auth/me`)
    return data
}

export const resetPass = async (email) => {
    const { data } = await API.post(`api/auth/password-reset`, {
        email
    })
    return data
}

export const resetPassConfirm = async (email, password, code) => {
    const { data } = await API.post(`api/auth/password-reset-confirm`, {
        email,
        password,
        code
    })
    return data
}