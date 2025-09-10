import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "../screens/Users/LoginScreen";
import SignupScreen from "../screens/Users/SignupScreen";
import RefreshScreen from "../screens/Users/RefreshScreen";
import LogoutScreen from "../screens/Users/LogoutScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import DiaryScreen from "../screens/Diary/DiaryScreen";
import EmotionShapeScreen from "../screens/Diary/EmotionShapeScreen";
import StartScreen from "../screens/Start/StartScreen"; 
import ReportScreen from "../screens/Report/ReportScreen";

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Signup: undefined;
  Refresh: undefined;
  Logout: undefined;
  Home: undefined;
  Diary: undefined;
  Report: undefined;
  EmotionShape: { distribution: Record<string, number> };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start"> 
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Refresh" component={RefreshScreen} />
        <Stack.Screen name="Logout" component={LogoutScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Diary" component={DiaryScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen
          name="EmotionShape"
          component={EmotionShapeScreen}
          options={{ title: "감정 시각화" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
