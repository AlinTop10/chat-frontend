import axios from "axios";

async function login(email, password) {
    return await axios.post('http://localhost:4000/auth/login',{
        email,
        password
    },{
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    });
}

async function  auth(email, password, confirm_password, name) {
    return axios.post('http://localhost:4000/auth/reg',{
        email, 
        password,
        confirm_password,
        name    
    },{
        headers: {
            "Access-Control-Allow-Origin": "*",
         }
    });
}

async function getAccount(){
    return getHttpClient().get('auth/account');
}

function getHttpClient(){
    const token = localStorage.getItem('token');


    if(!token){
        return redirectToLogin();
    }

    const client = axios.create({
        baseURL: 'http://localhost:4000',
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
    
        client.interceptors.response.use(function (response) {
            return response;
          }, function (error) { 
            console.log("interceptor", error);
            // if status= 401
            localStorage.removeItem('token');
            return redirectToLogin();
            //else return Promise.reject(error);
          });

          return client;

}

function redirectToLogin(){
    window.location.replace("#/log");
}

async function getFriends(){
    return getHttpClient().get('users/chats');
}

async function getChatMessages(chatId, page = 1) {
    return getHttpClient().get(`chats/${chatId}/messages`, {
        params: { page }
    });
}

// async function sendMessageToChat(chatId, userId, message){ nu mai folosesc
//     return getHttpClient().post(`chats/${chatId}/sendMessagesToChat`,
//         {
//             chatId: chatId,
//             userId: userId,
//             message: message
//         });
// } 

async function  acceptFriends(userId, friendId){
    return getHttpClient().get(`users/addFriends/${userId}/${friendId}`);
}

async function  deliteFriends(userId, friendId){
    return getHttpClient().get(`users/deleteFriends/${userId}/${friendId}`);
}

async function getUsers(){
    return getHttpClient().get('users/index');
}

async function  addChats(userId, friendId){
    return getHttpClient().get(`chats/addChats/${userId}/${friendId}`);
}


async function updateAccount(data) {
    return getHttpClient().post('auth/updateAccount', data)
  }

export{login, auth, getAccount,getFriends, getChatMessages, 
    acceptFriends, deliteFriends, getUsers, addChats, updateAccount};
// sendMessageToChat