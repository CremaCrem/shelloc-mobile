import React from 'react';
import { View } from 'react-native';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react-native';
import { Typography } from './Typography';

export const toastConfig: ToastConfig = {
  success: (props) => (
    <View className="w-[90%] bg-surfaceElevated border border-leaf/40 rounded-2xl p-4 flex-row items-center shadow-lg shadow-black/50 mt-4">
      <CheckCircle2 size={24} color="#10B981" className="mr-3" />
      <View className="flex-1">
        <Typography variant="label" color="ink" className="font-bold mb-1">
          {props.text1}
        </Typography>
        {props.text2 ? (
          <Typography variant="caption" color="inkMuted">
            {props.text2}
          </Typography>
        ) : null}
      </View>
    </View>
  ),
  error: (props) => (
    <View className="w-[90%] bg-surfaceElevated border border-danger/40 rounded-2xl p-4 flex-row items-center shadow-lg shadow-black/50 mt-4">
      <AlertCircle size={24} color="#EF4444" className="mr-3" />
      <View className="flex-1">
        <Typography variant="label" color="ink" className="font-bold mb-1">
          {props.text1}
        </Typography>
        {props.text2 ? (
          <Typography variant="caption" color="inkMuted">
            {props.text2}
          </Typography>
        ) : null}
      </View>
    </View>
  ),
  info: (props) => (
    <View className="w-[90%] bg-surfaceElevated border border-brand/40 rounded-2xl p-4 flex-row items-center shadow-lg shadow-black/50 mt-4">
      <Info size={24} color="#00F2FE" className="mr-3" />
      <View className="flex-1">
        <Typography variant="label" color="ink" className="font-bold mb-1">
          {props.text1}
        </Typography>
        {props.text2 ? (
          <Typography variant="caption" color="inkMuted">
            {props.text2}
          </Typography>
        ) : null}
      </View>
    </View>
  ),
};
