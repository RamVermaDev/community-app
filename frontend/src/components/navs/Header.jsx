import styles from './Header.module.css'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import CustomButton from '../buttons/CustomButton'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Header() {
    const navigate = useNavigate()
    let menus = [
        { name: 'Home', path: '/' },
        { name: 'Post', path: '/posts' },
        { name: 'Reel', path: '/reels' },
        { name: 'Connect', path: '/connect' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'Notifications', path: '/notifications' },
        { name: 'Messages', path: '/messages' },
    ]

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const handleProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8080/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.status === 200) {
                navigate('/profile')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.header}>
            <Link to={ "/" } className={styles.logoLink}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="Tech Community" className={styles.logoImg} />
                    <p className={styles.logo}>Tech Community</p>
                </div>
            </Link>
            <ul className={styles.menu}>
                {menus.map((menu) => (
                    <li key={menu.name}>
                        <Link to={menu.path} className={styles.menuItem}>
                            {menu.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className={styles.buttonConatiner}>
                <CustomButton text="Profile" handler={handleProfile} />
                <CustomButton text="Logout" handler={handleLogout} />
            </div>
        </div>
    )
}
