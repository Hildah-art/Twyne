import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirect after signup

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    bio: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || parseInt(formData.age) <= 0)
      newErrors.age = 'Age must be a positive number';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!formData.email.includes('@'))
      newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setServerError(null);
      return;
    }

    setLoading(true);
    setServerError(null);

    const dataToSend = {
      name: formData.name,
      email: formData.email,
      password_hash: formData.password,
      age: parseInt(formData.age),
      gender: formData.gender,
      location: formData.location,
      bio: formData.bio,
    };

    fetch('http://localhost:5555/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || 'Signup failed');
          });
        }
        return res.json();
      })
      .then((responseData) => {
        console.log('User created:', responseData.data);

        // Optional: Store user ID or token if backend adds them
        // localStorage.setItem('user_id', responseData.data.id);

        // Reset form
        setFormData({
          name: '',
          age: '',
          gender: '',
          location: '',
          bio: '',
          email: '',
          password: '',
        });

        alert('Signup successful! You can now log in.');
        navigate('/login'); // Navigate to login page
      })
      .catch((err) => {
        console.error('Signup error:', err);
        setServerError(err.message || 'Unexpected signup error.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="signup-container">
      <h2>Join the Adventure</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
          {errors.age && <span className="error">{errors.age}</span>}
        </div>

        {/* Gender */}
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Non-binary</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
          {errors.location && <span className="error">{errors.location}</span>}
        </div>

        {/* Bio */}
        <div className="form-group">
          <label>Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} />
          {errors.bio && <span className="error">{errors.bio}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {/* Server Error */}
        {serverError && <p className="error-message">{serverError}</p>}
      </form>
    </div>
  );
};

export default Signup;