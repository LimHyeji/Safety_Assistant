import React, { useState, useEffect } from 'react';
import { Text,Linking,Button} from 'react-native';
import GoogleFit, { Scopes, BucketUnit } from 'react-native-google-fit'
import RNLockTask from 'react-native-lock-task';

function app({navigation}) {
  useEffect(() => {
    RNLockTask.startLockTask();
    RNLockTask.startLockTaskWith(["com.google.android.youtube", "com.sega.sonicdash"]);
    RNLockTask.stopLockTask();
    RNLockTask.clearDeviceOwnerApp();
  }, []);
}
export default app;