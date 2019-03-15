/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Clipboard,
  Linking,
  Keyboard,
  ToastAndroid
} from "react-native";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hexText: "",
      decodedText: "",
      isDecoded: false
    };
  }

  componentDidMount() {
    this._focusOnFirstLaunch();
  }

  _focusOnFirstLaunch = () => {};

  _getClipboardString = async () => {
    const copyText = await Clipboard.getString();
    return copyText;
  };

  _hexDecode = hex => {
    let string = "";
    hex = hex.replace(/\s+/g, "");
    for (let i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
  };

  _handleChangeText = async text => {
    await this.setState({
      hexText: text
    });
    console.log("text changed", this.state.hexText);
  };

  _handleDecode = async () => {
    if (this.state.hexText === "") {
      ToastAndroid.show("Please input or copy something", ToastAndroid.SHORT);
      Keyboard.dismiss();
      return;
    }
    const decodedText = await this._hexDecode(this.state.hexText);
    console.log("decoded", decodedText);
    this.setState({ decodedText });
    Keyboard.dismiss();
    await Clipboard.setString(decodedText);
    ToastAndroid.show("Your sauce has been copied", ToastAndroid.SHORT);
  };

  _goToLink = url => {
    const canOpenURL = Linking.canOpenURL(url);
    if (canOpenURL) {
      Linking.openURL(url);
    } else {
      ToastAndroid("Can't Open Link", ToastAndroid.SHORT);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>HEX CONVERT</Text>
        <Text style={styles.label}>Hex String:</Text>
        <TextInput
          style={styles.hexInput}
          onChangeText={this._handleChangeText}
          multiline={true}
          placeholder="Input hex code here"
          numberOfLines={5}
          value={this.state.hexText}
          ref="hexInput"
          autoFocus
        />
        <TouchableHighlight
          style={styles.button}
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <Button title="Decode now" onPress={this._handleDecode} />
        </TouchableHighlight>
        <Text style={[styles.label, { marginTop: 20 }]}>Decoded String</Text>
        <TextInput
          placeholder="Decode text here"
          style={styles.hexInput}
          multiline={true}
          numberOfLines={3}
          value={this.state.decodedText}
          selectTextOnFocus={true}
        />
        <TouchableHighlight style={styles.button}>
          <Button
            title="Let taste the sauce!!!"
            onPress={() => {
              this._goToLink(this.state.decodedText);
            }}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  hexInput: {
    borderWidth: 0.5,
    width: "90%",
    textAlignVertical: "top",
    borderRadius: 10,
    margin: 10,
    padding: 10
  },
  button: {
    width: "90%"
  },
  label: {
    fontWeight: "bold"
  }
});
