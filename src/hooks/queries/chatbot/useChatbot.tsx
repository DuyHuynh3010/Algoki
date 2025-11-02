import { useMutation, useQuery } from "@tanstack/react-query";
import { courseAPI } from "@/api/endpoints/course.api";
import { courseKeys } from "@/hooks/queries/course/useCourses";
import { chatbotAPI } from "@/api/endpoints/chatbot.api";

export const useGetMessageChatbot = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.modulesForUser(courseId),
    queryFn: () => courseAPI.getModuleForUser(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSendMessageChatbot = () => {
  const sendMessageSuggest = useMutation({
    mutationFn: (mess: FormData) => chatbotAPI.sendMessageSuggest(mess)
  })

  const sendMessageBasic = useMutation({
    mutationFn: (mess: FormData) => chatbotAPI.sendMessageBasic(mess)
  })

  // New chat APIs
  const createChat = useMutation({
    mutationFn: (payload: { title: string; forceCreate?: boolean }) =>
        chatbotAPI.createChat(payload),
  });

  const sendMessageToChat = useMutation({
    mutationFn: (params: { chatId: number; message_text: string; user_id: string }) =>
        chatbotAPI.sendMessageToChat(params.chatId, { message_text: params.message_text, user_id: params.user_id }),
  });

  const getChatDetail = useMutation({
    mutationFn: (chatId: string) => chatbotAPI.getChatDetail(chatId),
  });

  const getChatMessages = useMutation({
    mutationFn: (chatId: string) => chatbotAPI.getChatMessages(chatId),
  });

  return { sendMessageSuggest, sendMessageBasic, createChat, sendMessageToChat, getChatDetail, getChatMessages }
}
