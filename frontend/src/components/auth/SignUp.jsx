import { useState } from 'react'
import styles from './SignUp.module.css'
import { Link } from 'react-router-dom'
import CustomButton from '../buttons/CustomButton'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function SignUp() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    })

    const [error, setError] = useState('')

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            const response = await axios.post('http://localhost:8080/signup', formData, { 'content-type': 'application/json' })
            if (response.status === 201) {
                alert('Account created successfully!')
                navigate('/login')
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Unable to connect to the server')
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>Sign Up</h1>
                <div className={styles.errorContainer}>
                    {error && <p className={styles.error}>{error}</p>}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className={styles.form}
                >
                    <input
                        type="text"
                        placeholder="name"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={onChange}
                    />

                    <input
                        type="text"
                        placeholder="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                    />

                    <CustomButton
                        text="Sign Up"
                        style={styles.button}
                    />
                </form>

                <p className={styles.loginLink}>
                    Already have an account?{' '}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}
