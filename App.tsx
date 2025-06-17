import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {allScreen} from './src/routes/routes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {initDB} from './src/db/createDB';

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();
  useEffect(() => {
    initDB();
  }, []);
  return (
    <SafeAreaView className="flex flex-1">
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {allScreen.map((screen, i) => {
            return (
              <Stack.Screen
                key={`${screen.name}/${i}`}
                name={screen.name}
                component={screen.component}
              />
            );
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
