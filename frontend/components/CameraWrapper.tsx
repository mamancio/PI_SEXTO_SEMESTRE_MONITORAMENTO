import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';

export default function CameraWrapper() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [nativeCamera, setNativeCamera] = useState<any>(null);
  const [device, setDevice] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        setHasPermission(true);
      } else {
        // Importação condicional para evitar erro no Web
        const Camera = require('react-native-vision-camera').Camera;
        const useCameraDevices = require('react-native-vision-camera').useCameraDevices;

        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized');

        const devices = useCameraDevices();
        setDevice(devices.back);
        setNativeCamera(Camera);
      }
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web' && hasPermission && !streamRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.muted = true;
            videoRef.current.play();
          }
          streamRef.current = mediaStream;
        })
        .catch((err) => {
          console.warn('Erro ao ativar câmera (web):', err);
          alert('Erro ao acessar a câmera. Verifique as permissões no navegador.');
        });
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [hasPermission]);

  if (hasPermission === false) {
    return <Text style={styles.permissionText}>Permissão da câmera foi negada.</Text>;
  }

  if (Platform.OS === 'web' && hasPermission) {
    return (
      <View style={styles.videoContainer}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={styles.video}
        />
      </View>
    );
  }

  if (Platform.OS !== 'web' && hasPermission && nativeCamera && device) {
    const Camera = nativeCamera;
    return (
      <View style={styles.videoContainer}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
        />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  videoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  video: {
    width: '100%',
    maxWidth: 800,
    height: 480,
    borderRadius: 10,
    border: '2px solid #3498db',
    backgroundColor: '#000',
    objectFit: 'cover',
  } as any,
  camera: {
    width: '100%',
    height: 480,
    borderRadius: 10,
    overflow: 'hidden',
  },
  permissionText: {
    color: '#f00',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
  },
});
