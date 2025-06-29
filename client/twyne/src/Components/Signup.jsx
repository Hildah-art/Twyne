import React, { useState } from 'react';
// If you plan to navigate after signup, uncomment this:
// import { useNavigate } from 'react-router-dom';

const Signup = () => {
  // State for managing all form inputs
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    bio: '',
    email: '',
    password: '',
    // If you plan to add an image upload input,
    // you'll want to add image_url here too:
    // image_url: '',
  });

  // State for client-side validation errors
  const [errors, setErrors] = useState({});
  // State for loading indicator during API call
  const [loading, setLoading] = useState(false);
  // State for displaying errors received from the server
  const [serverError, setServerError] = useState(null);

  // If using react-router-dom for navigation:
  // const navigate = useNavigate();

  // Handle changes to form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear the specific error when the user starts typing in that field
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  // Client-side form validation logic
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || parseInt(formData.age) <= 0) newErrors.age = 'Age is required and must be a positive number';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setServerError(null); // Clear any previous server errors
      return; // Stop submission if validation fails
    }

    // Clear previous errors and set loading state
    setErrors({});
    setServerError(null);
    setLoading(true);

    // Prepare data to send to the backend
    const dataToSend = {
      name: formData.name,
      // Provide a default image_url if not explicitly set by user input
      image_url: formData.image_url || 'https://via.placeholder.com/150?text=User',
      email: formData.email,
      password: formData.password,
      age: parseInt(formData.age), // Ensure age is an integer
      gender: formData.gender,
      location: formData.location,
      bio: formData.bio,
    };

    fetch('http://localhost:5555/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          // If response is not OK, parse the error from the server
          return response.json().then((errorData) => {
            throw new Error(errorData.error || 'Signup failed');
          });
        }
        // If response is OK, parse the success data
        return response.json();
      })
      .then((responseData) => {
        console.log('User created successfully:', responseData.user);

        // Store access token and user ID if provided by the backend
        if (responseData.access_token) {
          localStorage.setItem('access_token', responseData.access_token);
          localStorage.setItem('user_id', responseData.user.id);
        }

        // Redirect to a protected route after successful signup (e.g., /mymatches)
        // if (navigate) {
        //   navigate('/mymatches');
        // }
        // For demonstration, you might want an alert or message here if not navigating
        alert('Signup successful! You can now log in.');
      })
      .catch((err) => {
        // Handle any errors during the fetch or parsing process
        console.error('Signup error:', err);
        setServerError(err.message || 'An unexpected error occurred during signup.');
      })
      .finally(() => {
        // Always stop loading, regardless of success or failure
        setLoading(false);
      });
  };

  return (
    <div className="signup-container">
      <h2>Join the Adventure</h2>
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* Age Input */}
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="Your age"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <span className="error">{errors.age}</span>}
        </div>

        {/* Gender Select */}
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Non-binary</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>

        {/* Location Input */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Your location"
            value={formData.location}
            onChange={handleChange}
          />
          {errors.location && <span className="error">{errors.location}</span>}
        </div>

        {/* Bio Textarea */}
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Tell us a little about yourself..."
            value={formData.bio}
            onChange={handleChange}
          />
          {errors.bio && <span className="error">{errors.bio}</span>}
        </div>

        {/* Email Input */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your email address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Choose a strong password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {/* Server Error Message */}
        {serverError && <p className="error-message">{serverError}</p>}
      </form>
    </div>
  );
};

export default Signup;