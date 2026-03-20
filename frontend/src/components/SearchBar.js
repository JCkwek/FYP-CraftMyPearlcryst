import styles from './SearchBar.module.css'

function SearchBar({value, onChange, onSearch}){
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        onSearch();
    }
  };
    return(
        <div className={styles.searchBarContainer}>
            <input type="text" 
            className={styles.searchInput}
            placeholder="Search product"
            value={value}
            onChange={(e)=> onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            />
                <button className={styles.searchButton} onClick={onSearch}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
        </div>
    )
}

export default SearchBar;

