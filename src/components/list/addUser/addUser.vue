<template>
    <div class="addUser">
        <form @submit.prevent="searchUser">
            <input type="text" v-model="search" placeholder="Username" name="username"/>
        </form>

        <!-- Container scroll pentru utilizatori -->
        <div class="user-list">
            <div class="user" v-for="item in searchHandler" :key="item.id">
                <div class="detail">
                    <img
                        :src="item?.avatar ? `http://localhost:4000/downloads/${item.avatar}` : '/src/img/avatar2.webp'"
                        alt="avatar"
                        @error="e => e.target.src = '/src/img/avatar2.webp'"
                    />
                    <span>{{ item.name }}</span>
                </div>
                <button @click="createChats(item.id)">Add User</button>
                
            </div>
        </div>
    </div>
</template>
   
<script>
import { getUsers, addChats, getAccount, getFriends } from '@/services/account';

export default { 
    data() {
        return {
            search: '',
            users: [],
            currentUserId: 0,
            chaturiExistente: []
        };
    },
    async mounted() {
        try {
            const response1 = await getAccount();
            this.currentUserId = response1.data.user.id;
            
            const response = await getUsers();
            this.users = response.data.list;

            const chatResponse = await getFriends();
            this.chaturiExistente = chatResponse.data.chats.map(chat => chat.friend.id);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    },
    computed: {
        searchHandler() {
            return this.users
                .filter(user => user.id !== this.currentUserId && 
                    !this.chaturiExistente.includes(user.id) &&
                    user.name.toLowerCase().includes(this.search.toLowerCase())
                )
                .slice(0, 5); // Limităm lista la 5 rezultate
        }
    },
    methods: {
        async createChats(friendId) {
            if (!this.currentUserId) {
                console.error("Datele utilizatorului nu sunt disponibile.");
                return;
            }

            try {
                const response = await addChats(this.currentUserId, friendId);
                console.log("Chat creat:", response.data);
                alert("Chatul a fost creat");

                // Adaugă noul user în lista de chat-uri existente
                this.chaturiExistente.push(friendId);
                this.$emit("chatCreated");
            } catch (error) {
                console.error("Eroare la crearea chatului:", error);
            }
        }
    }
};
</script>

   <!-- .upload-avatar {
    display: none;
} -->
<style scoped>
.addUser {
    width: 500px; 
    height: 400px; 
    padding: 30px;
    background-color: rgba(17,25,40,0.781);
    border-radius: 10px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    flex-direction: column;
}

.user-list {
    flex-grow: 1;
    max-height: 250px; 
    overflow-y: auto; 
    margin-top: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 10px;
    width: 100%;
}


.user {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail {
    display: flex;
    align-items: center;
    gap: 10px;
}

.detail img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

button {
    padding: 10px;
    border-radius: 10px;
    background-color: #1a73e8;
    color: white;
    border: none;
    cursor: pointer;
}

form {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 79px
}

form input {
    padding: 12px 16px; 
    font-size: 16px; 
    border-radius: 10px; 
    border: 1px solid rgba(255, 255, 255, 0.2); 
    outline: none;
    width: 300px;
}
</style>
