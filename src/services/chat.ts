import { apiClient } from './api';
import { ChatMessage } from '../types/robot';

export const chatService = {
  getChatHistory: async (userId: string): Promise<ChatMessage[]> => {
    const { data } = await apiClient.get<ChatMessage[]>(`/ai-chat/history?user_id=${userId}`);
    return data;
  },

  sendMessage: async (userId: string, robotId: string, message: string): Promise<ChatMessage> => {
    const { data } = await apiClient.post<ChatMessage>('/ai-chat/', {
      user_id: userId,
      robot_id: robotId,
      message,
    });
    return data;
  },
};
