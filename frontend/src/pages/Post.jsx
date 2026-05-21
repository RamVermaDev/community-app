import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './Post.module.css'
import Header from '../components/navs/Header'
import PostsFeed from '../components/UI/PostsFeed'
import ProfilePicture from '../components/UI/ProfilePicture'

export default function Post() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [mediaPreview, setMediaPreview] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [mediaFile, setMediaFile] = useState(null)
  const [createdPost, setCreatedPost] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [postData, setPostData] = useState({
    postType: 'post',
    content: '',
    visibility: 'public',
    location: '',
  })

  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    employmentType: '',
  })

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await axios.get('http://localhost:8080/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUser(response.data)
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login')
          return
        }

        setError(error.response?.data?.message || 'Unable to load your account')
      }
    }

    fetchUser()
  }, [navigate])

  const onChange = (e) => {
    const { name, value } = e.target
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setMediaFile(file)

    if (file.type.startsWith('image/')) {
      setMediaType('image')
    } else if (file.type.startsWith('video/')) {
      setMediaType('video')
    } else {
      setMediaType('')
    }

    setMediaPreview(URL.createObjectURL(file))
  }

  const handleJobChange = (e) => {
    const { name, value } = e.target
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const formData = new FormData()
      formData.append('postType', postData.postType)
      formData.append('content', postData.content)
      formData.append('visibility', postData.visibility)
      formData.append('location', postData.location)

      if (mediaFile) {
        formData.append('media', mediaFile)
      }

      if (postData.postType === 'job') {
        formData.append('jobTitle', jobData.title)
        formData.append('jobCompany', jobData.company)
        formData.append('jobLocation', jobData.location)
        formData.append('jobEmploymentType', jobData.employmentType)
      }

      const response = await axios.post('http://localhost:8080/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setCreatedPost(response.data.post)
      setPostData({
        postType: 'post',
        content: '',
        visibility: 'public',
        location: '',
      })
      setJobData({
        title: '',
        company: '',
        location: '',
        employmentType: '',
      })
      clearMedia()
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to publish post')
    } finally {
      setSubmitting(false)
    }
  }

  const clearMedia = () => {
    setMediaFile(null)
    setMediaPreview('')
    setMediaType('')
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.mainColumn}>
            <section className={styles.composerCard}>
              <div className={styles.composerTop}>
                <ProfilePicture user={user} />

                <div className={styles.userMeta}>
                  <h2>{user?.name || 'Create a post'}</h2>
                  <p>{user?.occupation || 'Share an update with your network'}</p>
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.tabs}>
                  <button
                    type="button"
                    className={`${styles.tab} ${
                      postData.postType === 'post' ? styles.activeTab : ''
                    }`}
                    onClick={() =>
                      setPostData((prev) => ({ ...prev, postType: 'post' }))
                    }
                  >
                    Post
                  </button>

                  <button
                    type="button"
                    className={`${styles.tab} ${
                      postData.postType === 'job' ? styles.activeTab : ''
                    }`}
                    onClick={() =>
                      setPostData((prev) => ({ ...prev, postType: 'job' }))
                    }
                  >
                    Job
                  </button>
                </div>

                {postData.postType === 'post' ? (
                  <div className={styles.composerBlock}>
                    <label htmlFor="content" className={styles.label}>
                      What do you want to share?
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      className={styles.textarea}
                      placeholder="Write something inspiring, useful, or exciting..."
                      value={postData.content}
                      onChange={onChange}
                      rows={6}
                    />
                  </div>
                ) : (
                  <div className={styles.jobCard}>
                    <h3>Job details</h3>

                    <div className={styles.jobGrid}>
                      <InputField
                        label="Title"
                        name="title"
                        value={jobData.title}
                        onChange={handleJobChange}
                        placeholder="Frontend Developer"
                      />
                      <InputField
                        label="Company"
                        name="company"
                        value={jobData.company}
                        onChange={handleJobChange}
                        placeholder="Company name"
                      />
                      <InputField
                        label="Location"
                        name="location"
                        value={jobData.location}
                        onChange={handleJobChange}
                        placeholder="Remote / Lucknow / India"
                      />
                      <InputField
                        label="Employment type"
                        name="employmentType"
                        value={jobData.employmentType}
                        onChange={handleJobChange}
                        placeholder="Full-time"
                      />
                    </div>
                  </div>
                )}

                <div className={styles.metaRow}>
                  <InputField
                    label="Location"
                    name="location"
                    value={postData.location}
                    onChange={onChange}
                    placeholder="Add a location"
                  />

                  <div className={styles.selectField}>
                    <label htmlFor="visibility">Visibility</label>
                    <select
                      id="visibility"
                      name="visibility"
                      value={postData.visibility}
                      onChange={onChange}
                    >
                      <option value="public">Public</option>
                      <option value="connections">Connections</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>

                <div className={styles.mediaRow}>
                  <label className={styles.uploadButton}>
                    Add media
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaChange}
                      className={styles.hiddenFile}
                    />
                  </label>

                  {mediaPreview && (
                    <button
                      type="button"
                      className={styles.clearMedia}
                      onClick={clearMedia}
                    >
                      Remove media
                    </button>
                  )}
                </div>

                {mediaPreview && (
                  <div className={styles.previewBox}>
                    {mediaType === 'image' ? (
                      <img src={mediaPreview} alt="Preview" />
                    ) : (
                      <video src={mediaPreview} controls />
                    )}
                  </div>
                )}

                <div className={styles.actions}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={submitting}
                  >
                    {submitting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </form>
            </section>
            <PostsFeed newPost={createdPost} userId={user?._id} />
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <h3>Posting tips</h3>
              <p>Keep it short, clear, and valuable.</p>
              <p>Add media when it helps explain your post better.</p>
              <p>Use job posts only when you are hiring.</p>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}

function InputField({ label, name, value, onChange, placeholder }) {
  return (
    <div className={styles.field}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}
