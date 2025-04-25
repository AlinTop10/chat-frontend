<template>
<body>
  <title>Login - Denchat</title>
  <div className="login-container">
        <h1>Login to Denchat</h1>
        <div className="form-group">
           <Input :getEmail="getEmail" :getPassw="getPassw"/>
          <button type="submit" @click="handleLogin">Login</button>
        </div>
  </div>
</body>
</template>

<script>
import Input from '@/components/InputForLog.vue';
import { login } from '@/services/account';

export default{
  components: { Input },
  data(){
    return {
      email: "",
      password: ""
    }
  },
  methods:{
    getEmail(val){
      this.email = val;
    },
    getPassw(val){
      this.password = val;
    },
    async handleLogin() {
      try{
        const response = await login(this.email, this.password);
        const token  = response.data.token;

        localStorage.setItem("token", token);
        
        console.log('token -', token);
        // alert("Login successful!");
        this.$router.push('/home');
      } catch(error) {
        console.log(error);
        alert("Login failed!");
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

.login-container {
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
.login-container h1 {
text-align: center;
margin-bottom: 20px;
color: #e2e2e2;
}
.form-group{
  display: flex;
  flex-direction: column;
  gap:5px;
}
.login-container button {
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
.login-container button:hover {
transform: scale(1.1) translateY(-5px);
}
gin-container a {
text-align: center;
display: block;
color: #007BFF;
text-decoration: none;
margin-top: 10px;
}
.login-container a:hover {
text-decoration: underline;
}
</style>