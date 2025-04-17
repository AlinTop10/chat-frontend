<template>
  <div class="userOptions">
    <div class="exit">
      <span class="back-arrow" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 24 24">
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </span>
      <h2 class="title">Profil</h2>
    </div>

    <div class="image">
      <img src="/src/img/avatar2.webp" alt="">
    </div>

    <div class="info-user">
      <label class="label">Numele dumneavoastră</label>
      <div class="input-wrapper">
        <input
          class="input"
          type="text"
          :value="user?.name"
          :readonly="!isEditingName"
          ref="nameInputRef"
        />
        <img
          class="edit-icon"
          :src="isEditingName ? '/src/img/check.png' : '/src/img/edit.png'"
          alt="edit"
          @click="onEditNameClick"
        />

      </div>
    </div>

    <label class="label tip">Acest nume va fi vizibil pentru persoanele dvs. de contact.</label>

    <div class="info-user second">
      <label class="label">Despre</label>
      <div class="input-wrapper">
        <input
          class="input"
          type="text"
          :value="user?.info"
          :readonly="!isEditingAbout"
          ref="infoInputRef"
        />
        <img
          class="edit-icon"
          :src="isEditingAbout ? '/src/img/check.png' : '/src/img/edit.png'"
          alt="edit"
          @click="onEditInfoClick"
        />

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup> 
import { ref, onMounted, nextTick } from 'vue'
import { getAccount, updateAccount } from '@/services/account'

const user = ref<{ name: string; info: string } | null>(null)

const isEditingName = ref(false)
const isEditingAbout = ref(false)
const newName = ref('');
const emit = defineEmits(['close','nameUpdated']);

const nameInputRef = ref<HTMLInputElement | null>(null)
const infoInputRef = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  try {
    const response = await getAccount()
    user.value = {
      name: response.data.user.name,
      info: response.data.user.about ?? '...'
    }
  } catch (error) {
    console.log('Eroare la obținerea datelor userului:', error)
  }
})

const onEditNameClick = async () => {
  if (!isEditingName.value) {
    isEditingName.value = true
    await nextTick()
    nameInputRef.value?.focus()
  } else {
    const newName = nameInputRef.value?.value ?? ''
    if (newName !== user.value?.name) {
      await updateAccount({ name: newName }) // trimite DOAR numele
      user.value!.name = newName;
      emit('nameUpdated', newName);
    }
    isEditingName.value = false
  }
}

const saveChanges = () => {
  emit('nameUpdated', newName.value);
};

const onEditInfoClick = async () => {
  if (!isEditingAbout.value) {
    isEditingAbout.value = true
    await nextTick()
    infoInputRef.value?.focus()
  } else {
    const newAbout = infoInputRef.value?.value ?? ''
    if (newAbout !== user.value?.info) {
      await updateAccount({ about: newAbout }) // trimite DOAR about
      user.value!.info = newAbout
    }
    isEditingAbout.value = false
  }
}


</script>


<style scoped>
.userOptions {
  width: 350px;
  height: 100%;
  padding: 30px 0;
  background-color: rgba(17, 25, 40, 0.781); /* ca în addUser.vue */
  border-radius: 10px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
}

.content {
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image img {
  width: 200px;         
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin: 0 auto;       
}

.image {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.exit {
  background-color: #032a42; 
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px; 
  margin-top: -30px;
}

.title {
  color: #9e9e9e;
  font-size: 20px;
  margin: 0;
}

.info-user {
  background-color: #032a42; 
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 30px;
  box-sizing: border-box;
}

.label {
  font-size: 15px;
  color: #9e9e9e; 
}

.input {
  font-size: 18px;
  color: white;
  background: transparent;
  border: none;
  outline: none;
}

.tip {
  margin-top: 10px;
  padding: 0 20px;
  font-size: 13px;
  color: #9e9e9e;
}

.back-arrow {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.input-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.edit-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 10px;
}

</style>