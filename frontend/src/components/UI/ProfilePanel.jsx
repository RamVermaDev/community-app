import React, { useState, useEffect } from 'react'
import styles from './ProfilePanel.module.css'
import CustomButton from '../buttons/CustomButton'
import axios from 'axios'

export default function ProfilePanel({ user, onUpdate }) {
    const accountStatus = user?.isDeleted ? 'Inactive' : 'Active'

    const [isEditing, setIsEditing] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        maritalStatus: '',
        bio: '',
        occupation: '',
        dob: '',
        address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        }
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                gender: user.gender || '',
                maritalStatus: user.maritalStatus || '',
                bio: user.bio || '',
                occupation: user.occupation || '',
                dob: user.dob ? user.dob.slice(0, 10) : '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    zip: user.address?.zip || '',
                    country: user.address?.country || ''
                }
            });
        }
    }, [user]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");

            const payload = {
                ...formData,
                dob: formData.dob || null,
                address: {
                    street: formData.address.street || null,
                    city: formData.address.city || null,
                    state: formData.address.state || null,
                    zip: formData.address.zip || null,
                    country: formData.address.country || null
                }
            };

            const response = await axios.put(
                "http://localhost:8080/update-profile",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setIsEditing(false);
            onUpdate(response.data.user);

            // optional: if parent is not auto-refreshing user, you can use response.data.user
            // console.log(response.data.user);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to save profile");
        }
    };

    return (
        <>
            <section className={styles.panel}>
                <div className={styles.panelHeader}>
                    <div>
                        <p className={styles.eyebrow}>Profile</p>
                        <h2>Personal information</h2>
                    </div>
                    {!isEditing && (
                        <div>
                            <CustomButton text="Edit" handler={() => { setIsEditing(true) }} />
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div>
                        <div className={styles.formGrid}>
                            <InputItem
                                label="Full name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <InputItem
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <InputItem
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <SelectItem
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                options={["Male", "Female", "Other"]}
                            />

                            <SelectItem
                                label="Marital Status"
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={handleChange}
                                options={["Single", "Married", "Divorced", "Widowed"]}
                            />
                            <InputItem
                                label="Date of Birth"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                type="date"
                            />

                            <InputItem
                                label="Occupation"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                            />

                            <InputItem
                                label="Bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.addressSection}>
                            <div className={styles.sectionBox}>
                                <h3 className={styles.sectionTitle}>Address</h3>

                                <div className={styles.formGrid}>
                                    <InputItem
                                        label="Street"
                                        name="street"
                                        value={formData.address.street}
                                        onChange={handleAddressChange}
                                    />
                                    <InputItem
                                        label="City"
                                        name="city"
                                        value={formData.address.city}
                                        onChange={handleAddressChange}
                                    />
                                    <InputItem
                                        label="State"
                                        name="state"
                                        value={formData.address.state}
                                        onChange={handleAddressChange}
                                    />
                                    <InputItem
                                        label="Zip"
                                        name="zip"
                                        value={formData.address.zip}
                                        onChange={handleAddressChange}
                                    />
                                    <InputItem
                                        label="Country"
                                        name="country"
                                        value={formData.address.country}
                                        onChange={handleAddressChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.buttonGroup}>
                            <CustomButton text="Save" handler={handleSave} />
                            <CustomButton text="Cancel" handler={() => { setIsEditing(false) }} />
                        </div>
                    </div>
                ) : (
                    <div className={styles.infoGrid}>
                        <InfoItem label="Full name" value={user.name} />
                        <InfoItem label="Email address" value={user.email} />
                        <InfoItem label="Phone number" value={user.phone} />
                        <InfoItem label='Gender' value={user.gender} />
                        <InfoItem label='Marital Status' value={user.maritalStatus} />

                        <InfoItem label='Date Of Birth' value={formatDate(user.dob)} />
                        <InfoItem label='Bio' value={user.bio} />
                        <InfoItem label='Occupation' value={user.occupation} />
                    </div>
                )}
            </section>
        </>
    )
}

function InputItem({ label, value, name, onChange, type = "text" }) {
    return (
        <div className={styles.inputItem}>
            <span>{label}</span>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={styles.input}
            />
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

function SelectItem({ label, name, value, onChange, options }) {
    return (
        <div className={styles.inputItem}>
            <span>{label}</span>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={styles.input}
            >
                <option value="">Select</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
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