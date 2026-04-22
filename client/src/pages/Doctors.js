import React, { useContext, useEffect, useState } from 'react'
import Doctor from '../components/Doctor'
import { getDoctors } from '../http/doctorAPI'
import { doctorSlots, mySlots } from '../http/slotAPI'
import { useSearchParams } from 'react-router-dom'
import { Context } from "../index";
// import FloatingAddButton from '../components/FloatingAddButton'
// import { getTag } from '../http/tagsAPI'

const Doctors = (props) => {
    const { user } = useContext(Context);
    
    const [loading, setLoading] = useState(true)

    const [doctors, setDoctors] = useState([])

    const [searchParams, setSearchParams] = useSearchParams()

    let status = searchParams.get("status")

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
            if (status == "free") {
                // show if my slot or available
                data = data.filter(doctor => doctor.slots.some(slot => slot.available || (slot.user_id)))
            }
            setDoctors(data)
            setLoading(false)
        })
    }

    let update = async () => {
        let doctors = await getDoctors()
        for (let i = 0; i < doctors.length; i++) {
            let slots = await doctorSlots(doctors[i].id)
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
            doctors[i].slots = slots
        }
        console.log(doctors);
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