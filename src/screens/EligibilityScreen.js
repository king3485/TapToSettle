import React, { useMemo, useState } from "react";
import { Switch, TextInput, View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen, Card, H1, P, Button } from "../ui/Components";
import { theme } from "../ui/theme";

export default function EligibilityScreen() {
    const navigation = useNavigation();

    const [isPA, setIsPA] = useState(true);
    const [noInjuries, setNoInjuries] = useState(false);
    const [noAirbags, setNoAirbags] = useState(true);
    const [bothDrivable, setBothDrivable] = useState(true);
    const [amount, setAmount] = useState("500");

    const amountCents = useMemo(() => {
        const n = Number(amount);
        if (!Number.isFinite(n) || n < 0) return 0;
        return Math.round(n * 100);
    }, [amount]);

    const eligible =
        isPA && noInjuries && noAirbags && bothDrivable && amountCents > 0 && amountCents <= 200000;

    return (
        <Screen>
            <Card>
                <H1>Eligibility Gate</H1>
                <P>
                    This MVP supports Pennsylvania only and property damage only. If anyone is injured, stop
                    and contact emergency services / insurance.
                </P>
            </Card>

            <Card>
                <Row label="Incident occurred in Pennsylvania" value={isPA} onChange={setIsPA} />
                <Row label="No injuries or pain (required)" value={noInjuries} onChange={setNoInjuries} />
                <Row label="No airbags deployed" value={noAirbags} onChange={setNoAirbags} />
                <Row label="Both vehicles drivable" value={bothDrivable} onChange={setBothDrivable} />

                <View style={{ gap: 6 }}>
                    <Text style={styles.label}>Estimated property damage (USD)</Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        placeholder="e.g., 900"
                        placeholderTextColor={theme.muted}
                        style={styles.input}
                    />
                    <Text style={{ color: theme.muted, fontSize: 12 }}>Must be ≤ $2,000.</Text>
                </View>

                {!eligible && (
                    <Text style={{ color: theme.danger, marginTop: 8 }}>
                        Not eligible yet — complete required items and keep amount ≤ $2,000.
                    </Text>
                )}

                <Button
                    title="Continue"
                    onPress={() => navigation.navigate("Evidence")}
                    disabled={!eligible}
                />
            </Card>
        </Screen>
    );
}

function Row({ label, value, onChange }) {
    return (
        <View style={styles.row}>
            <Text style={styles.labelRow}>{label}</Text>
            <Switch value={value} onValueChange={onChange} />
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
    labelRow: { color: theme.text, fontSize: 14, flex: 1 },
    label: { color: theme.text, fontSize: 14 },
    input: {
        backgroundColor: "#0E1830",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        color: theme.text,
        borderWidth: 1,
        borderColor: "#24314F",
    },
});
