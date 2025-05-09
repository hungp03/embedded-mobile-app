import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import { CurrentPrediction } from './src/screens/CurrentPrediction';
import { History} from './src/screens/History';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;
              if (route.name === 'Kết quả hiện tại') {
                iconName = 'checkmark-circle';
              } else if (route.name === 'Lịch sử') {
                iconName = 'time';
              } else {
                iconName = 'help';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#1890ff',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen
            name="Kết quả hiện tại"
            component={CurrentPrediction}
            options={{
              headerTitle: 'Kết quả dự đoán',
            }}
          />
          <Tab.Screen
            name="Lịch sử"
            component={History}
            options={{
              headerTitle: 'Lịch sử dự đoán',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
