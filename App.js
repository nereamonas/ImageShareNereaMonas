import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image,  Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import logo from './assets/logo.png';

export default function App() {
    const [selectedImage, setSelectedImage] = React.useState(null);

    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }
        if (Platform.OS === 'web') {
            let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
            setSelectedImage({ localUri: pickerResult.uri, remoteUri });
        } else {
            setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
        }
    }
    let openShareDialogAsync = async () => {
        if (!(await Sharing.isAvailableAsync())) {
            alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
            return;
        }

        await Sharing.shareAsync(selectedImage.localUri);
    };
    if (selectedImage !== null) {
        return (
            <View style={styles.container}>
                <Text style={styles.instructions} >
                    Esta es la foto que has seleccionado:

                </Text>
                <Image
                    source={{ uri: selectedImage.localUri }}
                    style={styles.thumbnail}
                />
                <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
                    <Text style={styles.buttonText}>Toca para compartir</Text>
                </TouchableOpacity>
            </View>
        );
    }
    return (
    <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.instructions} >
            Para compartir una foto de su teléfono con un amigo, ¡simplemente presione el botón de abajo!

        </Text>

        <TouchableOpacity
            onPress={openImagePickerAsync} style={styles.button}>
            <Text style={styles.buttonText}>Selecciona una foto</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
    logo: {
        width: 305,
        height: 200,
        marginBottom: 10,
    },
    instructions: {
        color: '#888',
        fontSize: 18,
        marginHorizontal: 15,
    },
    button: {
        backgroundColor: '#1ea9e0',
        padding: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
    thumbnail: {
        width: 300,
        height: 300,
        resizeMode: "contain"
    }
});
