import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Screen, Card, H1, P, Button } from "../ui/Components";
import { theme } from "../ui/theme";

const REQUIRED = [
    { key: "front", label: "Front photo (both vehicles)" },
    { key: "rear", label: "Rear photo (both vehicles)" },
    { key: "left", label: "Left side photo (both vehicles)" },
    { key: "right", label: "Right side photo (both vehicles)" },
    { key: "damage", label: "Damage close-up (with reference object)" },
    { key: "scene", label: "Scene photo (street/lot)" },
    { key: "plate1", label: "Plate photo (Vehicle A)" },
    { key: "plate2", label: "Plate photo (Vehicle B)" },
    { key: "vin1", label: "VIN photo (Vehicle A)" },
    { key: "vin2", label: "VIN photo (Vehicle B)" },
];

export default function EvidenceScreen() {
    const navigation = useNavigation();
    const [photos, setPhotos] = useState({}); // key -> uri

    const complete = useMemo(
        () => REQUIRED.every((item) => Boolean(photos[item.key])),
        [photos]
    );

    async function requestPermissions() {
        const cam = await ImagePicker.requestCameraPermissionsAsync();
        if (!cam.granted) {
            Alert.alert(
                "Camera permission needed",
                "TapToSettle needs camera access to capture evidence."
            );
            return false;
        }
        return true;
    }

    async function takePhoto(key) {
        const ok = await requestPermissions();
        if (!ok) return;

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.7,
            allowsEditing: false,
        });

        if (result.canceled) return;

        const uri = result.assets?.[0]?.uri;
        if (!uri) return;

        setPhotos((p) => ({ ...p, [key]: uri }));
    }

    function removePhoto(key) {
        Alert.alert("Remove photo?", "This will mark the item as incomplete.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove", style: "destructive", onPress: () => setPhotos((p) => {
                    const copy = { ...p };
                    delete copy[key];
                    return copy;
                })
            },
        ]);
    }

    return (
        <Screen>
            <Card>
                <H1>Evidence Pack</H1>
                <P>
                    Capture required photos. This evidence helps enforce the settlement if
                    someone stops paying.
                </P>
            </Card>

            <Card style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ gap: 10 }}>
                    {REQUIRED.map((item) => {
                        const uri = photos[item.key];
                        return (
                            <View key={item.key} style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>
                                        {uri ? "✅ " : "⬜️ "}
                                        {item.label}
                                    </Text>

                                    {uri ? (
                                        <View style={styles.previewRow}>
                                            <Image source={{ uri }} style={styles.thumb} />
                                            <Button
                                                title="Retake"
                                                variant="secondary"
                                                onPress={() => takePhoto(item.key)}
                                            />
                                            <Button
                                                title="Remove"
                                                variant="danger"
                                                onPress={() => removePhoto(item.key)}
                                            />
                                        </View>
                                    ) : (
                                        <Button title="Take Photo" onPress={() => takePhoto(item.key)} />
                                    )}
                                </View>
                            </View>
                        );
                    })}

                    <Button
                        title="Continue to Payment Plan"
                        onPress={() => navigation.navigate("PaymentPlan")}
                        disabled={!complete}
                    />
                    {!complete && (
                        <Text style={{ color: theme.muted, fontSize: 12 }}>
                            Complete all items to continue.
                        </Text>
                    )}
                </ScrollView>
            </Card>
        </Screen>
    );
}

const styles = StyleSheet.create({
    row: {
        borderWidth: 1,
        borderColor: "#24314F",
        borderRadius: 14,
        padding: 12,
        backgroundColor: "#0E1830",
    },
    label: { color: theme.text, fontSize: 14, marginBottom: 8 },
    previewRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
    thumb: { width: 64, height: 64, borderRadius: 10, backgroundColor: "#111" },
});
