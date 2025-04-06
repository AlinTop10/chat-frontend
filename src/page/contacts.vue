<template>
     <div class="wrapper">
        <mainMenu/>
        <div class="feedback">
            <div class="container">
                <h2>Contact Denchat</h2>
                <p>Spune-ne cum folosești Denchat introducând informațiile necesare mai jos. Apoi atingeți sau faceți clic pe butonul pentru a ne contacta</p>
            
                <form>
                    <div class="inline">
                        <div>
                            <label>First Name</label>
                            <input type="text">
                        </div>
                        <div>
                            <label>Last Name</label>
                            <input type="text">
                        </div>
                    </div>
                    <label>Email address</label>
                    <input type="email" class="one-line">

                    <label>Message</label>
                    <textarea class="one-line"></textarea>

                    <button type="button">Luați legătura</button>
                </form>
            </div>
        </div>
    </div>
    <AddFooter/>
</template>

<script>
import mainMenu from '@/components/mainMenu.vue';
import AddFooter from '@/components/AddFooter.vue';

export default{ 
    components: { mainMenu, AddFooter },
    data(){
        return{
            
        }
    }
}
</script>

<style>

</style>