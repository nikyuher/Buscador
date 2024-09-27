<template>
    <div>
        <LoginComp></LoginComp>
    </div>
  </template>
  
  <script setup lang="ts">
  import LoginComp from '@/components/LoginComp.vue';
  </script>
  
  <style scoped>
.cont-form{
  padding: 200px;
}
  
  .login-container {
    max-width: 400px;
    margin:  auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .input-group {
    margin-bottom: 15px;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .input-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
  
  .error-message {
    margin-top: 10px;
    color: red;
    text-align: center;
  }
  </style>
  