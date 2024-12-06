import React from 'react';
import { View, Text, Switch } from 'react-native';
import { PreferenceKeys } from '../types';

interface Props {
  preferences: Record<PreferenceKeys, boolean>;
  onToggle: (key: PreferenceKeys) => void;
}

export default function PreferencesToggles({ preferences, onToggle }: Props) {
  return (
    <View>
      {Object.keys(preferences).map((key) => (
        <View key={key} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>{key}</Text>
          <Switch
            value={preferences[key as PreferenceKeys]}
            onValueChange={() => onToggle(key as PreferenceKeys)}
          />
        </View>
      ))}
    </View>
  );
}
