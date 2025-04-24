<template>
    <div className="userInfo">
        <div className="user">
            <img src="/src/img/avatar2.webp" alt="">
            <h2>{{ user?.name }}</h2>
        </div>
        <div className="icons">
            <img src="/src/img/more.png" alt="" @click="toggleMenu" />
            <img src="/src/img/edit.png" alt="" @click="toggleOption" />
            <UserMenu v-if="showMenu"  @close="showMenu = false"/>
        </div>
        <UserOptions v-if="showOptions"  @nameUpdated="updateUserName" @close="showOptions = false" /> 
    </div>
</template>
    
<script>
import { ref, onMounted } from 'vue';
import { getAccount } from '@/services/account';
import UserOptions from '../addUser/userOptions.vue';
import UserMenu from '../addUser/userMenu.vue';


export default{ 
    components: {UserOptions, UserMenu},
    setup(){
        const user = ref(null);
        const showOptions = ref(false);
        const showMenu = ref(false);

        const toggleOption = () => {
            showOptions.value = !showOptions.value;
        }

        const toggleMenu = () => {
            showMenu.value = !showMenu.value;
        }

        const updateUserName = (newName) => {
        if (user.value) {
            user.value.name = newName;
        }
        };

        onMounted(async() => {
            try{
                const response = await  getAccount();
                user.value = response.data.user;
            } catch(error) {
                console.error("Eroare la obținerea datelor userului:", error);
            }
        });
        return { user, showMenu, showOptions, toggleOption, updateUserName, toggleMenu };
    }
}
</script>
    
<style scoped>
.userInfo{
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.user{
    display: flex;
    align-items: center;
    gap: 20px;

    img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
    }
}

.icons{
    position: relative;
    display: flex;
    gap: 20px;
    img{
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
}
</style>