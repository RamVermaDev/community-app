import { useMemo, useRef, useState } from 'react'
import axios from 'axios'
import styles from './ProfilePicture.module.css'
import { FiCamera, FiX } from 'react-icons/fi'

export default function ProfilePicture({ user, onUpdated }) {
  const initials = useMemo(() => {
    if (!user?.name) return 'U'

    return user.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('')
  }, [user])

  const profileImg = user?.profilePicture
    ? `http://localhost:8080/${user.profilePicture}`
    : null

  const fileRef = useRef(null)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleIconClick = () => {
    fileRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setError('')
    setShowPopup(true)
  }

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token || !selectedFile) return

      setSaving(true)
      setError('')

      const formData = new FormData()
      formData.append('profileImage', selectedFile)

      const response = await axios.put(
        'http://localhost:8080/update-profile-Image',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setShowPopup(false)
      setSelectedFile(null)
      setPreview('')

      if (onUpdated) onUpdated(response.data.user)
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to save profile photo')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setShowPopup(false)
    setSelectedFile(null)
    setPreview('')
    setError('')
  }

  return (
    <div className={styles.avatarWrap}>
      <div className={styles.avatar}>
        {preview || profileImg ? (
          <img
            src={preview || profileImg}
            alt="Profile"
            className={styles.avatarImg}
          />
        ) : (
          <div className={styles.initials}>{initials}</div>
        )}
      </div>

      <button
        type="button"
        className={styles.editBtn}
        onClick={handleIconClick}
        aria-label="Change profile photo"
      >
        <FiCamera size={16} />
      </button>

      <input
        type="file"
        ref={fileRef}
        accept="image/*"
        onChange={handleFileChange}
        hidden
      />

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupBox}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleCancel}
              aria-label="Close"
            >
              <FiX size={18} />
            </button>

            <img src={preview} alt="Selected profile preview" className={styles.previewImg} />
            <h3>Update profile photo</h3>
            <p>Save this image as your public profile picture.</p>
            {error && <span className={styles.error}>{error}</span>}

            <div className={styles.popupActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleUpdate}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
