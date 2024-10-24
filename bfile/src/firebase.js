import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging'

const publicKey = 'BF_Q0G-wyvgUDlGUXbtOo7_uXaRyDMQMq8G8okqE9NtLexInVKQKJsRYT84DimtsGPq3CLG5eWagJ298_EqiDkc'

const firebaseConfig = {
    apiKey: "AIzaSyBoe3V0__wlCN65LuubP0p_QxBO6IgLO7A",
    authDomain: "bfile-media.firebaseapp.com",
    projectId: "bfile-media",
    storageBucket: "bfile-media.appspot.com",
    messagingSenderId: "317193604801",
    appId: "1:317193604801:web:06efaa576afc6b6c198e40"
  };

firebase.initializeApp(firebaseConfig);


const messaging = firebase.messaging()

export const getToken = async(tokenNotifier)=>{
    let currentToken='';
    
    try {
        currentToken = await messaging.getToken({vapidKey: publicKey});
        if (currentToken) {
            tokenNotifier = true;
          } else {
            tokenNotifier = false;
          }
    } catch (error) {
        console.log('An error occurred while retrieving token.', error);
    }
    return {currentToken,tokenNotifier}
}


export default firebase