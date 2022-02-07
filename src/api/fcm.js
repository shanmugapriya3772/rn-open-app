import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RNCallKeep from 'react-native-callkeep';
import {PermissionsAndroid} from 'react-native';

let options = {
  ios: {
    appName: 'My app name',
  },
  android: {
    alertTitle: 'Permissions Required',
    alertDescription:
      'This application needs to access your phone calling accounts to make calls',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'sim_icon',
    additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS],
  },
};

import {Platform} from 'react-native';

export const fcmPermission = async () => {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};

export const fcmToken = async () => {
  const token = await messaging().getToken();
  await AsyncStorage.setItem('fcm_token', JSON.stringify(token));
  return token;
};

export const cloudMessagingAPI = async () => {
  const fcmPermit = await fcmPermission();
  // Platform.OS==="ios"&&await registerIosDevice();
  const token = await fcmToken();
  const TOPIC = 'Subscribe';
  console.log(token, 'fcm_token');
  if (token && fcmPermit) {
    // from quit state
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        const {
          notification: {body, title},
          sentTime,
        } = remoteMessage;
        console.log(remoteMessage, 'initial notification');
      });

    //  open app from quit state

    messaging().onNotificationOpenedApp(async remoteMessage => {
      const {
        notification: {body, title},
        sentTime,
      } = remoteMessage;
      console.log(remoteMessage, 'on notification opemn');

      // setTimeout(() => {
      //   show = false;
      //   // alert("settimeoutt");
      //   RootNavigation.navigate("CheckinQR", { body, show, validity });
      // }, 2000);
    });

    // When app is background or terminated
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      const {
        notification: {body, title},
        sentTime,
      } = remoteMessage;
      console.log(remoteMessage, 'set bacground');

      // setTimeout(() => {
      //   show = false;
      //   // alert("settimeoutt");
      //   RootNavigation.navigate("CheckinQR", { body, show, validity });
      // }, 2000);
    });

    Platform.OS === 'ios' &&
      messaging()
        .getIsHeadless()
        .then(isHeadless => {
          console.log(isHeadless, 'isHeadless ');
          // do sth with isHeadless
        });

    // call when receive msg from app
    messaging().onMessage(async remoteMessage => {
      //   const {
      //     notification: {body, title},
      //     sentTime,
      //   } = remoteMessage;
      console.log('onMessage', 'remote', PermissionsAndroid);
      RNCallKeep.setup(options).then(accepted => {
        console.log(accepted, RNCallKeep.displayIncomingCall(), 'acceptedd');
      });

      RNCallKeep.displayIncomingCall(
        '12345678',
        '123456789',
        (localizedCallerName = 'PRIYA'),
      );

      RNCallKeep.addEventListener(
        'showIncomingCallUi',
        ('123456u', 'callUUID', 'name'),
      );

      // alert("A new FCM message arrived!");
    });

    /**
     * Apps can subscribe to a topic, which allows the FCM
     * server to send targeted messages to only those devices
     * subscribed to that topic.
     */
    messaging()
      .subscribeToTopic(TOPIC)
      .then(() => {
        console.log(`Topic: ${TOPIC} Suscribed`);
      });
  }
};
