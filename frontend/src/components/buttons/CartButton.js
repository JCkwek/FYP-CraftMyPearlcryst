import styles from './CartButton.module.css'
import { FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CartButton() {
  const navigate = useNavigate();

    const handleClick = () => {
         navigate(`/cart`);
    };

  return (
    <button className={styles.cartButton} onClick={handleClick}>
      <FaShoppingBag className={styles.cartButtonIcon} />
    </button>
  );
}

export default CartButton;