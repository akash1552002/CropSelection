import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Image, StatusBar } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImageManipulator from "expo-image-manipulator";

const ScanPlantScreen = () => {
    const navigation = useNavigation<any>();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<any>(null);
    const [capturing, setCapturing] = useState(false);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center", marginBottom: 20 }}>
                    We need your permission to show the camera
                </Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                    <Text style={styles.permissionBtnText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current && !capturing) {
            setCapturing(true);
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.7,
                    skipProcessing: true, // Faster capture
                });

                // Resize if needed (optional, good for API uploads)
                const manipResult = await ImageManipulator.manipulateAsync(
                    photo.uri,
                    [{ resize: { width: 800 } }],
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );

                navigation.navigate("DiagnosisResult", { imageUri: manipResult.uri });
            } catch (error) {
                Alert.alert("Error", "Failed to take picture");
            } finally {
                setCapturing(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <CameraView style={styles.camera} facing="back" ref={cameraRef} />

            {/* Overlay Layout - Moved outside CameraView */}
            <View style={styles.overlay} pointerEvents="box-none">

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                        <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Scan Plant</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Focus Frame */}
                <View style={styles.focusFrameContainer} pointerEvents="none">
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                    <View style={styles.scanLine} />
                </View>
                <Text style={styles.hintText}>Place the leaf inside the frame</Text>

                {/* Footer controls */}
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.galleryBtn}>
                        <Ionicons name="images-outline" size={28} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.captureBtnOuter}
                        onPress={takePicture}
                        disabled={capturing}
                    >
                        <View style={styles.captureBtnInner} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.flashBtn}>
                        <Ionicons name="flash-off-outline" size={28} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    camera: {
        flex: 1,
    },
    permissionBtn: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10
    },
    permissionBtnText: {
        color: 'white',
        fontWeight: 'bold'
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    closeBtn: {
        padding: 5
    },
    focusFrameContainer: {
        alignSelf: 'center',
        width: 280,
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: 'white',
        borderWidth: 4
    },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
    scanLine: {
        width: '100%',
        height: 2,
        backgroundColor: '#4CAF50',
        position: 'absolute',
        top: '50%'
    },
    hintText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignSelf: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 30
    },
    captureBtnOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 5,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    captureBtnInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white'
    },
    galleryBtn: {
        padding: 10
    },
    flashBtn: {
        padding: 10
    }
});

export default ScanPlantScreen;
