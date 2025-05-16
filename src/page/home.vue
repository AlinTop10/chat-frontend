<template>
  <div :class="[style.homeWrapper, style.homeFont]">
    <div :class="style.container">
      <div :class="style.list">
        <userInfo :key="userInfoKey" @avatarUpdated="onAvatarUpdated"
                  @showOptions="showUserOptions = true" 
                  @hideOptions="showUserOptions = false"/>

        <div :class="style.chatList">
          <div :class="style.search">
            <div :class="style.searchBar">
              <img src="/src/img/search.png" alt=""/>
              <input type="text" v-model="search" placeholder="Search" />
            </div>
            <img :src="showAddUser ? '/src/img/minus.png' : '/src/img/plus.png'" 
                 alt="" 
                 :class="style.add" 
                 @click="toggleAddUser">
          </div>

          <div :class="style['chat-filter']">
            <button :class="[style.activeButton, { [style.active]: activeFilter === 'all' }]" @click="setFilter('all')">Toți</button>
            <button :class="[style.activeButton, { [style.active]: activeFilter === 'friends' }]" @click="setFilter('friends')">Prieteni</button>
            <button :class="[style.activeButton, { [style.active]: activeFilter === 'unread' }]" @click="setFilter('unread')">
              Necitite <span v-if="unreadChatsCount > 0">({{ unreadChatsCount }})</span>
            </button>
          </div>

          <div :class="style.chatItemsScroll">

            <div v-if="filteredChats.length === 0 && activeFilter === 'unread'" :class="style.noChats">
              Nu sunt chaturi cu mesaje necitite
            </div>

            <div
              v-for="chat in filteredChats"
              :key="chat.id"
              :class="style.item"
              @click="selectChat(chat.id)"
            >
              <img
                :src="chat.friend.avatar ? `http://localhost:4000/downloads/${chat.friend.avatar}` : '/src/img/avatar2.webp'"
                alt="avatar"
              />
              <div :class="style.texts">
                
                <div :class="style['chat-info']">
                  <span>{{ chat.friend.name }}</span>
                  <div v-if="chat.unreadMessagesCount > 0" :class="style.unread_badge">
                    {{ chat.unreadMessagesCount }}
                  </div>
                </div>

                <p v-if="modifyTheLastMessage(chat.msg, 7) !== 'poza::icon'">
                  {{ modifyTheLastMessage(chat.msg, 7) }}
                </p>
                <div v-else style="display: flex; align-items: center; gap: 5px;">
                  <img src="/src/img/img.png" alt="img" style="width: 16px; height: 16px;" />
                  <span>poza</span>
                </div>

              </div>
            </div>
          </div>

          <addUser 
            v-if="showAddUser" 
            @chatCreated="handleChatCreated"
            @click.stop
          />
        </div>
      </div>

      <chat :chatId="chatId" :chats="chats" @newMessageInAnotherChat="handleNewEvent"/>
      <detail :chatId="chatId" :chats="chats" @updateChats="updateChats" />
    </div>
  </div>

  <!-- Overlay pentru blocare interacțiune -->
<div
  v-if="showAddUser"
  class="global-overlay"
  @click="showAddUser = false"
/>

<addUser 
  v-if="showAddUser" 
  @chatCreated="handleChatCreated"
  @click.stop
/>  

</template>




<script lang="ts" setup>
import style from '@/assets/style.module.css';
import { ref, onMounted, computed } from "vue";
import detail from "@/components/detail/detail.vue";
import chat from "@/components/chat/chat.vue";
import addUser from "@/components/list/addUser/addUser.vue";
import { getAccount, getFriends, markMessagesAsRead } from "@/services/account";
import userInfo from "@/components/list/userInfo/userInfo.vue";

const chatId = ref<number | null>(123);
const chats = ref([]);
const showAddUser = ref(false);
const search = ref("");
const activeFilter = ref("all");
const curentChatId = ref<number | null>(0);
const currentUserId = ref<number | null>(0);
const unreadChatsCount = ref(0);
const userInfoKey = ref(0);
const showUserOptions = ref(false);

const onAvatarUpdated = () => {
  userInfoKey.value++; 
};

const selectChat = async (selectedId: number) => {
  curentChatId.value = selectedId;
  chatId.value = selectedId;

  const chat = chats.value.find(c => c.id === selectedId);
  if (chat && chat.unreadMessagesCount > 0) {
    unreadChatsCount.value--;
    chat.unreadMessagesCount = 0;
  }

  await markMessagesAsRead(selectedId);
};

const toggleAddUser = () => {
  showAddUser.value = !showAddUser.value;
};

const getAndSetFriends = async () => {
  try {
    const response = await getFriends();
    chats.value = response.data.chats;
    unreadChatsCount.value = response.data.unreadChatsCount; 
  } catch (error) {
    console.error("Eroare la obținerea listei de prieteni:", error);
  }
};

onMounted(async () => {
  await getAndSetFriends();
  const response = await getAccount();
  currentUserId.value = response.data.user.id;
});

const modifyTheLastMessage = (msg: string, maxNum: number) => {
  if (!msg) return null;

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const isImage = imageExtensions.some(ext => msg.toLowerCase().endsWith(ext));

  if (isImage) {
    return 'poza::icon'; // marker special pentru randare personalizată
  }

  return msg.length > maxNum ? msg.substring(0, maxNum).concat("...") : msg;
};


const filteredChats = computed(() => {
  return chats.value.filter(chat => {
    const nameMatches = chat.friend.name.toLowerCase().includes(search.value.toLowerCase());

    if (activeFilter.value === "friends") {
      return chat.status === 2 && nameMatches;
    }

    if (activeFilter.value === "unread") {
      return chat.unreadMessagesCount > 0;
    }

    return nameMatches;
  });
});

const updateChats = async () => {
  try {
    const response = await getFriends();
    chats.value = response.data.chats;
    if (chatId.value && !chats.value.some(chat => chat.chatId === chatId.value)) {
      chatId.value = null;
    }
  } catch (error) {
    console.error("Eroare la actualizarea listei de prieteni:", error);
  }
};

const handleNewEvent = async ({ incomingChatId, userId, message }: { incomingChatId: number, userId: number, message: string }) => {
  if (!incomingChatId || !userId) return;

  const index = chats.value.findIndex(chat => chat.id === incomingChatId);
  if (index > -1) {
    const chat = chats.value[index];
    chat.msg = message;

    const isFromOtherUser = userId !== currentUserId.value;
    const isNotInCurrentChat = chatId.value !== incomingChatId;

    if (isFromOtherUser && isNotInCurrentChat) {
      if (chat.unreadMessagesCount === 0) {
        unreadChatsCount.value++;
      }
      chat.unreadMessagesCount++;
    }

    const [movedChat] = chats.value.splice(index, 1);
    chats.value.unshift(movedChat);
    chats.value = [...chats.value]; // forțăm reactivitatea
  }
};

const handleChatCreated = async () => {
  await getAndSetFriends();
  showAddUser.value = false;
};

const setFilter = (filter: string) => {
  activeFilter.value = filter;
};
</script>

<style scoped>
.list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.global-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  pointer-events: all;
}

.addUser {
  z-index: 1000;
}
</style>
