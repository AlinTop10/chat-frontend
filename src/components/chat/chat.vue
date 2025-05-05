<template>
    <div className="chat">
      <div className="top" v-if="activeChat">
        <div className="user">
          <img
              :src="activeChat.friend.avatar ? `http://localhost:4000/downloads/${activeChat.friend.avatar}` : '/src/img/avatar2.webp'"
              alt="avatar"
            />
          <div className="texts">
            <span>{{ activeChat.friend.name }}</span>
            <p>{{ activeChat.friend.about }}</p>
          </div>
        </div>
        <div className="icons">
          <img src="/src/img/phone.png" alt="">
          <img src="/src/img/video.png" alt="">
          <img src="/src/img/info.png" alt="">
        </div>
      </div>
  
      <div class="center" ref="chatContainer" @scroll="handleScroll">
        <template v-if="activeChat" >
          <div
            v-for="message in messages"
            :key="message.id"
            :class="['message', { own: message.userId === currentUserId?.id }]"
          >
            <img v-if="message.userId !== currentUserId?.id" :src="activeChat.friend.avatar ? `http://localhost:4000/downloads/${activeChat.friend.avatar}` : '/src/img/avatar2.webp'"
            alt="avatar"/>
            <div class="texts">
              <p>{{ message.text }}</p>
              <span>{{ formatDate(message.timestamp) }}</span>
            </div>
          </div>
        </template>
        <div v-else class="no-chat">
          Selectați un prieten căruia vreți să trimiteți un mesaj
        </div>
      </div>
  
      <div className="bottom" v-if="activeChat">
        <div class="icons">
          <img src="/src/img/img.png" alt="">
          <img src="/src/img/camera.png" alt="">
          <img src="/src/img/mic.png" alt="">
        </div>
        <input v-model="text" type="text" placeholder="Type a message..." @keydown.enter="sendMessage">
        <div class="emoji">
          <img src="/src/img/emoji.png" alt="" @click="toggleEmojiPicker">
          <div class="picker">
            <EmojiPicker v-if="open" @select="addEmoji" />
          </div>
        </div>
        <button className="sendButton" @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { watch, computed, ref, onMounted, nextTick } from "vue";
  import EmojiPicker from "vue3-emoji-picker";
  import "vue3-emoji-picker/css";
  import { getAccount, getChatMessages, markMessagesAsRead } from "@/services/account";
  // sendMessageToChat - nu mai folosesc
  import { io } from 'socket.io-client';
  
  const socket = io("ws://localhost:4000");
  
  const props = defineProps<{
    chatId: number | null;
    chats: {
      id: number;
      friend: {
        id: number;
        name: string;
        about: string;
        avatar: string;
      };
    }[];
  }>();
  
  const emit = defineEmits(['newMessageInAnotherChat']);//new message in this chat
  
  const messages = ref<{ id: number; text: string; userId: number; timestamp: string }[]>([]);
  const open = ref(false);
  const text = ref("");
  const chatContainer = ref<HTMLElement | null>(null);
  const currentUserId = ref<{ id: number; } | null>(null);
  const page = ref(1);
  const isLoading = ref(false);
  const hasMoreMessages = ref(true);
  
  onMounted(async () => {
    const response = await getAccount();
    currentUserId.value = response.data.user;
  });
  
  const loadMessages = async (append = false) => {
    if (!props.chatId || isLoading.value || !hasMoreMessages.value) return;
    isLoading.value = true;
    try {
      const response = await getChatMessages(props.chatId, page.value);
      const newMessages = response.data.map((msg: any) => ({
        id: msg.chatMessageId,
        text: msg.message,
        userId: msg.User.userId,
        timestamp: msg.createdAt,
      }));
  
      if (newMessages.length === 0) {
        hasMoreMessages.value = false;
      }
  
      if (append) {
        messages.value = [...newMessages.reverse(), ...messages.value];
      } else {
        messages.value = newMessages.reverse();
        nextTick(() => {
          chatContainer.value?.scrollTo({ top: chatContainer.value.scrollHeight, behavior: "smooth" });
        });
      }
    } catch (error) {
      console.error("Eroare la încărcarea mesajelor:", error);
    } finally {
      isLoading.value = false;
    }
  };
  
  const activeChat = computed(() => {
    return props.chats.find(chat => chat.id === props.chatId) || null;
  });
  
  const sendMessage = async () => {
    if (!text.value.trim() || !props.chatId || !currentUserId.value) return;
  
    const message = text.value.trim();
    const userId = currentUserId.value.id;
    const chatId = props.chatId;
  
    
      // Emit către serverul WebSocket
      socket.emit("privateMessage", { message, userId, chatId });
  
      messages.value.push({
        id: Date.now(),
        text: message,
        userId,
        timestamp: new Date().toISOString(),
      });

      text.value = "";

      emit("newMessageInAnotherChat", { incomingChatId: chatId, userId });
  
      nextTick(() => {
        chatContainer.value?.scrollTo({ top: chatContainer.value.scrollHeight, behavior: "smooth" });
      });
  };
  
  const handleScroll = () => {
    if (!chatContainer.value) return;
    if (chatContainer.value.scrollTop === 0 && hasMoreMessages.value) {
      page.value++;
      loadMessages(true);
    }
  };
  
  // Mutăm emit-ul în watch-ul de chatId
  watch(() => props.chatId, (newChatId) => {
    if (newChatId === null) {
      messages.value = [];
    } else {
      page.value = 1;
      hasMoreMessages.value = true;
      loadMessages();
  
      // Emit către backend pentru alăturare în cameră
      if (currentUserId.value?.id) {
        socket.emit("joinPrivateChat", {
          userId: currentUserId.value.id,
          chatId: newChatId,
        });
        console.log("Emit joinPrivateChat", {
          userId: currentUserId.value.id,
          chatId: newChatId,
        });
      }
    }
  }, { immediate: true });
  
 

  socket.on("chatLive", ({ chatId: incomingChatId, message, userId }) => {
    emit("newMessageInAnotherChat", {incomingChatId, userId});
  });

  socket.on("privateMessage", async ({ chatId: incomingChatId, message, userId }) => {
  console.log("Mesaj primit prin WebSocket:", { incomingChatId, message, userId });

  if (userId === currentUserId.value?.id) {
    
    return;
  }
  const isCurrentChat = props.chatId === incomingChatId;

  if (!isCurrentChat) {
    emit("newMessageInAnotherChat", incomingChatId, userId);
  } else {
    messages.value.push({
      id: Date.now(),
      text: message,
      userId,
      timestamp: new Date().toISOString(),
    });

    nextTick(() => {
      chatContainer.value?.scrollTo({ top: chatContainer.value.scrollHeight, behavior: "smooth" });
    });

    try {
      await markMessagesAsRead(incomingChatId);
    } catch (err) {
      console.error("Eroare la marcare ca citit:", err);
    }
  }
});


  
  const toggleEmojiPicker = () => {
    open.value = !open.value;
  };
  
  const addEmoji = (emoji: any) => {
    text.value += emoji.i;
    open.value = false;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ro-RO", { dateStyle: "short", timeStyle: "short" });
  };
  </script>
    
