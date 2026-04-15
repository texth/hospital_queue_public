import React, { useContext } from 'react'
import "../css/doctor.css"
import UserImg from './UserImg'
import { Context } from "../index";

const Doctor = (props) => {
    const { user } = useContext(Context);
    // const [edit, setEdit] = React.useState(false)

    // let date = new Date(props.doctor.publish_date)
    // let allowToEdit = (date.getTime() + 7200000) > Date.now()
    // let strDate = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear()
    // let status = props.post.status
    // let color = "#04AA6D"
    // if (status == "active") {
    //     status = "Active"
    // }
    // if (status == "solved") {
    //     status = "Solved"
    //     color = "#777777"
    // }

    // let goToPostPage = () => {
    //     if (!window.location.href.includes("/post/")) {
    //         window.location.href = "/post/" + props.post.id
    //     }
    // }

    // let makeSolved = (event) => {
    //     event.stopPropagation()
    //     patchPost(props.post.id, props.post.title, props.post.content, props.post.tags, "solved")
    //     window.location.reload()
    // }

    // let makeActive = (event) => {
    //     event.stopPropagation()
    //     patchPost(props.post.id, props.post.title, props.post.content, props.post.tags, "active")
    //     window.location.reload()
    // }

    // let deleteButton = (event) => {
    //     event.stopPropagation()
    //     if (window.confirm("Are you sure you want to delete this post?")) {
    //         deletePost(props.post.id)
    //     }
    //     window.location.href = "/"
    // }

    // let goToUserPage = (event) => {
    //     event.stopPropagation()
    //     if (!window.location.href.includes("/user/")) {
    //         window.location.href = "/user/" + props.post.user.id
    //     }
    // }

    // let goToTagPage = (event, id) => {
    //     event.stopPropagation()
    //     window.location.href = "/?tag=" + id
    // }

    return (
        <div className="doctor">
            <div className="doctor-content">
                <div className="doctor-header">
                    <div className="doctor-avatar">
                        <UserImg pic={props.doctor.doctor_picture} width="30" height="30" />
                        <div className="doctor-name">
                            {props.doctor.full_name}
                        </div>
                    </div>
                    <div className="doctor-description">
                        {props.doctor.description}
                    </div>
                </div>
                <div className="doctor-slots">
                    {props.doctor.slots.map((slot) => (
                        <div key={slot.id} className="doctor-slot">
                            {new Date(slot.time).toLocaleString()}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Doctor