import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>Welcome to Note App</h1>
      <div className={styles.buttons}>
        <Link to="/login" className={styles.button}>Login</Link>
        <Link to="/signup" className={styles.button}>Signup</Link>
      </div>
    </div>
  );
};

export default Home;