<style scoped>
.no-chat {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #a5a5a5;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }

.chat{
    flex: 2;
    border-left: 1px solid #dddddd35;
    border-right: 1px solid #dddddd35;
    height: 100%;
    display: flex;
    flex-direction: column;

    .top{
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #dddddd35;
    
        .user{
            display: flex;
            align-items: center;
            gap: 20px;

            img{
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
            }

            .texts{
                display: flex;
                flex-direction: column;
                gap: 5px;

                span{
                    font-size: 18px;
                    font-weight: bold;
                }

                p{
                    font-size: 14px;
                    font-weight: 300;
                    color: #a5a5a5;
                }
            }
        }

        .icons{
            display: flex;
            gap: 20px;

            img{
                width: 20px;
                height: 20px;
            }
        }
    }

    .center{
        padding: 20px;
        flex: 1;
        overflow: auto;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .message{
            max-width: 70%;
            display: flex;
            gap: 20px;

            &.own{
                align-self: flex-end;

                .texts{
                   p{
                    background-color: #5183fe;
                   }
                }
            }

            img{
                width: 30px;
                height: 30px;
                border-radius: 50%;
                object-fit: cover;
            }
            .texts{
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 5px;


                img{
                    width: 100%;
                    height: 300px;
                    border-radius: 10px;
                    object-fit: cover;
                }

                p{
                    padding: 20px;
                    background-color: rgba(17,25,40,0.3);
                    border-radius: 10px;
                }

                span{
                    font-size: 13px;
                }
            }
        }
        
    } 

    .center::-webkit-scrollbar-track{
        background: transparent;
    }

    .bottom{
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #dddddd35;
        gap: 20px;
        margin-top: auto;


        .icons{
            display: flex;
            gap: 20px;
        }

        img{
                width: 20px;
                height: 20px;
                cursor: pointer;
        }

        input{
            flex: 1;
            background-color: rgba(17, 25, 40, 0.5);
            border: none;
            outline: none;
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 16px;
        }

        .emoji{
            position: relative;

            .picker{
                position: absolute;
                bottom: 50px;
                left: 0;
            }
        }
    
        .sendButton{
            background-color: #5183fe;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    }
}
</style>