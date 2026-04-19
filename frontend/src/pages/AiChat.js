import styles from './AiChat.module.css';
import buttonStyles from '../components/buttons/ButtonTheme.module.css';
import { useState, useEffect, useRef } from 'react';
import api from '../api';
import ReactMarkdown from 'react-markdown';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api/productApi';
import ErrorBanner from '../components/ErrorBanner';


function AiChat(){
    const [catalog, setCatalog] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeoutMessage, setTimeoutMessage] = useState(null);
    const messagesEndRef = useRef(null);
    const standardWelcome = [
        {
            role: 'ai',
            text: "Welcome to **CraftMyPearlCryst**. I am your personal jewelry concierge. How may I assist you today?"
        }
    ];
    //initialize messages from localStorage
    const [messages, setMessages] = useState(() => {
        const savedChat = localStorage.getItem('pearlcryst_chat');
        return savedChat ? JSON.parse(savedChat) : standardWelcome;
    });

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Check for session timeout on mount
    useEffect(() => {
        const lastActive = localStorage.getItem('pearlcryst_chat_timestamp');
        const now = Date.now();
        const timeoutLimit = 5 * 60 * 1000; // 5 minutes
        if (lastActive && (now - parseInt(lastActive) > timeoutLimit)) {
            // clear storage
            localStorage.removeItem('pearlcryst_chat');
            localStorage.removeItem('pearlcryst_chat_timestamp');
            // reset the chat state
            setMessages(standardWelcome);
            // show the banner
            triggerTimeoutBanner(); 
        }
    }, []);

    // saving to LocalStorage 
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('pearlcryst_chat', JSON.stringify(messages));
            localStorage.setItem('pearlcryst_chat_timestamp', Date.now().toString());
        }
    }, [messages]);

    useEffect(() => {
        const loadCatalog = async () => {
            try {
                const res = await getProducts({ onlyAvailable: true });
                setCatalog(res);
            } catch (err) {
                console.error("Chat Catalog Error:", err);
            }
        };
        loadCatalog();
    }, []);

    const triggerTimeoutBanner = () => {
        setTimeoutMessage("Your previous session has timed out.");
        setTimeout(() => setTimeoutMessage(null), 10000); //hide banner after 5 seconds
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);
        setInput("");
        
        try{
            const { data } = await api.post('/aichat/chat/recommend', { userPrompt: input });
            setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
        }catch(error){
            console.error("Chat Error:", error);
            const isOverloaded = error.response?.status === 503 || error.message.includes('503');
            const errorMessage = isOverloaded 
            ? "Our AI concierge is currently assisting many guests. Please try again in a moment!"
            : "I'm having a moment to polish our pearls. Please try again in a second!";
            setMessages(prev => [...prev, { role: 'ai', text: errorMessage }]);
        }finally{
            setLoading(false);
        }

    };

    //render product card function
    const renderMsgWithProductCards = (content) => {
        // find all matches for [ID:xx]
        const idRegex = /\[ID:(\d+)\]/g;
        const matches = [...content.matchAll(idRegex)];
        
        // extract the numbers and find the products
        const productIds = matches.map(match => parseInt(match[1]));
        const foundProducts = catalog.filter(p => productIds.includes(p.product_id));
        const cleanText = content
            .replace(/\[ID:\d+\]/g, '') // Remove IDs
            .replace(/(\n\* .+) \n([A-Z])/g, '$1\n\n$2') // Force space after bullets
            .trim();

        console.log("AI suggested these IDs:", productIds);
        return (
            <>
                <ReactMarkdown>{cleanText}</ReactMarkdown>
                {foundProducts.length > 0 && (
                    <div className={styles.chatProductCardContainer}>
                        {foundProducts.map((product, index) => (
                            <div key={index} className={styles.chatCardWrapper}>
                                <ProductCard product={product}/>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    };



    return(
        <div className={styles.aichat}>
            <div className={styles.aichatContentCotainer}>
                <div className={styles.aichatHeader}>
                    <h2>Pearlcryst Assistant</h2>
                    <p>Elegance at your service</p>
                    {timeoutMessage && (
                        <ErrorBanner message={timeoutMessage} type="warning" /> 
                    )}
                </div>

                <div className={styles.chatContainer}>

                    <div className={styles.chatList}>
                        {messages.map((m, i) => (
                            <div key={i} className={`${styles.chatWrapper} ${m.role === 'user' ? styles.userAlign : styles.aiAlign}`}>
                                <div className={m.role === 'user' ? styles.userBubble : styles.aiBubble}>
                                    {m.role === 'ai' ? (
                                        renderMsgWithProductCards(m.text)
                                        ) : (
                                            m.text
                                        )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className={styles.aiAlign}>
                                <div className={`${styles.aiBubble} ${styles.loading}`}>
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef}/>
                    </div>
         
                    <div className={styles.aichatInputContainer}>
                        <input 
                            placeholder="Ask about our collection"
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            onKeyPress={(e)=> e.key === 'Enter' && handleSend()}
                        />
                        <button className={`${buttonStyles.button} ${buttonStyles.main}`} onClick={handleSend} disabled={loading}>Ask AI</button>
                    </div>
                  
                </div>
            </div>
        </div>
    )
}

export default AiChat;