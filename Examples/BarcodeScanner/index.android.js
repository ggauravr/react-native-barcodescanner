import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Vibration,
  View
} from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';
import Popup from 'react-native-popup';

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
    this.resetState = this.resetState.bind(this);
  }

  findProduct(barcode) {
      return fetch(`http://192.168.107.46:8080/barcodes/find/${barcode}`)
                .then(response => response.json())
  }

  resetState() {
      this.setState({
        barcode: '',
        productName: '',
        text: 'Scan Barcode',
        type: '',
      });
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

                    this.popup.tip({
                        title: 'Product found!',
                        content: `${productName}`,
                        btn: {
                            text: 'OK!',
                            style: {
                                color: 'green'
                            },
                            callback: () => {
                                this.resetState();
                            }
                        }
                    });
                }
                else {
                    this.popup.tip({
                        title: 'Product not found!',
                        content: 'Please try again',
                        btn: {
                            text: 'Close!',
                            style: {
                                color: 'red'
                            },
                            callback: () => {
                                this.resetState();
                            }
                        }
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

        <Popup ref={popup => this.popup = popup } isOverlayClickClose={false} />

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
