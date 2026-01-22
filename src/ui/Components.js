import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { theme } from "./theme";

export function Screen({ children }) {
    return <View style={styles.screen}>{children}</View>;
}

export function Card({ children, style }) {
    return <View style={[styles.card, style]}>{children}</View>;
}


export function H1({ children }) {
    return <Text style={styles.h1}>{children}</Text>;
}

export function P({ children }) {
    return <Text style={styles.p}>{children}</Text>;
}

export function Button({ title, onPress, variant = "primary", disabled }) {
    const bg =
        variant === "danger"
            ? theme.danger
            : variant === "secondary"
                ? "#24314F"
                : theme.accent;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.btn,
                { backgroundColor: bg, opacity: disabled ? 0.5 : 1 },
            ]}
        >
            <Text style={styles.btnText}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.bg, padding: 16, gap: 12 },
    card: { backgroundColor: theme.card, borderRadius: 16, padding: 16, gap: 8 },
    h1: { color: theme.text, fontSize: 22, fontWeight: "800" },
    p: { color: theme.muted, fontSize: 14, lineHeight: 20 },
    btn: { borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 10 },
    btnText: { color: "white", fontSize: 16, fontWeight: "700" },
});
