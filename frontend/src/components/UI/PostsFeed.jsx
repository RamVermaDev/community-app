import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import styles from './PostsFeed.module.css'

export default function PostsFeed({ userId = null, showAll = true, newPost = null }) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                setError('')

                const token = localStorage.getItem('token')

                const url = showAll
                    ? 'http://localhost:8080/posts'
                    : `http://localhost:8080/posts/user/${userId}`

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setPosts(response.data.posts || [])
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load posts')
            } finally {
                setLoading(false)
            }
        }

        if (showAll || userId) {
            fetchPosts()
        }
    }, [showAll, userId])

    const visiblePosts = useMemo(() => {
        if (!newPost?._id || posts.some((post) => post._id === newPost._id)) {
            return posts
        }

        return [newPost, ...posts]
    }, [newPost, posts])

    const handleLike = async (postId) => {
        try {
            const token = localStorage.getItem('token')

            const response = await axios.put(
                `http://localhost:8080/posts/${postId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setPosts((prev) => {
                if (!prev.some((post) => post._id === postId)) {
                    return [response.data.post, ...prev]
                }

                return prev.map((post) =>
                    post._id === postId ? response.data.post : post
                )
            })
        } catch (err) {
            alert(err.response?.data?.message || 'Like failed')
        }
    }

    const handleComment = async (postId) => {
        const commentText = prompt('Write your comment')
        if (!commentText) return

        try {
            const token = localStorage.getItem('token')

            const response = await axios.post(
                `http://localhost:8080/posts/${postId}/comments`,
                { text: commentText },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setPosts((prev) => {
                if (!prev.some((post) => post._id === postId)) {
                    return [response.data.post, ...prev]
                }

                return prev.map((post) =>
                    post._id === postId ? response.data.post : post
                )
            })
        } catch (err) {
            alert(err.response?.data?.message || 'Comment failed')
        }
    }

    if (loading) return <p className={styles.message}>Loading posts...</p>
    if (error) return <p className={styles.message}>{error}</p>
    if (!visiblePosts.length) return <p className={styles.message}>No posts found.</p>

    return (
        <div className={styles.feed}>
            {visiblePosts.map((post) => (
                <article key={post._id} className={styles.postCard}>
                    <div className={styles.postHeader}>
                        <div className={styles.author}>
                            {post.userId?.profilePicture ? (
                                <img
                                    src={`http://localhost:8080/${post.userId.profilePicture}`}
                                    alt={post.userId?.name || 'User'}
                                />
                            ) : (
                                <span>{getInitials(post.userId?.name)}</span>
                            )}
                            <div>
                                <h3>{post.userId?.name || 'User'}</h3>
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                        <span className={styles.visibility}>{post.visibility}</span>
                    </div>

                    {post.content && <p className={styles.content}>{post.content}</p>}

                    {post.media && post.mediaType === 'image' && (
                        <img
                            src={`http://localhost:8080/${post.media}`}
                            alt="post media"
                            className={styles.media}
                        />
                    )}

                    {post.media && post.mediaType === 'video' && (
                        <video controls className={styles.media}>
                            <source src={`http://localhost:8080/${post.media}`} />
                        </video>
                    )}

                    {post.postType === 'job' && (
                        <div className={styles.jobBox}>
                            <h4>{post.job?.title || 'Job Title'}</h4>
                            <p>{post.job?.company}</p>
                            <p>{post.job?.location}</p>
                            <p>{post.job?.employmentType}</p>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button type="button" onClick={() => handleLike(post._id)}>
                            Like ({post.likes || 0})
                        </button>
                        <button type="button" onClick={() => handleComment(post._id)}>
                            Comment ({post.commentsCount || 0})
                        </button>
                    </div>
                </article>
            ))}
        </div>
    )
}

function getInitials(name) {
    if (!name) return 'U'

    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')
}

function formatDate(value) {
    if (!value) return ''

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value))
}
