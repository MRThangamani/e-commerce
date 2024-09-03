import React, { useState }  from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './Signup.css';
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().oneOf(['customer', 'admin'], 'Invalid role').required('Role is required')
});

const Signup = () => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    fetch(`${apiUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message); 
          navigate('/login');
        } else {
          toast.error('Signup failed. Please try again.'); 
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('An error occurred. Please try again.'); 
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <Formik
        initialValues={{ name: '', email: '', phone: '', password: '', role: 'customer' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <label>
              Name <span className='is_required'>*</span>
            </label>
            <Field type="text" name="name" placeholder="Name" />
            <ErrorMessage name="name" component="div" className="error" />

            <label>
              Email <span className='is_required'>*</span>
            </label>
            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" className="error" />

            <label>
              Phone Number <span className='is_required'>*</span>
            </label>
            <Field type="text" name="phone" placeholder="Phone Number" />
            <ErrorMessage name="phone" component="div" className="error" />

            <label>
              Password <span className='is_required'>*</span>
            </label>
            <div className="password-field">
              <Field
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                placeholder="Password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            <ErrorMessage name="password" component="div" className="error" />

            <div className="role-selection">
              <label>
                Role <span className='is_required'>*</span>
              </label>
              <div>
                <label>
                  <Field
                    type="radio"
                    name="role"
                    value="customer"
                    checked={values.role === 'customer'}
                    onChange={() => setFieldValue('role', 'customer')}
                  />
                  Customer
                </label>
                <label>
                  <Field
                    type="radio"
                    name="role"
                    value="admin"
                    checked={values.role === 'admin'}
                    onChange={() => setFieldValue('role', 'admin')}
                  />
                  Admin
                </label>
              </div>
              <ErrorMessage name="role" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Signup
            </button>

            <div className="existing-user-info">
                <p>You are already registered. <button onClick={() => navigate('/login')}>Login here</button></p>
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
};

export default Signup;
