import styles from './Cart.module.css';
import CartItemCard from '../components/CartItemCard';
import { useEffect, useState } from 'react';
// import axios from 'axios';
import api from '../api';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true); // Changed from [] to true

    useEffect(() => {
        const fetchCart = async () => {
            try {
                // const token = localStorage.getItem('token');
                // const res = await axios.get('http://localhost:3000/cart', {
                //     headers: { Authorization: `Bearer ${token}` }
                // });
                const res = await api.get('/cart')
                setCartItems(res.data);
            } catch (err) {
                console.error("Error fetching cart:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    if (loading) return <div className={styles.loadingContainer}><p>Loading your cart...</p></div>;

    const handleUpdateQuantity = async (cartItemId, action) => {
        try{
            // const token = localStorage.getItem('token');
            await api.put(`/cart/update`, 
                {cartItemId, action},
                // {headers: {Authorization: `Bearer ${token}`}}
            );

            setCartItems(prevItems => prevItems.map(item => {
                if(item.cart_item_id === cartItemId){
                    const newQty = action === 'increment'? item.quantity + 1 : Math.max(1, item.quantity - 1);
                    return {...item, quantity : newQty};
                }
                return item;
            }));
        }catch(err){
            console.error("Failed to update quantity", err);
        }
    };

    const handleDeleteItem = async (cartItemId) => {
        try {
            // const token = localStorage.getItem('token');
            await api.delete(`/cart/${cartItemId}`, {
                // headers: { Authorization: `Bearer ${token}` }
            });

            // Remove from local state immediately
            setCartItems(prev => prev.filter(item => item.cart_item_id !== cartItemId));
        } catch (err) {
            console.error("Failed to delete item", err);
        }
    };

    const grandTotal = cartItems.reduce((acc,item) => {
        const price = parseFloat(item.Product?.product_price) || 0;
        return acc + (price * item.quantity);
    }, 0);

    const handleCheckout = async () => {
        try{
            // const token = localStorage.getItem('token');
            const res = await api.post('/orders/checkout', 
                {cartItems},
                // {headers: {Authorization: `Bearer ${token}`}}
            );
            //redirect to stripe
            if(res.data.url){
                window.location.href = res.data.url;
            }
        }catch(err){
            console.error("Checkout Error:", err);
        }
    }

    return (
        <div className={styles.cart}>
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
                                <CartItemCard 
                                    key={item.cart_item_id} 
                                    item={item} 
                                    onUpdateQty={handleUpdateQuantity}
                                    onDelete={handleDeleteItem}
                                />
                            ))}
                            <div className={styles.cartSummary}>
                                <div className={styles.grandTotalRow}>
                                    <span>Grand Total:</span>
                                    <span className={styles.grandTotalAmount}>RM {grandTotal.toFixed(2)}</span>
                                </div>
                                <button className={styles.checkoutBtn} onClick={handleCheckout}>Proceed to Checkout</button>
                            </div>
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