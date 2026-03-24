import styles from './Cart.module.css';
import BackButton from '../components/buttons/BackButton';
import CartItemCard from '../components/CartItemCard';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true); // Changed from [] to true

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCartItems(res.data);
            } catch (err) {
                console.error("Error fetching cart:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    if (loading) return <p>Loading your cart...</p>;

    return (
        <div className={styles.cart}>
            <BackButton />
            <div className={styles.cartContentContainer}>
                <h2>Your Cart</h2>
                <div className={styles.cartItemContainer}>
                    {cartItems.length > 0 ? (
                        <>
                            <div className={styles.cartHeader}>
                                <div className={styles.cartItemHeader}><h4>Item</h4></div>
                                <div className={styles.cartQtyTotHeaderContainer}>
                                    <div className={styles.cartQtyHeader}><h4>Quantity</h4></div>
                                    <div className={styles.cartTotalHeader}><h4>Total</h4></div>
                                </div>
                            </div>
                            {cartItems.map((item) => (
                                // Ensure you use cart_item_id as the key
                                <CartItemCard key={item.cart_item_id} item={item} />
                            ))}
                        </>
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Cart;