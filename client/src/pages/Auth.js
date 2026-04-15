import React, { useContext, useState } from 'react'
import "../css/auth.css"
import { useLocation, useNavigate } from 'react-router-dom'
import { CONFIRM_ROUTE, FORGET_ROUTE, LOGIN_ROUTE, DOCTORS_ROUTE, REGISTRATION_ROUTE, RESET_ROUTE } from '../utils/consts'
import { confirm, getMe, login, registration, resetPass, resetPassConfirm } from '../http/authAPI'
import { observer } from 'mobx-react-lite'
import { Context } from "../index";

const Auth = observer(() => {
    const { user } = useContext(Context)
    const nav = useNavigate()

    const location = useLocation()
    const path = location.pathname;

    const [regEmail, setRegEmail] = useState('')
    const [regFullName, setRegFullName] = useState('')
    const [regPassword, setRegPassword] = useState('')
    const [regConfPass, setRegConfPass] = useState('')

    const [logEmail, setLogEmail] = useState('')
    const [logPassword, setLogPassword] = useState('')

    const [confEmail, setConfEmail] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [confCode, setConfCode] = useState('')

    const [forgetEmail, setForgetEmail] = useState('')

    const [resetEmail, setResetEmail] = useState('')
    const [resetCode, setResetCode] = useState('')
    const [resetPassword, setResetPassword] = useState('')
    const [resetConfPass, setResetConfPass] = useState('')

    const [error, setError] = useState('')


    const signUp = async () => {
        try {
            const response = await registration(regEmail, regFullName, regPassword, regConfPass);
            nav(CONFIRM_ROUTE)
            nav(0)
        } catch (e) {
            try {
                document.getElementById('regerror').innerHTML = e.response.data;
            } catch (f) {
                document.getElementById('regerror').innerHTML = "Something went wrong";
                console.log(e);
            }
        }
    }

    const conf = async () => {
        try {
            const data = await confirm(confEmail, confPassword, confCode);
            const userData = await getMe();
            nav(DOCTORS_ROUTE)
            user.setUser(userData);
            user.setIsAuth(true);
        } catch (e) {
            document.getElementById('conferror').innerHTML = e.response.data;
        }
    }


    const logIn = async () => {
        try {
            const data = await login(logEmail, logPassword);
            const userData = await getMe();
            user.setUser(userData);
            nav(DOCTORS_ROUTE)
            user.setIsAuth(true);
        } catch (e) {
            document.getElementById('logerror').innerHTML = e.response.data;
        }
    }

    const forget = async () => {
        try {
            const data = await resetPass(forgetEmail);
            nav(RESET_ROUTE)
            nav(0)
        } catch (e) {
            document.getElementById('forgeterror').innerHTML = e.response.data;
        }
    }

    const reset = async () => {
        try {
            const data = await resetPassConfirm(resetEmail, resetPassword, resetCode);
            nav(LOGIN_ROUTE)
            nav(0)
        } catch (e) {
            document.getElementById('reseterror').innerHTML = e.response.data;
        }
    }


    return (
        <div className="container">
            <div className="login-container">

                {(path == REGISTRATION_ROUTE) ?
                    <form name="form" className="form">
                        <h1>Registration</h1>
                        <div className="form-section">
                            <input
                                className="input"
                                required
                                type="text"
                                name="full_name"
                                placeholder="Full Name"
                                size="20"
                                value={regFullName}
                                onChange={e => setRegFullName(e.target.value)}
                            />
                        </div>
                        <div className="form-section">
                            <input
                                className="input"
                                required
                                type="email"
                                name="email"
                                placeholder="Email"
                                size="20"
                                value={regEmail}
                                onChange={e => setRegEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-section">
                            <input
                                className="input"
                                required
                                type="password"
                                name="password"
                                placeholder="Password"
                                size="20"
                                value={regPassword}
                                onChange={e => setRegPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-section">
                            <input
                                className="input"
                                required
                                type="password"
                                name="confPass"
                                placeholder="Confirm password"
                                size="20"
                                value={regConfPass}
                                onChange={e => setRegConfPass(e.target.value)}
                            />
                        </div>
                        <input
                            id="regButton"
                            type="button"
                            value="Sign Up"
                            onClick={signUp}
                            className="button"
                        />
                        <p id="regerror" value={error}></p>
                        <span className="reminder">Already have an account? <a href="/login">Login</a></span>
                        <span className="reminder" >Want to confirm email? <a href="/confirm" style={{ fontSize: "1.2rem" }}>Confirm</a></span>
                    </form>
                    : (path == CONFIRM_ROUTE) ?
                        <form name="form" className="form">
                            <h1>Confirm</h1>
                            <div className="form-section">
                                <input
                                    className="input"
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    size="20"
                                    value={confEmail}
                                    onChange={e => setConfEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-section">
                                <input
                                    className="input"
                                    required
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    size="20"
                                    value={confPassword}
                                    onChange={e => setConfPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-section">
                                <input
                                    className="input"
                                    required
                                    type="text"
                                    name="email_code"
                                    placeholder="Code"
                                    size="20"
                                    value={confCode}
                                    onChange={e => setConfCode(e.target.value)}
                                />
                            </div>
                            <input
                                id="regButton"
                                type="button"
                                value="Confirm"
                                onClick={conf}
                                className="button"
                            />
                            <p id="conferror" value={error}></p>
                            <span className="reminder">Already have an account? <a href="/login">Login</a></span>
                            <span className="reminder" >Want to register? <a href="/registration" style={{ fontSize: "1.2rem" }}>Register</a></span>
                        </form>
                        : (path == FORGET_ROUTE) ?
                            <form name="form" className="form">
                                <h1>Forget Password</h1>
                                <div className="form-section">
                                    <input
                                        className="input"
                                        required
                                        type="email"
                                        name="forgetEmail"
                                        placeholder="Enter your email"
                                        size="20"
                                        value={forgetEmail}
                                        onChange={e => setForgetEmail(e.target.value)}
                                    />
                                </div>
                                <input
                                    id="regButton"
                                    type="button"
                                    value="Confirm"
                                    onClick={forget}
                                    className="button"
                                />
                                <p id="forgeterror"></p>
                                <span className="reminder">Remember your password? <a href="/login">Login</a></span>
                            </form>
                        : (path == RESET_ROUTE) ?
                            <form name="form" className="form">
                                <h1>Reset Password</h1>
                                <div className="form-section">
                                    <input
                                        className="input"
                                        required
                                        type="email"
                                        name="resetEmail"
                                        placeholder="Enter your email"
                                        size="20"
                                        value={resetEmail}
                                        onChange={e => setResetEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-section">
                                    <input
                                        className="input"
                                        required
                                        type="text"
                                        name="resetCode"
                                        placeholder="Enter your code"
                                        size="20"
                                        value={resetCode}
                                        onChange={e => setResetCode(e.target.value)}
                                    />
                                </div>
                                <div className="form-section">
                                    <input
                                        className="input"
                                        required
                                        type="password"
                                        name="resetPassword"
                                        placeholder="Enter your new password"
                                        size="20"
                                        value={resetPassword}
                                        onChange={e => setResetPassword(e.target.value)}
                                    />
                                </div>
                                <div className="form-section">
                                    <input
                                        className="input"
                                        required
                                        type="password"
                                        name="resetConfPass"
                                        placeholder="Confirm password"
                                        size="20"
                                        value={resetConfPass}
                                        onChange={e => setResetConfPass(e.target.value)}
                                    />
                                </div>
                                <input
                                    id="regButton"
                                    type="button"
                                    value="Confirm"
                                    onClick={reset}
                                    className="button"
                                />
                                <p id="reseterror"></p>
                                <span className="reminder">Remember your password? <a href="/login">Login</a></span>
                            </form>
                        :
                        <form name="form" className="form">
                            <h1>Login</h1>
                            <div className="form-section">
                                <input
                                    className="input"
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    size="20"
                                    value={logEmail}
                                    onChange={e => setLogEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-section">
                                <input
                                    className="input"
                                    required
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    size="20"
                                    value={logPassword}
                                    onChange={e => setLogPassword(e.target.value)}
                                />
                            </div>
                            <input
                                id="regButton"
                                type="button"
                                value="Sign In"
                                onClick={logIn}
                                className="button"
                            />
                            <p id="logerror"></p>
                            <span className="reminder">Don't have an account? <a href="/registration">Sign Up</a></span>
                            <span className='reminder' >Forgot your password? <a href="/forget" style={{ fontSize: "1.2rem" }}>Reset it</a></span>
                        </form>
                }
            </div>
        </div>
    )
})

export default Auth