import axios from "axios";
import { NextResponse } from "next/server";
import apiChatbot from "@/api/apiChatbot";

const base = process.env.NEXT_PUBLIC_CHATBOT_API_URL!;
export const chatbotAPI = {
  sendMessageSuggest: async (form: FormData) => {
    try {
      const res = await axios.post("/api/chatbot/suggest", form, {
        timeout: 30000,
      });

      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.message || "Request failed");
      }
      throw err;
    }
  },

  sendMessageBasic: async (formData: FormData) => {
    try {
      const res = await axios.post("/api/chatbot/basic", formData, {
        timeout: 30000,
      });

      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.message || "Request failed");
      }
      throw err;
    }
  },

  // New chat endpoints (server base URL via api instance)
  createChat: async (payload: { title: string; forceCreate?: boolean }) => {
    const res = await apiChatbot.post("/chats", payload);
    return res.data;
  },

  sendMessageToChat: async (
      chatId: number,
      payload: { message_text: string; user_id: string },
  ) => {
    const params = new URLSearchParams();
    params.set("message_text", payload.message_text);
    params.set("user_id", payload.user_id);
    const res = await apiChatbot.post(`/chats/${chatId}/messages/`, params);
    return res.data;
  },

  getChatDetail: async (chatId: string) => {
    const res = await fetch(`${base}/chats/${chatId}`, {
      method: "GET",
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return NextResponse.json({ raw: text }, { status: res.status });
    }
  },

  getChatMessages: async (chatId: string) => {
    const res = await fetch(`${base}/chats/${chatId}/messages`, {
      method: "GET",
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return NextResponse.json({ raw: text }, { status: res.status });
    }
  },
};
