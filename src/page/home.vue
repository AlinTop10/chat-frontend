<template>
  <div className="container homeContainer">
         
          <div className="list">
              <userInfo/>
          
              <div className="chatList">
                  <div className="search">
                      <div className="searchBar">
                          <img src="/src/img/search.png" alt="">
                          <input type="text" v-model="search" placeholder="Search"/>
                      </div>
                      <img :src="showAddUser ? '/src/img/minus.png' : '/src/img/plus.png'" alt="" class="add" @click="toggleAddUser" >
                  </div>

                  <div class="chat-filter">
                    <button class="active">Toți</button>
                    <button>Prieteni</button>
                    <button>Necitite</button>
                  </div>

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
  
                  <addUser v-if="showAddUser" />
              </div>
          </div>
          <chat :chatId="chatId" :chats="chats"/>
          <detail :chatId="chatId" :chats="chats" 
          @updateChats="updateChats"/>  
  </div>
  </template>

  <script lang="ts" setup>
  import { ref, onMounted, computed } from "vue";
  import detail from "@/components/detail/detail.vue";
  import chat from "@/components/chat/chat.vue";
  import addUser from "@/components/list/addUser/addUser.vue";
  import { getFriends } from "@/services/account";
  import userInfo from "@/components/list/userInfo/userInfo.vue";
  
  const chatId = ref<number | null>(123);
  const chats = ref([]);
  const showAddUser = ref(false);
  const search = ref("");
  
  const selectChat = (selectedId: number) => {
    console.log("Chat-ul selectat:", selectedId);
    chatId.value = selectedId;
  };
  
  const toggleAddUser = () => {
    showAddUser.value = !showAddUser.value;
  };
  
  onMounted(async () => {
    try {
      const response = await getFriends();
      console.log("Chaturile:", response.data);
      chats.value = response.data.chats;
    } catch (error) {
      console.error("Eroare la obținerea listei de prieteni:", error);
    }
  });


  const modifyTheLastMessage = (msg: string, maxNum: number) => {
    if(!msg) return null;
    
    return msg.length > maxNum ? msg.substring(0, maxNum).concat("...") : msg;
  }
  
  const filteredChats = computed(() => {
    return chats.value.filter(chat => 
      chat.friend.name.toLowerCase().includes(search.value.toLowerCase())
    );
  });

  const updateChats = async () => {
    try{
      const response = await getFriends();
      const newChats = response.data.chats;
      chats.value = newChats;
  
  
      if(chatId.value && !newChats.some(chat => chat.chatId === chatId.value)){
        chatId.value = null;
      }
    } catch (error) {
      console.error("Eroare la actualizarea listei de prieteni:", error);
    }
  };
  </script>
  
  
  <style  src="@/assets/style.css" >
  .list{
      flex: 1;
      display: flex;
      flex-direction: column;
  }
  </style>