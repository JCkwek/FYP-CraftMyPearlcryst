import buttonStyles from './ButtonTheme.module.css';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function BackButton({ to = null, label = "Back" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button className={`${buttonStyles.button} ${buttonStyles.plain}`} onClick={handleBack}>
      <FiArrowLeft 
        style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginRight: '1rem'
        }}
        />
       {label}
    </button>
  );
}

export default BackButton;