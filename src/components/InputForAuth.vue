<template>
    <input type="email" @input="getEmail($event.target.value)"  name="email" placeholder="Email" required>
    <input type="password" @input="getPassw($event.target.value)"  name="password" placeholder="Password" required>
    <input type="password" @input="getPasswConf($event.target.value)" name="confirm_password" placeholder="Confirm_password" required>
    <input type="text" @input="getName($event.target.value)" name="name" placeholder="Name" required>
   </template>
   
   <script>
   export default{
       props:{
           getEmail: {
               type: Function,
               required: true
           },
           getPassw: {
               type: Function,
               required: true
           },
           getPasswConf: {
               type: Function,
               required: true
           },
           getName: {
               type: Function,
               required: true
           }
       }
   }
   </script>
   
   <style>
   input {
   margin-bottom: 15px;
   padding: 10px;
   font-size: 16px;
   border: 1px solid #ddd;
   border-radius: 5px;
   }
   input:focus {
   border-color: #007BFF;
   outline: none;
   }
   </style>