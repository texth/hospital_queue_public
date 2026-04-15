import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Context } from "../index";
import { DOCTORS_ROUTE } from '../utils/consts';
import { privateRoutes, publicRoutes } from '../routes';

const AppRouter = () => {
    const { user } = useContext(Context);
    return (
        <Routes>
            {user && user.isAuth && privateRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
            <Route path={'*'} element={<Navigate to={DOCTORS_ROUTE} />} />
        </Routes>
    )
}

export default AppRouter