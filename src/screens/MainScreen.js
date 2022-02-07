import React, {Component} from 'react';
import {
  View,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Contacts from 'react-native-contacts';
import RNCallKeep from 'react-native-callkeep';
import uuid from 'uuid';
// import {AppContext, Navbar} from 'app/comcdponents';

const dm = Dimensions.get('screen');
class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastCallNumber: '',
    };
    this.currentCallId = null;

    // Initialise RNCallKeep
    const options = {
      ios: {
        appName: 'Nope',
      },
      android: {
        alertTitle: 'Permissions required',
        alertDescription:
          'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
      },
    };

    try {
      RNCallKeep.setup(options);
      RNCallKeep.setAvailable(true); // Only used for Android, see doc above.
    } catch (err) {
      console.error('initializeCallKeep error:', err.message);
    }

    // Add RNCallKeep Events
    RNCallKeep.addEventListener('didReceiveStartCallAction', this.onNativeCall);
    RNCallKeep.addEventListener('answerCall', this.onAnswerCallAction);
    RNCallKeep.addEventListener('endCall', this.onEndCallAction);
    RNCallKeep.addEventListener(
      'didDisplayIncomingCall',
      this.onIncomingCallDisplayed,
    );
    RNCallKeep.addEventListener(
      'didPerformSetMutedCallAction',
      this.onToggleMute,
    );
    RNCallKeep.addEventListener(
      'didActivateAudioSession',
      this.audioSessionActivated,
    );
  }

  onNativeCall = ({handle}) => {
    // Your normal start call action
    alert('call');
    RNCallKeep.startCall(this.getCurrentCallId(), handle);
  };

  onAnswerCallAction = ({callUUID}) => {
    // called when the user answer the incoming call
  };

  onEndCallAction = ({callUUID}) => {
    RNCallKeep.endCall(this.getCurrentCallId());

    this.currentCallId = null;
  };

  onIncomingCallDisplayed = error => {
    alert('call');
    // You will get this event after RNCallKeep finishes showing incoming call UI
    // You can check if there was an error while displaying
  };

  onToggleMute = muted => {
    // Called when the system or the user mutes a call
  };

  audioSessionActivated = data => {
    // you might want to do following things when receiving this event:
    // - Start playing ringback if it is an outgoing call
  };

  getCurrentCallId = () => {
    if (!this.currentCallId) {
      this.currentCallId = uuid.v4();
    }

    return this.currentCallId;
  };

  async componentDidMount() {
    this.reload();
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(() => {
        Contacts.getAll((err, contacts) => {
          if (err === 'denied') {
            // error
            throw err;
          } else {
            // contacts returned in Array
            this.parseContacts(contacts);
          }
        });
      });
    } else {
      Contacts.getAll((err, contacts) => {
        if (err) {
          throw err;
        }
        // contacts returned
      });
    }
  }

  reload = async () => {
    // await this.context.showLoading();
    //
    // this.context.hideLoading();
  };

  leftHandler = () => {
    this.props.navigation.toggleDrawer();
  };

  upVote() {
    alert('Yep!');
  }

  downVote() {
    alert('Nope!');
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Navbar
          left="ios-menu"
          leftHandler={this.leftHandler}
          title="Dashboard"
        /> */}
        <View style={styles.container}>
          <Text style={styles.title}>Nope</Text>
          <Text style={styles.description}>Please rate the calls below:</Text>
          <View style={styles.box}>
            <Text style={styles.description}>Was this call legit?</Text>
            <Text style={styles.description}>{this.state.lastCallNumber}</Text>
          </View>
          <View style={styles.voteBox}>
            <View style={styles.leftBox}>
              <TouchableOpacity onPress={() => this.upVote()}>
                <Text style={styles.voteTitle}>Yep</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rightBox}>
              <TouchableOpacity onPress={() => this.downVote()}>
                <Text style={styles.voteTitle}>Nope!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

// MainScreen.contextType = AppContext;

MainScreen.propTypes = {
  navigation: PropTypes.object,
};

export default MainScreen;

const styles = StyleSheet.create({});
