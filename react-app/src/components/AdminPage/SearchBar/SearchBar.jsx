import styles from "./search-bar.module.css";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className={styles.searchWrapper}>
      <i className="fas fa-search"></i>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Поиск..."}
        className={styles.searchInput}
      />
      {value && (
        <button className={styles.clearButton} onClick={() => onChange("")}>
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
