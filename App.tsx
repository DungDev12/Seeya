import React, {useEffect} from 'react';
import {getDBConnection} from './src/db/connectDB';
import {createTables} from './src/db/tables';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {allScreen} from './src/routes/routes';
import {SafeAreaView} from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();
  useEffect(() => {
    const initTable = async () => {
      try {
        const db = await getDBConnection();
        await createTables(db);
      } catch (e) {
        console.error('initTable error:', e);
      }
    };
    initTable();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Product"
          screenOptions={{headerShown: false}}>
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
