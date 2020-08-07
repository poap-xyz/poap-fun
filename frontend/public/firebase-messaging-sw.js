// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.17.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.17.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyBpSzW22O3cD4ygMtncQsHGk4-M78cScNU',
  authDomain: 'prod-poap-fun.firebaseapp.com',
  databaseURL: 'https://prod-poap-fun.firebaseio.com',
  projectId: 'prod-poap-fun',
  storageBucket: 'prod-poap-fun.appspot.com',
  messagingSenderId: '195668052632',
  appId: '1:195668052632:web:5f72e790d2795e28be1eed',
  measurementId: 'G-36CE05QW5E',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'POAP.fun';
  const notificationOptions = {
    body: 'New raffle alert!',
    icon: '/og-image.jpg',
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
