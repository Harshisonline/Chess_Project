import React from 'react'
import styles from './chat.module.css'

const chat = () => {
  return (
    <div className={styles.chat}>
        <input type="text" placeholder='Try Chat' />
    </div>
  )
}

export default chat