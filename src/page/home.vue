<template>
  <div class="container homeContainer">
    <div class="list">
      <userInfo />

      <div class="chatList">
        <div class="search">
          <div class="searchBar">
            <img src="/src/img/search.png" alt="">
            <input type="text" v-model="search" placeholder="Search" />
          </div>
          <img :src="showAddUser ? '/src/img/minus.png' : '/src/img/plus.png'" alt="" class="add" @click="toggleAddUser">
        </div>

        <div class="chat-filter">
          <button :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">Toți</button>
          <button :class="{ active: activeFilter === 'friends' }" @click="setFilter('friends')">Prieteni</button>
          <button :class="{ active: activeFilter === 'unread' }" @click="setFilter('unread')">Necitite</button>
        </div>

        <!-- Lista cu scroll -->
        <div class="chatItemsScroll">
          <div v-for="chat in filteredChats"
               :key="chat.id"
               class="item"
               @click="selectChat(chat.id)">
            <img src="/src/img/avatar2.webp" alt="">
            <div class="texts">
              <span>{{ chat.friend.name }}</span>
              <p>{{ modifyTheLastMessage(chat.msg, 7) }}</p>
            </div>
          </div>
        </div>

        <addUser v-if="showAddUser" />
      </div>
    </div>

    <chat :chatId="chatId" :chats="chats" @newMessageInAnotherChat="handleNewEvent" />
    <detail :chatId="chatId" :chats="chats" @updateChats="updateChats"/>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import detail from "@/components/detail/detail.vue";
import chat from "@/components/chat/chat.vue";
import addUser from "@/components/list/addUser/addUser.vue";
import { getFriends } from "@/services/account";
import userInfo from "@/components/list/userInfo/userInfo.vue";

const chatId = ref<number | null>(123);
const chats = ref([]);
const showAddUser = ref(false);
const search = ref("");
const activeFilter = ref("all");
const newEventInChat = ref<number>(0); // inițializare

const selectChat = (selectedId: number) => {
  console.log("Chat-ul selectat:", selectedId);
  chatId.value = selectedId;
};

const toggleAddUser = () => {
  showAddUser.value = !showAddUser.value;
};

const getAndSetFriends = async () => {
  try {
    const response = await getFriends();
    console.log("Chaturile:", response.data);
    chats.value = response.data.chats;
  } catch (error) {
    console.error("Eroare la obținerea listei de prieteni:", error);
  }
};

onMounted(async () => {
  await getAndSetFriends();
});

watch(newEventInChat, async () => {
  await updateChats();
});

const modifyTheLastMessage = (msg: string, maxNum: number) => {
  if (!msg) return null;
  return msg.length > maxNum ? msg.substring(0, maxNum).concat("...") : msg;
};

const filteredChats = computed(() => {
  return chats.value.filter(chat => {
    const nameMatches = chat.friend.name.toLowerCase().includes(search.value.toLowerCase());

    if (activeFilter.value === "friends") {
      return chat.status === 2 && nameMatches;
    }

    if (activeFilter.value === "unread") {
      // Înlocuiește cu logica ta reală pentru mesaje necitite
      return false;
    }

    return nameMatches;
  });
});

const updateChats = async () => {
  try {
    const response = await getFriends();
    const newChats = response.data.chats;
    chats.value = newChats;

    if (chatId.value && !newChats.some(chat => chat.chatId === chatId.value)) {
      chatId.value = null;
    }
  } catch (error) {
    console.error("Eroare la actualizarea listei de prieteni:", error);
  }
};

// Poți apela asta din `chat.vue` prin emit
const handleNewEvent = (chatId: number) => {
  console.log("Update primit de la copil pentru chatId:", chatId);
  newEventInChat.value = Date.now();
};


const setFilter = (filter: string) => {
  activeFilter.value = filter;
};
</script>

<style  src="@/assets/style.css">
.list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
