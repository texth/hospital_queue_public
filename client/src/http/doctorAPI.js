import { API } from './api';
import { jwtDecode } from 'jwt-decode';

export const getDoctors = async () => {
    const { data } = await API.get(`api/doctors`)
    return data
}

export const getDoctor = async (id) => {
    const { data } = await API.get(`api/doctors/${id}`)
    return data
}