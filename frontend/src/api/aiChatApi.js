import api from './api';

/**
 * Sends a user prompt to the AI Concierge for product recommendations
 * @param {string} userPrompt - The message from the user
 * @returns {Promise<Object>} - The AI response containing the text reply
 */

export const getAiRecommendation = async (userPrompt) => {
    const res = await api.post('/aichat/chat/recommend', { userPrompt });
    return res.data;
};