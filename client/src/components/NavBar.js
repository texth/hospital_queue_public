import React, { useContext } from 'react'
import "../css/navbar.css"
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { logout, getMe } from '../http/authAPI';
import UserImg from './UserImg';

const NavBar = observer(() => {
    const { user } = useContext(Context);
    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.removeItem('token')
        logout()
    }
    const login = user.user.login
    return (
        <ul id='navbar'>
            <li className='logo'><span style={{ fontFamily: "Oswald", color: "#04AA6D", fontSize: 29, fontWeight: 500, marginLeft: 10, marginRight: 10 }}>Hospital queue</span></li>
            <li><a href="/">Search page</a></li>
            {user.isAuth ?
                    <div>
                    <li><a href={"/appointments"}>My appointments</a></li>
                    <li style={{ float: "right" }}><a href="/login" onClick={() => logOut()}>Logout</a></li>
                    <li style={{ float: "right" }}><a href="/appointments"><span> {user.user.full_name}</span></a></li>
                    </div>
                :
                <div>
                    <li style={{ float: "right" }}><a className="active" href="/login">Login</a></li>
                    <li style={{ float: "right" }}><a href="/registration">Register</a></li>
                </div>

            }
        </ul>
    )
})

export default NavBar