<template>
    <div class="userMenu">
      <ul>
        <li>Grupă nouă</li>
        <li>Ieșire</li>
      </ul>
    </div>
  </template>
  
  <script >
    export default{
      setup(){
        
      }
    }
  </script>
  
  <style scoped>
  .userMenu {
    position: absolute;
    top: 30px;
    right: 30px;
    background-color: rgba(14, 21, 32, 0.781);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 100;
    padding: 10px 0;
    width: 230px;
  }
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  li {
    padding: 12px 20px;
    color: white;
    cursor: pointer;
  }
  
  li:hover {
    background-color: #032a42;
  }
  </style>
  