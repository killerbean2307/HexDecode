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
  TouchableHighlight,
  Clipboard,
  Linking,
  Keyboard,
  ToastAndroid,
  TouchableOpacity
} from "react-native";
import { Input } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hexText: "",
      decodedText: "",
      isDecoded: false
    };
  }

  _hexDecode = hex => {
    let string = "";
    hex = hex.replace(/\s+/g, "");
    for (let i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
  };

  _handleChangeHexText = async text => {
    await this.setState({
      hexText: text
    });
    console.log("hex text changed", this.state.hexText);
  };

  _handleChangeDecodedText = async text => {
    await this.setState({
      decodedText: text
    });
    console.log("decoded text changed", this.state.decodedText);
  };

  _handleDecode = () => {
    if (this.state.hexText === "") {
      ToastAndroid.show("Please input or copy something", ToastAndroid.SHORT);
      Keyboard.dismiss();
      return;
    }

    const decodedText = this._hexDecode(this.state.hexText);
    console.log("decoded", decodedText);

    this.setState({ decodedText });
    Keyboard.dismiss();
  };

  _handleCopy = async () => {
    await Clipboard.setString(this.state.decodedText);
    ToastAndroid.show("Your sauce has been copied", ToastAndroid.SHORT);
  };

  _goToLink = async url => {
    if (url === "") {
      ToastAndroid.show("Enter some sauce!!!", ToastAndroid.SHORT);
      return;
    }

    try {
      const canOpenURL = await Linking.canOpenURL(url);

      if (canOpenURL) {
        Linking.openURL(url);
      } else {
        ToastAndroid.show("Can't open link", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 30, fontWeight: "bold", marginVertical: 20 }}>
          HEX CONVERT
        </Text>
        <Text style={styles.label}>Hex String:</Text>
        <Input
          containerStyle={styles.hexInput}
          inputContainerStyle={{
            borderBottomColor: "transparent"
          }}
          onChangeText={this._handleChangeHexText}
          placeholder="Input hex code here"
          value={this.state.hexText}
          ref="hexInput"
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
        <Input
          placeholder="Decode text here"
          containerStyle={styles.hexInput}
          inputContainerStyle={{
            borderBottomColor: "transparent"
          }}
          onChangeText={this._handleChangeDecodedText}
          value={this.state.decodedText}
          selectTextOnFocus={true}
          rightIcon={
            <TouchableOpacity
              onPress={this._handleCopy}
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            >
              <FontAwesome5 name={"copy"} size={25} />
            </TouchableOpacity>
          }
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
