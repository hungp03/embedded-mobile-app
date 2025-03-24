import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@ant-design/react-native';
import { CurrentPredictionScreen } from './src/screens/CurrentPredictionScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Kết quả hiện tại') {
                iconName = 'check-circle';
              } else if (route.name === 'Lịch sử') {
                iconName = 'clock-circle';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#1890ff',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen
            name="Kết quả hiện tại"
            component={CurrentPredictionScreen}
            options={{
              headerTitle: 'Kết quả dự đoán',
            }}
          />
          <Tab.Screen
            name="Lịch sử"
            component={HistoryScreen}
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
