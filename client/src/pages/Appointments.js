import React, { useContext, useEffect, useState } from 'react'
import Doctor from '../components/Doctor'
import "../css/appointments.css"
import "../css/doctor.css"
import { getDoctors, getDoctor } from '../http/doctorAPI'
import { doctorSlots, mySlots, cancelSlot } from '../http/slotAPI'
import { useSearchParams } from 'react-router-dom'
import { Context } from "../index";
import { trace } from 'mobx'

const Appointments = (props) => {
    const [loading, setLoading] = useState(true)

    const [slots, setSlots] = useState([])
    const [showMenu, setShowMenu] = React.useState(false)
    const [time, setTime] = React.useState("14:00")
    const [selectedSlot, setSelectedSlot] = React.useState(null)

    let update = async () => {
        let slots = await mySlots()
        for (let i = 0; i < slots.length; i++) {
            let doctor = await getDoctor(slots[i].doctor_id)
            slots[i].doctor = doctor
        }
        return slots
    }

    let cancelAppointment = () => {
        if (selectedSlot) {
            cancelSlot(selectedSlot.id).then(() => {
                update().then(data => {
                    setSlots(data)
                })
            })
        }
        setShowMenu(false)
    }

    try {
        useEffect(() => {
            update().then(data => {
                setSlots(data)
                setLoading(false)
            })
        }, [])
    } catch (e) {
        setLoading(false)
    }

    if (loading) {
        return <div>Loading</div>
    }

    console.log(slots);

    return (
        <div className="appointments">
            {slots.map((slot) => (
                <div key={slot.id} className="appointment">
                    <div className="appointment-header">
                        <div className="appointment-doctor">
                            Appointment with {slot.doctor?.full_name}
                        </div>
                        <div className="appointment-time">
                            Time: {new Date(slot.time).toLocaleString()}
                        </div>
                    </div>
                    <button className="button-no" onClick={() => {
                        setSelectedSlot(slot)
                        setTime(new Date(slot.time).toLocaleString())
                        setShowMenu(true)
                    }}>
                        Cancel
                    </button>
                </div>
            ))}
            {slots.length == 0 && <div className="no-appointments">No appointments</div>}
            <div className="floating-container" style={{ display: showMenu ? 'block' : 'none' }}>
                <div className="floating-menu">
                    <div className="floating-menu-title">
                        Cancel appointment with {selectedSlot?.doctor?.full_name}?
                    </div>
                    <div className="floating-menu-time">
                        Time: {time}
                    </div>
                    <div className="floating-menu-buttons">
                        <button className="floating-menu-button-yes" onClick={() => cancelAppointment()}>Yes</button>
                        <button className="floating-menu-button-no" onClick={() => setShowMenu(false)}>No</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Appointments