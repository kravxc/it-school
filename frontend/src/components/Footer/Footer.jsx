import React from "react";
import { Link } from "react-router-dom";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <span>© 2026 IT Образовательный портал — классы 9 и 11</span>
          <span className={styles.footerLinks}>
            <Link to="/about">О платформе</Link>
            <Link to="/support">Поддержка</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
