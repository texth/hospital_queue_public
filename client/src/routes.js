import { LOGIN_ROUTE, DOCTORS_ROUTE, REGISTRATION_ROUTE, DOCTOR_ROUTE, CONFIRM_ROUTE, APPOINTMENTS_ROUTE, FORGET_ROUTE, RESET_ROUTE } from "./utils/consts";
import Auth from "./pages/Auth";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: CONFIRM_ROUTE,
        Component: Auth
    },
    {
        path: FORGET_ROUTE,
        Component: Auth
    },
    {
        path: RESET_ROUTE,
        Component: Auth
    },
    {
        path: DOCTORS_ROUTE,
        Component: Doctors
    }
]

// TODO:
// rewrite routes for hospital queue website
// main page - search doctors
// /doctor/:id - doctor page with info and awailable time slots
// /appointments - user appointments page
// /selfedit - edit user page
// leave auth routes as they are


export const privateRoutes = [
    {
        path: APPOINTMENTS_ROUTE,
        Component: Appointments
    }
]
