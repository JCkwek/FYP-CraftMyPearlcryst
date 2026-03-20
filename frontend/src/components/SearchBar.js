import styles from './SearchBar.module.css'

function SearchBar(){
    return(
        <div className={styles.searchBarContainer}>
            <input type="text" className={styles.searchInput} placeholder="Search product"></input>
                <button className={styles.searchButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
        </div>
    )
}

export default SearchBar;

