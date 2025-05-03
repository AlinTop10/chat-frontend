<template>
    <div class="userInfo">
        <div class="user">
            <!-- Afișează avatarul actualizat sau imaginea implicită -->
            <img :src="user?.avatar ? `http://localhost:4000/downloads/${user.avatar}` : '/src/img/avatar2.webp'" alt="Avatar" />
            <h2>{{ user?.name }}</h2>
        </div>
        <div class="icons">
            <img src="/src/img/more.png" alt="" @click="toggleMenu" />
            <img src="/src/img/edit.png" alt="" @click="toggleOption" />
            <UserMenu v-if="showMenu" @close="showMenu = false" />
        </div>
        <UserOptions v-if="showOptions" @nameUpdated="updateUserName" @avatarUpdated="updateAvatar" @close="showOptions = false" />
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { getAccount } from '@/services/account';
import UserOptions from '../addUser/userOptions.vue';
import UserMenu from '../addUser/userMenu.vue';

export default { 
    components: { UserOptions, UserMenu },
    setup() {
        const user = ref(null);
        const showOptions = ref(false);
        const showMenu = ref(false);

        // Funcții pentru schimbarea numelui
        const toggleOption = () => {
            showOptions.value = !showOptions.value;
        };

        const toggleMenu = () => {
            showMenu.value = !showMenu.value;
        };

        const updateUserName = (newName) => {
            if (user.value) {
                user.value.name = newName;
            }
        };

        // Actualizează avatarul
        const updateAvatar = (newAvatar) => {
            if (user.value) {
                user.value.avatar = newAvatar; // actualizează avatarul
            }
        };

        // Încarcă informațiile utilizatorului la montare
        onMounted(async () => {
            try {
                const response = await getAccount();
                user.value = response.data.user;
            } catch (error) {
                console.error("Eroare la obținerea datelor userului:", error);
            }
        });

        // Asigură-te că reactivitatea funcționează corect
        watch(() => user.value?.avatar, (newAvatar) => {
            console.log("Avatarul a fost actualizat:", newAvatar);
        });

        return { user, showMenu, showOptions, toggleOption, updateUserName, toggleMenu, updateAvatar };
    }
};
</script>

<style scoped>
.userInfo {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.user {
    display: flex;
    align-items: center;
    gap: 20px;
}

.user img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
}

.icons {
    position: relative;
    display: flex;
    gap: 20px;
}

.icons img {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.upload-avatar {
    display: none;
}
</style>
