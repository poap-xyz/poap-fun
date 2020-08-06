import React, { ReactNode } from 'react';
import * as firebase from 'firebase/app';
import { message } from 'antd';
import 'firebase/messaging';

type Notification = {
  notification: {
    body: string;
    title: string;
  };
  fcmOptions: {
    link: string;
  };
};

export const initializeFirebase = () => {
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

  const messaging = firebase.messaging();
  messaging.onMessage((payload: Notification) => {
    console.log('Message received. ', payload);
    const info: ReactNode = (
      <>
        {payload.notification.body}{' '}
        <a href={payload.fcmOptions.link} target={'_blank'} rel="noopener noreferrer">
          {payload.fcmOptions.link}
        </a>
      </>
    );
    message.warning(info, 60);
  });
};

export const getToken = async (): Promise<string> => {
  try {
    await Notification.requestPermission();

    const messaging = firebase.messaging();
    return await messaging.getToken();
  } catch (error) {
    console.error(error);
  }
  return '';
};
