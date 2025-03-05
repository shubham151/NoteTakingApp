import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(user);
      navigate('/login');
    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h2 className="text-center mb-3">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Username" 
              onChange={(e) => setUser({ ...user, username: e.target.value })} 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Email" 
              onChange={(e) => setUser({ ...user, email: e.target.value })} 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="First Name" 
              onChange={(e) => setUser({ ...user, firstName: e.target.value })} 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Last Name" 
              onChange={(e) => setUser({ ...user, lastName: e.target.value })} 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Password" 
              onChange={(e) => setUser({ ...user, password: e.target.value })} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
