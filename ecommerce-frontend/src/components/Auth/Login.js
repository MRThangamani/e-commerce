import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './Login.css'; 
import { useAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';


const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    const { email, password } = values;

    login(email, password)
      .then(response => {
        if(response.success){
          toast.success(response.message);
        }
        else{
          toast.error(response.message);
        }
      })
      .catch(error => {
        toast.error(error);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="email">Email <span className='is_required'>*</span></label>
              <Field
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
              />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password <span className='is_required'>*</span></label>
              <Field
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Login
            </button>

            <div className="existing-user-info">
                <p><button onClick={() => navigate('/')}>Signup</button></p>
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
};

export default Login;
