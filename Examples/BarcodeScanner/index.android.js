import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Vibration,
  View
} from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';

class BarcodeScannerApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      barcode: '',
      cameraType: 'back',
      text: 'Scan Barcode',
      torchMode: 'off',
      type: '',
      productName: '',
    };

    this.handleBarcode = this.handleBarcode.bind(this);
    this.findProduct = this.findProduct.bind(this);
  }

  findProduct(barcode) {
      return fetch(`http://192.168.107.46:8080/barcodes/find/${barcode}`)
                .then(response => response.json())
  }

  handleBarcode(e) {
    if (e.data !== this.state.barcode || e.type !== this.state.type) {
        Vibration.vibrate();

        this.findProduct(e.data)
            .then(product => {
                if (product) {
                    let productName = product.product_name;
                    // product found
                    this.setState({
                      barcode: product.upc,
                      productName,
                      text: `${productName}`,
                      type: e.type,
                    });
                }
                else {
                    // product not found
                    this.setState({
                      barcode: '',
                      productName: '',
                      text: 'Scan Barcode',
                      type: '',
                    });
                }
            })
            .catch(err => {})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <BarcodeScanner
          onBarCodeRead={this.handleBarcode}
          style={{ flex: 1 }}
          torchMode={this.state.torchMode}
          cameraType={this.state.cameraType}
        />
        <View style={styles.statusBar}>
          <Text style={styles.statusBarText}>{this.state.text}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBarText: {
    fontSize: 20,
  },
});

AppRegistry.registerComponent('BarcodeScanner', () => BarcodeScannerApp);
