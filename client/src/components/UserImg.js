import React from 'react'

const UserImg = (props) => {
    let img;
    if (props.pic) {
        img = "/img/avatars/" + props.pic
    } else {
        img = "/img/avatars"
    }
  return (
    <div>
        <img src={img} width={props.width} height={props.height} id={props.id}></img>
    </div>
  )
}

export default UserImg