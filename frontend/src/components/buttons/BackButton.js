import styles from './BackButton.module.css';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // goes back to previous page
  };

  return (
    <button className={styles.backButton} onClick={handleBack}>
      <FiArrowLeft className={styles.backButtonIcon}/>
       Back
    </button>
  );
}

export default BackButton;