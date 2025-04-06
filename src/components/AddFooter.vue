<template>
    <footer>
        <div class="blocks container">
            <div>
                <span class="logo">Denchat</span>
                <p>Denchat - este un mesager în cloud pentru dispozitive mobile și computere. Rapid și sigur.</p>
            </div>
            <div>
                <h4>About us</h4>
                <ul>
                    <li>Portfolio</li>
                    <li>Contact us</li>
                </ul>
            </div>
            <div>
                <h4>Contact us</h4>
                <p>Ne poți contacta oricând pentru întrebări, sugestii sau asistență. Echipa noastră este aici pentru a te ajuta!</p>
                <p>+40 757 904 078</p>
            </div>
        </div>
        <hr>
        <p>Cu mare drag elev de la IE Topalu Alin</p>
    </footer>
</template>

<script>
export default{
    
}
</script>

<style>
footer  {
    background: #000;
    padding: 50px 0;
}

footer .blocks {
    display: flex;
    justify-content: space-between;
}

footer .blocks p{
    width: 300px;
    margin: 15px 0;
}

footer .blocks h4{
    font-weight: 500;
    font-size: px;
}

footer .blocks ul{
    list-style: none;
}

footer .blocks ul li{
    margin-top: 7px;
    opacity: 0.80;
}

footer hr{
    margin: 30px 0;
    border: 0;
    height: 0.6px;
    background: #ccc;
}

footer > p{
    text-align: center;
}

footer .blocks .logo{
    text-transform: uppercase;
    font-size: 29px;
    font-weight: 800;
}
</style>