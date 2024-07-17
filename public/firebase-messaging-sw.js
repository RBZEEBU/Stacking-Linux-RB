// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js",
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDbUunQTsOftgn9GsG8c2grVQn5WQKYFLo",
  authDomain: "zeebu-staking.firebaseapp.com",
  projectId: "zeebu-staking",
  storageBucket: "zeebu-staking.appspot.com",
  messagingSenderId: "796248911548",
  appId: "1:796248911548:web:69337b2a972225b34aeab9",
  measurementId: "G-ZRWP3GN7FE",
});

console.log("[firebase-messaging-sw.js] here");

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
const channel = new BroadcastChannel("sw-notifications");

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  // Customize notification here
  const notificationTitle = `Zeebu Staking - ${payload.data.topic.toUpperCase()}`;
  const notificationOptions = {
    body: payload.data.message,
    //icon: "/firebase-logo.png",
  };

  channel.postMessage(payload);
  self.registration.showNotification(notificationTitle, notificationOptions);
});
