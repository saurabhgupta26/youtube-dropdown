import React from 'react'
import './Card.css'

export default function Card({ user, searchText, highlighted }) {
    return (
        <div className={`card-style ${highlighted ? "active" : ""}`}>
            <li>{user.id}</li>
            <li>{user.name}</li>
            <li>{user.address}</li>
            <li>`${searchText} found in items`</li>
            <li>{user.pincode}</li>
        </div>
    )
}
