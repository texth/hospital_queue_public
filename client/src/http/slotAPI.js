import { API } from './api';
import { jwtDecode } from 'jwt-decode';

export const doctorSlots = async (doctorId) => {
    const { data } = await API.get(`api/slots/doctor/${doctorId}`)
    return data
}

export const mySlots = async () => {
    const { data } = await API.get(`api/slots/myslots`)
    return data
}