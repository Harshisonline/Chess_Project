import React from 'react'
import style from './navbar.module.css'

const navbar = () => {
  return (
    <nav>
        <div className={style.logo}>SHATRANJ</div>
        <div>
            <ul>
                <li>profile</li>
                <li>wins</li>
                <li>Losses</li>
            </ul>
        </div>
    </nav>
  )
}

export default navbar