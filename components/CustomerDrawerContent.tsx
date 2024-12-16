import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Href, useRouter } from 'expo-router';

export default function CustomDrawerContent(props: any) {
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={() => router.replace<'/'>('/' as Href)} />
    </DrawerContentScrollView>
  );
}
