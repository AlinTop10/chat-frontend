<template>
     <div class="wrapper">
        <mainMenu/>
        <div class="feedback">
            <div class="container">
                <h2>Contact Denchat</h2>
                <p>Spune-ne cum folosești Denchat introducând informațiile necesare mai jos. Apoi atingeți sau faceți clic pe butonul pentru a ne contacta</p>
            
                <form @submit.prevent="sendEmail">
                    <div class="inline">
                        <div>
                            <label>First Name</label>
                            <input type="text" v-model="form.first_name" required />
                        </div>
                        <div>
                            <label>Last Name</label>
                            <input type="text" v-model="form.last_name" required />
                        </div>
                    </div>
                    <label>Email address</label>
                    <input type="email" class="one-line" v-model="form.email" required />

                    <label>Message</label>
                    <textarea class="one-line" v-model="form.message" required></textarea>

                    <button type="submit">Luați legătura</button>
                </form>
            </div>
        </div>
    </div>
    <AddFooter/>
</template>

<script>
import mainMenu from '@/components/mainMenu.vue';
import AddFooter from '@/components/AddFooter.vue';
import emailjs from 'emailjs-com';

export default{ 
    components: { mainMenu, AddFooter },
    data(){
        return{
            form: {
                first_name: '',
                last_name: '',
                email: '',
                message: ''
            }
        };
    },
    methods: {
        sendEmail() {
            emailjs.send(
            'service_0oii0qe',        // Service ID
            'template_m7ygw0b',       // Template ID
            this.form,                // Obiectul cu datele din formular
            'VuUFqLUKwixWn-eA1'       // Public key
            )
            .then(() => {
            alert('Mesaj trimis cu succes!');
            this.form = {
                first_name: '',
                last_name: '',
                email: '',
                message: ''
            };
            })
            .catch((error) => {
            console.error('Eroare:', error);
            alert('A apărut o eroare. Încearcă din nou.');
            });
        }
    }

}
</script>

<style>

</style>