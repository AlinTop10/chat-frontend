<template>
<body>
    <title>Register - Denchar</title>
    <div class="register-container"> 
            <h1>Register to Denchat</h1>
            <div className="form-group">
                <InputForAuth :getEmail="getEmail" :getPassw="getPassw" :getPasswConf="getPasswConf" :getName="getName" :getUserName="getUserName"/>
                <button type="submit" @click="checkRegistration">Register</button>
            </div>
        </div>
    </body>
</template>

<script>
import InputForAuth from '@/components/InputForAuth.vue';
import { auth } from '@/services/account';

export default{
    components: { InputForAuth },
    data(){
        return {
            email: "", 
            password: "",
            confirm_password: "",
            name: "",
            userName: ""
        }
    },
    methods: {
        getEmail(val){
            this.email = val;
        },
        getPassw(val){
            this.password = val;
        },
        getPasswConf(val){
            this.confirm_password = val;
        },
        getName(val){
            this.name = val;
        },
          getUserName(val) {
            this.userName = val;
        },

        async checkRegistration() {
            if(!this.email || !this.password 
            || !this.confirm_password || !this.name || !this.userName){
                alert("Completează toate câmpurile!");
                return;
            }
            console.log(this.email, this.password, this.confirm_password, this.name);
            
                if (!this.userName.startsWith("@")) {
                alert("userName-ul trebuie să înceapă cu '@'!");
                return;
                }
            
            try{
                const response = await auth(this.email, this.password, this.confirm_password, this.name, this.userName);
                console.log("Înregistrare cu succes: ", response.data);
                alert("Înregistrare cu succes!");
                this.$router.push('/log');
            } catch (error) {
                if (error.response?.data?.errors) {
                    const messages = error.response.data.errors.map(e => e.msg).join("\n");
                    alert("Eroare de validare:\n" + messages);
                } else if (error.response?.data?.message) {
                    alert("Eroare:\n" + error.response.data.message);
                } else {
                    alert("Eroare necunoscută la înregistrare.");
                }
            }
        }
    }
}
</script>

<style scoped>
body{
background-image: url("/src/img/font1.webp");
display: flex;
align-items: center;
justify-content: center;
height: 100vh;
}
.register-container {
background-color: rgba(17,25,40,0.75);
backdrop-filter: blur(19px) saturate(180%);
border-radius: 10px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
width: 100%;
max-width: 400px;
padding: 20px;
box-sizing: border-box;
border: 1px solid rgba(255,255,255, 0.125);
}
.register-container h1 {
text-align: center;
margin-bottom: 20px;
color: #e2e2e2;
}
.form-group{
  display: flex;
  flex-direction: column;
  gap:5px;
}
.register-container button {
background-color: #007BFF;
color: white;
border: 2px solid #0c4c92;
padding: 12px 20px;
font-size: 18px;
width: 80%;
max-width: 250px;
margin: 0 auto;
display: block;
border-radius: 10px;
cursor: pointer;
transition: transform 500ms ease;
}
.register-container button:hover {
transform: scale(1.1) translateY(-5px);
}
gin-container a {
text-align: center;
display: block;
color: #007BFF;
text-decoration: none;
margin-top: 10px;
}
.register-container a:hover {
text-decoration: underline;
}
</style>