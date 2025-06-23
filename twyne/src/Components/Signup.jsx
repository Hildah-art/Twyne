import React, { useState } from 'react';


const Signup = ({ onSignup }) => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      
      if (onSignup) onSignup(formData);
      console.log('Form submitted:', formData);
    }
  };

  return (
    <div className="signup-container">
      <h2>Join the adventure</h2>
      <form onSubmit={handleSubmit}>

        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}

        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />

        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="nonbinary">Non-binary</option>
          <option value="other">Other</option>
        </select>

        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <textarea name="bio" placeholder="Tell us a little about yourself..." value={formData.bio} onChange={handleChange} />

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}

        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;
