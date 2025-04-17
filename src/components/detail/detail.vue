<template>
    <div className="detail">
        <div className="user">
            <img src="/src/img/avatar2.webp" alt="">
            <h2 v-if="activeChat">{{ activeChat.friend.name }}</h2>
            <p v-if="activeChat">{{ activeChat.friend.about ?? '...' }}</p>
        </div>
        <div class="info">
            <div class="option">
                <div class="title">
                    <span>Chat Settings</span>
                    <img src="/src/img/arrowUp.png" alt="">
                </div>
            </div>
            <div class="option">
                <div class="title">
                    <span>Privacy & help</span>
                    <img src="/src/img/arrowUp.png" alt="" className="icon">
                </div>
            </div>
            <div class="option">
                <div class="title">
                    <span>Shared photos</span>
                    <img src="/src/img/arrowDown.png" alt="" className="icon">
                </div>
                <div class="photos">
                    <div class="photoItem">
                        <div class="photoDetail">
                            <img src="https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fHww" alt="">
                            <span>Photo_2024_2.png</span>
                        </div>
                        <img src="/src/img/download.png" alt="" className="icon">
                    </div>
                </div>    
            </div>
            <div class="option">
                <div class="title">
                    <span>Shared Files</span>
                    <img src="/src/img/arrowUp.png" alt="">
                </div>
            </div>
            <!-- Aici am modificat pentru a condiționa afișarea butonului "Accept" în funcție de status -->
            <button class="accept" v-if="activeChat && activeChat.status === 1" @click="acceptFriendRequest">Accept</button>
            <button v-if="activeChat" @click="deliteFriendRequest">Delete</button>
        </div>
    </div>
</template>
    
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { acceptFriends, getAccount, deliteFriends } from '@/services/account';
const currentUserId = ref<number | null>(null);



onMounted(async () => {
  const response = await getAccount();
  currentUserId.value = response.data.user.id;
});


const props = defineProps<{
  chatId: number | null;
  chats: {
    id: number;
    status: number; // Adaugă statusul
    friend: {
      id: number;
      name: string;
      about: string;
    };
  }[];
}>();


const activeChat = computed(() => {
    return props.chats.find(chat => chat.id === props.chatId) || null;
});

const acceptFriendRequest = async () => {
    if(!activeChat || currentUserId.value === null) {
        console.error("Datele nu sunt disponibile")
        
        return;
    } 

    try{
        const response = await acceptFriends(currentUserId.value, activeChat.value.friend.id);
        console.log('asdasdas', currentUserId.value);
        
        console.log("Raspunsul:", response.data);
        alert("Prietenie acceptat cu succes!");

        if (response.data.updatedChat) {
            Object.assign(activeChat.value, response.data.updatedChat);        
        }

    } catch (error) {
        console.error("Eroare la acceptare:", error);
        alert("A aparut o eroare.");
    }
};

const emit = defineEmits(["updateChats"]);

const deliteFriendRequest = async () => {
     if(!activeChat || currentUserId.value === null) {
        console.error("Datele nu sunt disponibile")
        console.log(activeChat);
        return;
     }

     try{
        const response = await deliteFriends(currentUserId.value, activeChat.value.friend.id);
        console.log("Raspuns:", response.data);
        alert("Prieteniea a fost stersa cu succes!");

        emit("updateChats");
     } catch (error) {
        console.error("Eroare:", error);
        alert("A aparut o eroare.");
     }
};
</script>
    
<style scoped>
.detail{
    flex: 1;
    overflow-y: auto; /* Activează scroll-ul vertical */
    scrollbar-width: thin; /* Pentru Firefox */
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

    .user{
        padding: 30px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        border-bottom: 1px solid #dddddd35;

        img{
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
        }
    }

    .info{
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 30px;

        .option{

            .title{
                display: flex;
                align-items: center;
                justify-content: space-between;
            
                img{
                    width: 30px;
                    height: 30px;
                    background-color: rgba(17,25,40,0.3);
                    padding: 10px;
                    border-radius: 50%;
                    cursor: pointer;
                }
            }

            .photos{
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-top: 20px;
            
                .photoItem{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .photoDetail{
                        display: flex;
                        align-items: center;
                        gap: 20px;

                        img{
                            width: 40px;
                            height: 40px;
                            border-radius: 5px;
                            object-fit: cover;
                        }

                        span{
                            font-size: 14px;
                            color: lightgray;
                            font-weight: 300;
                        }
                    }

                    .icon{
                        width: 30px;
                        height: 30px;
                        background-color: rgba(17,25,40,0.3);
                        padding: 10px;
                        border-radius: 50%;
                        cursor: pointer;
                    }
                }
            }
        }

        button{
                padding: 10px 20px;
                background-color: rgba(230,74, 105,0.553);
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;

                &:hover{
                    background-color: rgba(220,20,60,0.796);
                }
            }
    }
}

.detail::-webkit-scrollbar, .chatList::-webkit-scrollbar {
    width: 5px; /* Grosimea scrollbar-ului */
}
</style>
