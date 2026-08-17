import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chat';
import { useAppStore } from '../store/useAppStore';

export const GUEST_USER_ID = 'guest_operator_01';

export function useChatHistory() {
  return useQuery({
    queryKey: ['chat-history', GUEST_USER_ID],
    queryFn: () => chatService.getChatHistory(GUEST_USER_ID),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const activeRobotId = useAppStore((state) => state.activeRobotId);

  return useMutation({
    mutationFn: (message: string) => chatService.sendMessage(GUEST_USER_ID, activeRobotId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history', GUEST_USER_ID] });
    },
  });
}
