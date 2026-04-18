import styles from './AiChat.module.css';
import { useState } from 'react';
import api from '../api';

function AiChat(){
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', text: input };
        setMessages([...messages, userMsg]);
        setLoading(true);
        setInput(""); // Clear input 
        
        try{
            const { data } = await api.post('/aichat/chat/recommend', { userPrompt: input });
            setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
        }catch(error){
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to my jewelry catalog right now." }]);
        }finally{
            setLoading(false);
        }

    };
    return(
        <div className={styles.aichat}>
            <div className={styles.aichatContentCotainer}>
                <h2>AI Chat</h2>

                <div className="chat-container">
                    <div className="messages">
                        {messages.map((m, i) => (
                            <p key={i} className={m.role}>{m.text}</p>
                        ))}
                    </div>
                    <input value={input} onChange={(e) => setInput(e.target.value)} />
                    <button onClick={handleSend}>Ask AI</button>
                </div>
            </div>
        </div>
    )
}

export default AiChat;