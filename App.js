import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import EligibilityScreen from "./src/screens/EligibilityScreen";
import EvidenceScreen from "./src/screens/EvidenceScreen";
import PaymentPlanScreen from "./src/screens/PaymentPlanScreen";
import AgreementScreen from "./src/screens/AgreementScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "TapToSettle" }}
        />
        <Stack.Screen
          name="Eligibility"
          component={EligibilityScreen}
          options={{ title: "Eligibility Check" }}
        />
        <Stack.Screen
          name="Evidence"
          component={EvidenceScreen}
          options={{ title: "Evidence Pack" }}
        />
        <Stack.Screen
          name="PaymentPlan"
          component={PaymentPlanScreen}
          options={{ title: "Payment Plan" }}
        />
        <Stack.Screen
          name="Agreement"
          component={AgreementScreen}
          options={{ title: "Agreement" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
