<template>
    <div class="wrapper">
        <mainMenu/>
        <div class="hero-about container">
            <div class="info">
                <h1>Bine ați venit la Denchat, o soluție modernă de chat web concepută pentru a face comunicarea fără întreruperi, sigură și eficientă</h1>
                <p>Misiunea noastră este să oferim utilizatorilor o experiență de mesagerie rapidă, intuitivă și privată, fie pentru conversații personale, fie pentru colaborare profesională</p>
                <button class="btn" @click="goToRegister">Fii parte din noi</button>
            </div>
            <img src="@/img/aln.jpg" alt="">
        </div> 

        <div class="container work">
            <h2>Denchat:</h2>
            <div class="blocks">
                <div class="block">
                    <span class="badge purple">Viziunea noastră</span>
                    <p>Credem că comunicarea ar trebui să fie simplă, accesibilă,
                        și sigura. De aceea am construit o platformă de chat care elimină complexitatea inutilă, 
                        asigurând că fiecare interacțiune este rapidă, fiabilă și criptată</p>
                </div>
                <div class="block">
                    <span class="badge brown">Angajamentul nostru</span>
                    <p>La Denchat, inovăm continuu pentru a vă oferi cea mai bună experiență de mesagerie. 
                        Echipa noastră dedicată lucrează mereu pentru a îmbunătăți platforma cu funcții noi, 
                        securitate îmbunătățită și o experiență de utilizator fără probleme</p>
                </div>
                <div class="block">
                    <span class="badge green">Povestea noastră</span>
                    <p>La Denchat, am început cu o idee simplă: să creăm o platformă de chat rapidă, 
                        sigur și ușor de utilizat. Frustrat de aplicațiile de mesagerie lente, aglomerate și nesigure, 
                        echipa noastră și-a propus să construiască ceva mai bun – o platformă care acordă prioritate atât uzabilitatea, cât și confidențialitate</p>
                </div>
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
    },
    methods: {
    goToRegister() {
      this.$router.push('/reg');
        }
    }
};
</script>