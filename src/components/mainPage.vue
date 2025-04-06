<template>
    <div class="wrapper">
        <mainMenu/>

        <div class="hero container">
                <div class="hero--info">
                    <h2>web chat</h2>
                    <h1>Denchat – Soluție Modernă pentru Comunicare Online</h1>
                    <p>Această aplicație de web chat oferă o platformă intuitivă și eficientă pentru comunicarea în timp real. 
                        Cu o interfață prietenoasă și funcționalități avansate, soluția permite utilizatorilor să schimbe mesaje rapid și securizat, 
                        facilitând interacțiunea în diverse contexte – de la asistență tehnică la socializare. 
                        Implementată cu tehnologii moderne, aplicația asigură o experiență fluidă și adaptabilă nevoilor utilizatorilor.</p>
                        <button class="btn" @click="goToAbout">Get more details</button>
                </div>
                <img src="@/img/a.jpg" alt="">
        </div>

            <div class="container big-text">
                <p>Comunică Instant – Simplu, Rapid și Securizat</p>
            </div>

            <div class="container banner">
                <h3>Trimiteți mesaje în privat</h3>
                <p>Mesajele private și apelurile vă ajută să fiți dumneavoastră înșivă, 
                    să vă exprimați liber și să simțiți aproape persoanele importante 
                    din viața dumneavoastră, indiferent unde se află acestea.
                </p>
                <img src="@/img/com.jpeg" alt="">   
            </div>
        

        <div class="features">
            <div class="container">
                <h3>Șase motive pentru a folosi Denchat</h3>
                <p>Mai jos sunt câteva motive pentru care ar trebui să utilizați aplicația mea</p>
                <div class="info">
                    <div class="block">
                        <h4>Comoditate</h4>
                        <i class="fa-solid fa-couch"></i>
                        <p>Interfață simplă, intuitivă</p>
                    </div>
                    <div class="block">
                        <h4>Criptare</h4>
                        <i class="fa-solid fa-person-shelter"></i>
                        <p>Confidențialitate și ștergerea datelor prin temporizator</p>
                    </div>
                    <div class="block">
                        <h4>Viteză</h4>
                        <i class="fa-solid fa-gauge"></i>
                        <p>Mesajele ajung mai repede decât în ​​orice altă aplicație</p>
                    </div>
                    <div class="block">
                        <h4>Siguranţă</h4>
                        <i class="fa-duotone fa-solid fa-shield"></i>
                        <p>oferim securitate și protecție a contului</p>
                    </div>
                    <div class="block">
                        <h4>Unicitatea</h4>
                        <i class="fa-solid fa-face-smile-wink"></i>
                        <p>Unicitatea acestei interfețe este interesantă</p>
                    </div>
                    <div class="block">
                        <h4>Personalizare</h4>
                        <i class="fa-solid fa-wrench"></i>
                        <p>Personalizați-vă experiența de chat</p>
                    </div>
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
        goToAbout() {
            this.$router.push('/about');
        }
    }
}
</script>

