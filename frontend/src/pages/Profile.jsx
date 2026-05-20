import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/navs/Header'
import styles from './Profile.module.css'

import ProfilePicture from '../components/UI/ProfilePicture'

export default function Profile() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token')

            if (!token) {
                navigate('/login')
                return
            }

            try {
                const response = await axios.get('http://localhost:8080/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setUser(response.data)
            } catch (error) {
                setError(error.response?.data?.message || 'Unable to load your profile')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [navigate])

    const initials = useMemo(() => {
        if (!user?.name) {
            return 'U'
        }

        return user.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join('')
    }, [user])

    const joinedDate = formatDate(user?.createdAt)
    const updatedDate = formatDate(user?.updatedAt)
    const accountStatus = user?.isDeleted ? 'Inactive' : 'Active'

    return (
        <div className={styles.page}>
            <Header />

            <main className={styles.shell}>
                {loading && (
                    <section className={styles.statePanel}>
                        <div className={styles.loader}></div>
                        <p>Loading profile</p>
                    </section>
                )}

                {!loading && error && (
                    <section className={styles.statePanel}>
                        <h1>Profile unavailable</h1>
                        <p>{error}</p>
                        <Link to="/login" className={styles.primaryLink}>
                            Back to login
                        </Link>
                    </section>
                )}

                {!loading && !error && user && (
                    <>
                        <section className={styles.hero}>
                            <div className={styles.identity}>
                                <ProfilePicture user={user} onUpdated={setUser} />
                                <div>
                                    <p className={styles.eyebrow}>Community member</p>
                                    <h1>{user.name}</h1>
                                    <p className={styles.email}>{user.email}</p>
                                </div>
                            </div>

                            <div className={styles.statusBlock}>
                                <span className={user.isDeleted ? styles.inactiveBadge : styles.activeBadge}>
                                    {accountStatus}
                                </span>
                                <p>Member since {joinedDate}</p>
                            </div>
                        </section>

                        <section className={styles.contentGrid}>
                            <div className={styles.mainColumn}>
                                <section className={styles.panel}>
                                    <div className={styles.panelHeader}>
                                        <div>
                                            <p className={styles.eyebrow}>Profile</p>
                                            <h2>Personal information</h2>
                                        </div>
                                    </div>

                                    <div className={styles.infoGrid}>
                                        <InfoItem label="Full name" value={user.name} />
                                        <InfoItem label="Email address" value={user.email} />
                                        <InfoItem label="Phone number" value={user.phone} />
                                        <InfoItem label="Account status" value={accountStatus} />
                                    </div>
                                </section>

                                <section className={styles.panel}>
                                    <div className={styles.panelHeader}>
                                        <div>
                                            <p className={styles.eyebrow}>Account</p>
                                            <h2>System details</h2>
                                        </div>
                                    </div>

                                    <div className={styles.timeline}>
                                        <div>
                                            <span></span>
                                            <div>
                                                <strong>Account created</strong>
                                                <p>{joinedDate}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span></span>
                                            <div>
                                                <strong>Last profile update</strong>
                                                <p>{updatedDate}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span></span>
                                            <div>
                                                <strong>User ID</strong>
                                                <p>{user._id || 'Not available'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <aside className={styles.sideColumn}>
                                <section className={styles.summaryPanel}>
                                    {user.profilePicture ? (
                                        <img
                                            src={`http://localhost:8080/${user.profilePicture}`}
                                            alt={user.name}
                                            className={styles.avatarLargeImg}
                                        />
                                    ) : (
                                        <div className={styles.avatarLarge}>{initials}</div>
                                    )}
                                    <h2>{user.name}</h2>
                                    <p>{user.email}</p>
                                    <div className={styles.divider}></div>
                                    <div className={styles.quickStats}>
                                        <div>
                                            <strong>{accountStatus}</strong>
                                            <span>Status</span>
                                        </div>
                                        <div>
                                            <strong>{joinedDate}</strong>
                                            <span>Joined</span>
                                        </div>
                                    </div>
                                </section>
                            </aside>
                        </section>
                    </>
                )}
            </main>
        </div>
    )
}

function InfoItem({ label, value }) {
    return (
        <div className={styles.infoItem}>
            <span>{label}</span>
            <strong>{value || 'Not available'}</strong>
        </div>
    )
}

function formatDate(value) {
    if (!value) {
        return 'Not available'
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(value))
}
