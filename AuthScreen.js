import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../ui/theme";

export default function AuthScreen() {
    const navigation = useNavigation();
    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const isLogin = mode === "login";

    function validate() {
        if (!email.trim()) return "Email is required.";
        if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email.";
        if (!password) return "Password is required.";
        if (password.length < 6) return "Password must be at least 6 characters.";
        if (!isLogin && password !== confirmPassword) return "Passwords do not match.";
        return null;
    }

    async function handleSubmit() {
        const error = validate();
        if (error) {
            Alert.alert("Oops", error);
            return;
        }

        setLoading(true);
        // TODO: replace with real auth (Firebase, Supabase, etc.)
        await new Promise((r) => setTimeout(r, 1000)); // simulate network
        setLoading(false);

        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {/* Logo / Brand */}
            <View style={styles.brand}>
                <Text style={styles.logo}>⚡ TapToSettle</Text>
                <Text style={styles.tagline}>PA • Property Damage • $2,000 cap</Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
                {/* Tab toggle */}
                <View style={styles.tabs}>
                    <Pressable
                        style={[styles.tab, isLogin && styles.tabActive]}
                        onPress={() => setMode("login")}
                    >
                        <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                            Log In
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, !isLogin && styles.tabActive]}
                        onPress={() => setMode("signup")}
                    >
                        <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                            Sign Up
                        </Text>
                    </Pressable>
                </View>

                {/* Fields */}
                <View style={styles.fields}>
                    <Field
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="you@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Field
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        secureTextEntry
                    />
                    {!isLogin && (
                        <Field
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="••••••••"
                            secureTextEntry
                        />
                    )}
                </View>

                {/* Submit */}
                <Pressable
                    style={[styles.btn, loading && { opacity: 0.6 }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.btnText}>
                            {isLogin ? "Log In" : "Create Account"}
                        </Text>
                    )}
                </Pressable>

                {/* Forgot password (login only) */}
                {isLogin && (
                    <Pressable onPress={() => Alert.alert("Reset Password", "Feature coming soon.")}>
                        <Text style={styles.forgot}>Forgot password?</Text>
                    </Pressable>
                )}
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                By continuing you agree to our Terms of Service and Privacy Policy.
            </Text>
        </KeyboardAvoidingView>
    );
}

function Field({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize }) {
    return (
        <View style={{ gap: 6 }}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.muted}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize ?? "none"}
                autoCorrect={false}
                style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: theme.bg,
        justifyContent: "center",
        padding: 24,
        gap: 20,
    },
    brand: {
        alignItems: "center",
        gap: 6,
    },
    logo: {
        color: theme.text,
        fontSize: 28,
        fontWeight: "900",
        letterSpacing: -0.5,
    },
    tagline: {
        color: theme.muted,
        fontSize: 13,
    },
    card: {
        backgroundColor: theme.card,
        borderRadius: 20,
        padding: 20,
        gap: 16,
    },
    tabs: {
        flexDirection: "row",
        backgroundColor: "#0B1220",
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 10,
    },
    tabActive: {
        backgroundColor: theme.accent,
    },
    tabText: {
        color: theme.muted,
        fontSize: 14,
        fontWeight: "600",
    },
    tabTextActive: {
        color: "#fff",
    },
    fields: {
        gap: 14,
    },
    label: {
        color: theme.text,
        fontSize: 13,
        fontWeight: "600",
    },
    input: {
        backgroundColor: "#0B1220",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 13,
        color: theme.text,
        fontSize: 15,
        borderWidth: 1,
        borderColor: "#24314F",
    },
    btn: {
        backgroundColor: theme.accent,
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: "center",
    },
    btnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    forgot: {
        color: theme.accent,
        fontSize: 13,
        textAlign: "center",
        marginTop: -4,
    },
    footer: {
        color: theme.muted,
        fontSize: 11,
        textAlign: "center",
        lineHeight: 16,
    },
});
