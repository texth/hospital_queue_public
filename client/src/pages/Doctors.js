import React, { useContext, useEffect, useState } from 'react'
import Doctor from '../components/Doctor'
import { getDoctors } from '../http/doctorAPI'
import { doctorSlots } from '../http/slotAPI'
import { useSearchParams } from 'react-router-dom'
import { Context } from "../index";
// import FloatingAddButton from '../components/FloatingAddButton'
// import { getTag } from '../http/tagsAPI'

const Doctors = (props) => {
    const [loading, setLoading] = useState(true)

    const [doctors, setDoctors] = useState([])

    const [searchParams, setSearchParams] = useSearchParams()

    let status = searchParams.get("status")
    let user_id = searchParams.get("userid")

    if (props.user_id) {
        user_id = props.user_id
    }

    let uncheck = () => {
        document.getElementById("free").checked = false;
        check()
    }

    let check = () => {
        if (document.getElementById("free").checked) {
            status = "free"
        } else {
            status = "null"
        }
        update().then(data => {
            setDoctors(data.doctors)
            setLoading(false)
        })
    }

    let update = async () => {
        let doctors = await getDoctors()
        console.log(doctors);
        for (let i = 0; i < doctors.length; i++) {
            let slots = await doctorSlots(doctors[i].id)
            doctors[i].slots = slots
        }
        return doctors
    }

    try {
        useEffect(() => {
            update().then(data => {
                setDoctors(data)
                setLoading(false)
            })
        }, [])
    } catch (e) {
        setLoading(false)
    }

    if (loading) {
        return <div>Loading</div>
    }

    console.log(doctors);

    return (
        <div>
            <form>
                <ul id='sortbar'>
                    <li><div className='wrapper'>
                        <input type="button" id="all" name="status" value="all" onClick={uncheck}></input><label htmlFor="all">All</label>
                        <input type="radio" id="free" name="status" value="free" onClick={check}></input><label htmlFor="free">Free</label>
                    </div></li>
                </ul>
            </form>
            {doctors.map((doctor) => (
                <Doctor key={doctor.id} doctor={doctor} />
            ))}
        </div>
    )
}

export default Doctors