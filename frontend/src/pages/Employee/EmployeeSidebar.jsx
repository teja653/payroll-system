// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../../styles/Sidebar.module.css';

const Sidebar = () => {
    const location = useLocation(); // Hook to get the current route path

    // Function to determine if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <aside className={styles.sidebar}>
            <h2>Payroll Manager</h2>
            <nav>
                <ul>
                    <li>
                        <div className={`${styles.navLinks} ${isActive('/admin_dashboard') ? styles.active : ''}`}>
                            <Link to="/employee_dashboard">Dashboard</Link>
                        </div>
                    </li>
                    <li>
                        <div className={`${styles.navLinks} ${isActive('/employees') ? styles.active : ''}`}>
                            <Link to="/employee_profile">Profile</Link>
                        </div>
                    </li>
                    <li>
                        <div className={`${styles.navLinks} ${isActive('/payroll') ? styles.active : ''}`}>
                            <Link to="/apply-leave">Apply for Leave</Link>
                        </div>
                    </li>
                    <li onClick={handleLogout}>
                        <div className={`${styles.navLinks} ${isActive('/logout') ? styles.active : ''}`}>
                            LogOut</div></li>
                </ul>
            </nav>
        </aside>
    );
};

const handleLogout = async () => {
    try {
        await axios.post("http://localhost:5000/logout"); // optional backend call
    } catch { }

    localStorage.removeItem("user"); // clear session

    window.location.href = "/"; // force redirect (important)
};

export default Sidebar;
