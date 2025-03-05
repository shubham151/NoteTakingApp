import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [user, setUser] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(user);
      localStorage.setItem('token', res.accessToken);
      console.log(res)
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '350px' }}>
        <h2 className="text-center mb-3">Login</h2>
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
              type="password" 
              className="form-control" 
              placeholder="Password" 
              onChange={(e) => setUser({ ...user, password: e.target.value })} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
