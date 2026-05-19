import styles from './Login.module.css'
import CustomButton from '../buttons/CustomButton'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState('')

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:8080/login', formData)
            
            const token = response.headers.authorization.split(' ')[1]
            localStorage.setItem('token', token)

            if (response.status === 200) {
                navigate('/')
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Unable to connect to the server')
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Login</h1>
                <div className={styles.errorContainer}>
                    {error && <p className={styles.error}>{error}</p>}
                </div>
                <form className={styles.form} onSubmit={onSubmit}>
                    <input type="email" placeholder="Email" name="email" value={formData.email} onChange={onChange} />
                    <input type="password" placeholder="Password" name="password" value={formData.password} onChange={onChange} />
                    <CustomButton text="Login" style={styles.button} />
                </form>

                <p className={styles.loginLink}>Don't have an account? {' '}
                    <Link to="/signup">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}
