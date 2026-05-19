import styles from './Header.module.css'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import CustomButton from '../buttons/CustomButton'
import { useNavigate } from 'react-router-dom'

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
                <CustomButton text="Profile" />
                <CustomButton text="Logout" handler={handleLogout} />
            </div>
        </div>
    )
}
