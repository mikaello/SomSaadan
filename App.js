/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeAppEventEmitter,
} from 'react-native';

var SpeechToText = require('react-native-speech-to-text-ios');

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  subscription = null;

  constructor(props) {
    super(props);

    this.state = {
      somsaadan: 0,
      lastSomSaadanIndex: -1,
      stoppedRecognition: false,
    };
  }

  componentWillUnmount() {
    if (this.subscription != null) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  startRecognition = () => {
    this.setState({ stoppedRecognition: false, lastSomSaadanIndex: -1 });

    console.log('RECOGNITION STARTED');

    this.subscription = NativeAppEventEmitter.addListener(
      'SpeechToText',
      result => {
        console.log('got som results', result);
        if (result.error) {
          alert(JSON.stringify(result.error));
        } else {
          const string = result.bestTranscription.formattedString.toLowerCase();
          const idx1 = string.lastIndexOf('som sådan');
          const idx2 = string.lastIndexOf('samson');
          const idx3 = string.lastIndexOf('samsung samsung');
          const idx4 = string.lastIndexOf('som så den');
          const idx5 = string.lastIndexOf('sånn så da');
          const idx6 = string.lastIndexOf('sånne Samson');
          this.setState(state =>
            this.increaseSomSaadan(
              state,
              Math.max(idx1, idx2, idx3, idx4, idx5, idx6),
            ),
          );
          console.log(result.bestTranscription.formattedString);

          if (result.isFinal && !this.state.stoppedRecognition) {
            this.setState(this.resetCounter);
            SpeechToText.startRecognition('no');
          }
        }
      },
    );

    SpeechToText.startRecognition('no');
  };

  resetCounter = state => ({
    lastSomSaadanIndex: -1,
  });

  increaseSomSaadan = (state, idx) => {
    if (idx > state.lastSomSaadanIndex) {
      return {
        somsaadan: state.somsaadan + 1,
        lastSomSaadanIndex: idx,
      };
    } else {
      return state;
    }
  };

  stopRecognition = () => {
    console.log('da er det slutt :-(');
    this.setState({ stoppedRecognition: true });
    SpeechToText.finishRecognition();
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.startRecognition}>
          <Text style={styles.welcome}>
            Start the <SomSaadan /> counter
          </Text>
        </TouchableOpacity>
        <Text style={styles.counter}>Counting: {this.state.somsaadan}</Text>
        <TouchableOpacity onPress={this.stopRecognition}>
          <Text style={styles.stopIt}>
            Stopp <SomSaadan />
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const SomSaadan = () => (
  <Text
    style={{
      fontFamily: 'GujaratiSangamMN-Bold',
      fontWeight: '600',
      fontSize: 25,
    }}
  >
    SomSaadan
  </Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    borderRadius: 7,
    borderWidth: 2,
    padding: 10,
    paddingTop: 15,
  },
  counter: {
    textAlign: 'center',
    color: 'tomato',
    margin: 30,
    fontWeight: '600',
    fontSize: 20,
  },
  stopIt: {
    borderRadius: 7,
    borderWidth: 2,
    padding: 10,
    paddingTop: 15,
  },
});
