import { useTheme } from "@/src/context/ThemeContext";
import { uploadImageToCloudinary } from "@/src/services/cloudinary";
import { useAuthStore } from "@/src/store/authStore";
import { isValidHabitName } from "@/src/utils/validators";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";

interface ProfileSetupScreenProps {
  navigation: any;
}

export default function ProfileSetupScreen({
  navigation,
}: ProfileSetupScreenProps) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user, updateUserData } = useAuthStore();

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      async (response) => {
        if (response.didCancel || response.errorCode) {
          return;
        }

        if (response.assets && response.assets[0]) {
          setPhotoUri(response.assets[0].uri || null);
        }
      }
    );
  };

  const handleComplete = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    if (!isValidHabitName(name)) {
      Alert.alert("Error", "Name must be between 1 and 50 characters");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    setUploading(true);
    try {
      let photoUrl: string | undefined;

      if (photoUri) {
        // Convert image to base64
        const response = await fetch(photoUri);
        const blob = await response.blob();
        const reader = new FileReader();

        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const base64String = (reader.result as string).split(",")[1];
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        photoUrl = await uploadImageToCloudinary(base64);
      }

      await updateUserData({
        uid: user.uid,
        name: name.trim(),
        photoUrl: photoUrl ? photoUrl : undefined,
        createdAt: Date.now(),
      });

      // Navigation will be handled by App.tsx
      // Just wait for state to update
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to setup profile");
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Complete Your Profile
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Add your name and photo
        </Text>

        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: theme.colors.border },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  { color: theme.colors.textTertiary },
                ]}
              >
                +
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
            },
          ]}
          placeholder="Your Name"
          placeholderTextColor={theme.colors.textTertiary}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.colors.primary },
            uploading && styles.buttonDisabled,
          ]}
          onPress={handleComplete}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color={theme.colors.textInverse} />
          ) : (
            <Text
              style={[styles.buttonText, { color: theme.colors.textInverse }]}
            >
              Complete Setup
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  imageContainer: {
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 48,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    width: "100%",
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
