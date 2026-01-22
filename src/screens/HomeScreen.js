import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Screen, Card, H1, P, Button } from "../ui/Components";

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <Screen>
            <Card>
                <H1>TapToSettle</H1>
                <P>PA only • Property damage only • $2,000 cap • No injuries</P>
            </Card>

            <Card>
                <H1>Start</H1>
                <P>We’ll confirm eligibility first.</P>
                <Button title="Begin Settlement" onPress={() => navigation.navigate("Eligibility")} />
            </Card>
        </Screen>
    );
}
