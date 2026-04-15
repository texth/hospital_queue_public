import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check, getMe } from "./http/authAPI";
import { set } from 'mobx';

const App = observer(() => {
    const { user } = useContext(Context)
    const [loading, setLoading] = useState(true)

    try {
        useEffect(() => {
            check().then(data => {
                if (data) {
                    getMe().then(data => {
                        user.setUser(data)
                        user.setIsAuth(true)
                    }).finally(() => setLoading(false))
                }
                else {
                    user.setUser({})
                    user.setIsAuth(false)
                    setLoading(false)
                }
            })
        }, [])
    } catch (e) {
        setLoading(false)
    }

    if (loading) {
        return <div>Loading</div>
    }

    return (
        <BrowserRouter>
            <NavBar />
            <AppRouter />
        </BrowserRouter>
    );
});
export default App
