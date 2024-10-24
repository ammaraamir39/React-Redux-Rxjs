import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging'

const publicKey = 'BF_Q0G-wyvgUDlGUXbtOo7_uXaRyDMQMq8G8okqE9NtLexInVKQKJsRYT84DimtsGPq3CLG5eWagJ298_EqiDkc'

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
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