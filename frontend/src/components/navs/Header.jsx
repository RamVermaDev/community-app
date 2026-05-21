import styles from './Header.module.css'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import CustomButton from '../buttons/CustomButton'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Header() {
    const userId = localStorage.getItem('userId')
    const userName = localStorage.getItem('userName')
    const navigate = useNavigate()
    let menus = [
        { name: 'Home', path: `/${userId}/${userName}` },
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

    const handleProfile = () => {
        navigate(`/${userId}/${userName}/profile`)
    }

    return (
        <div className={styles.header}>
            <Link to={userId && userName ? `/${userId}/${userName}` : '/login'} className={styles.logoLink}>
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
