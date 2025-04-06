<template>
    <div className="userInfo">
        <div className="user">
            <img src="/src/img/avatar2.webp" alt="">
            <h2>{{ user?.name }}</h2>
        </div>
        <div className="icons">
            <img src="/src/img/more.png" alt="">
            <img src="/src/img/edit.png" alt="">
        </div>
    </div>
</template>
    
<script>
import { ref, onMounted } from 'vue';
import { getAccount } from '@/services/account';
export default{ 
    setup(){
        const user = ref(null);

        onMounted(async() => {
            try{
                const response = await  getAccount();
                user.value = response.data.user;
            } catch(error) {
                console.error("Eroare la obținerea datelor userului:", error);
            }
        });
        return { user };
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
    display: flex;
    gap: 20px;

    img{
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
}
</style>