import React, { useContext, useEffect } from 'react'
import "../css/doctor.css"
import UserImg from './UserImg'
import { Context } from "../index";
import { doctorSlots, mySlots, bookSlot, cancelSlot } from '../http/slotAPI'
import { set } from 'mobx';

const Doctor = (props) => {
    const { user } = useContext(Context);

    const [showMenu, setShowMenu] = React.useState(false)
    const [time, setTime] = React.useState("14:00")
    const [question, setQuestion] = React.useState("")
    const [answer, setAnswer] = React.useState("")
    const [selectedSlot, setSelectedSlot] = React.useState(null)
    const [slots, setSlots] = React.useState(props.doctor.slots)

    let slotClick = (slot) => {
        if (user.isAuth) {
            console.log(slot)
            console.log(user.user)
            if (slot.available) {
                setQuestion("Do you want to make an appointment with ")
                setAnswer("Make appointment")
                setTime(new Date(slot.time).toLocaleString())
                setSelectedSlot(slot)
                setShowMenu(true)
            } else if (slot.user_id == user.user.id) {
                setQuestion("Do you want to cancel your appointment with ")
                setAnswer("Cancel appointment")
                setTime(new Date(slot.time).toLocaleString())
                setSelectedSlot(slot)
                setShowMenu(true)
            }
        }
    }

    let yes = () => {
        if (answer == "Make appointment") {
            makeAppointment()
        } else {
            cancelAppointment()
        }
    }

    let makeAppointment = () => {
        bookSlot(selectedSlot.id).then(() => {
            update()
        })
        setShowMenu(false)
    }

    let cancelAppointment = () => {
        cancelSlot(selectedSlot.id).then(() => {
            update()
        })
        // cancel appointment
        setShowMenu(false)
    }

    let update = async () => {
        let slots = await doctorSlots(props.doctor.id)
        try {
            let myslots = await mySlots()
            for (let i = 0; i < slots.length; i++) {
                for (let j = 0; j < myslots.length; j++) {
                    if (slots[i].id == myslots[j].id) {
                        slots[i].user_id = user.user.id
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
        setSlots(slots)
        return slots
    }

    try {
        useEffect(() => {
            update();
        }, []);
    } catch (e) {
    }

    return (
        <div className="doctor">
            <div className="doctor-content">
                <div className="doctor-header">
                    <div className="doctor-avatar">
                        <UserImg pic={props.doctor.doctor_picture} width="30" height="30" />
                    </div>
                    <div className="doctor-text">
                        <div className="doctor-name">
                            {props.doctor.full_name}
                        </div>
                        <div className="doctor-description">
                            {props.doctor.description}
                        </div>
                    </div>
                </div>
                <div className="doctor-slots">
                    {slots.map((slot) => (
                        <div key={slot.id} className="doctor-slot" onClick={() => slotClick(slot)} style={{ 
                            backgroundColor: slot.available ? "#04AA6D" : (slot.user_id == user.user.id && user.isAuth ? "#1b8fc5" : "#5f5f5f"), 
                            cursor: slot.available || (slot.user_id == user.user.id && user.isAuth) ? "pointer" : "default"
                        }}>
                            {new Date(slot.time).toLocaleString()}
                        </div>
                    ))}
                </div>
            </div>
            <div className="floating-container" style={{ display: showMenu ? 'block' : 'none' }}>
                <div className="floating-menu">
                    <div className="floating-menu-title">
                        {question} {props.doctor.full_name}?
                    </div>
                    <div className="floating-menu-time">
                        Time: {time}
                    </div>
                    <div className="floating-menu-buttons">
                        <button className="floating-menu-button-yes" onClick={() => yes()}>{answer}</button>
                        <button className="floating-menu-button-no" onClick={() => setShowMenu(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Doctor