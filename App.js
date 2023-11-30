import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);

      fetch(`http://192.168.100.62:8080/buy?code=${data}`, {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
      }).then(response => response.json()).then((response) => {
          Alert.alert(`${response.message}`, `Ticket code: ${data}`);
      }).catch(() => {
          Alert.alert(`Network error`, `Ticket code: ${data}`);
      });
  };

  if (hasPermission === null) {
      return <View style={styles.container}><Text style={styles.text}>Requesting for camera permission...</Text></View>;
  }
  if (hasPermission === false) {
      return <View style={styles.container}><Text style={styles.text}>No access to camera</Text></View>;
  }

  return (
      <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}

            />

          <View style={styles.bottom}>
              <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
                  <Ionicons name="camera" size={48} color="white" />
              </TouchableOpacity>
          </View>
          <View style={styles.copyright}>
              <Text style={styles.copyText}>&copy; Created by <Text style={styles.bold}>Jelena Kičić</Text></Text>
              <Text style={styles.copyText}>Powered by <Text style={styles.bold}>ISCON</Text></Text>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e1b4d',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {
        marginTop: 'auto',
        marginBottom: 20
    },
    button: {
        width: 80,
        height: 80,
        backgroundColor: '#f82249',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    text: {
        color: '#fff',
    },
    copyText: {
        color: '#fff',
        fontStyle: "italic",
        fontWeight: "100",
        fontSize: 11,
        textAlign: "center"
    },
    bold: {
        fontWeight: "300",
        fontStyle: "italic",
    },
    copyright: {
        marginBottom: 15,
        textAlign: "center"
    }
});
