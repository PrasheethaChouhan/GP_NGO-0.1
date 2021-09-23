import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
import db from "../config";
import { Header, Icon } from "react-native-elements";
export default class Donation extends React.Component {
  constructor() {
    super();
    this.state = {
      ngoId: firebase.auth().currentUser.email,
      donationList: [],
    };
  }

  getDonations = () => {
    var email = this.state.ngoId;
    this.requestRef = db
      .collection("donations")
      .where("ngoId", "==", email)
      .onSnapshot((snapshot) => {
        var dbpreviousEvents = [];

        snapshot.docs.map((doc) => {
          dbpreviousEvents.push(doc.data());
        });
        console.log(dbpreviousEvents);

        this.setState({
          donationList: dbpreviousEvents,
        });
        console.log(this.state.donationList);
      });
  };
  componentDidMount() {
    this.getDonations();
  }
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <View style={{ width: "90%" }}>
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 2,
            borderColor: "white",
            margin: 5,
            borderRadius: 10,
          }}
          onPress={() => {
            this.props.navigation.navigate("GetDonation", {
              eventDetails: item,
            });
          }}
        >
          <View
            style={{
              flex: 0.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", textAlign: "center", margin: 5 }}>
              Name: {item.eventName}
            </Text>
            <Text style={{ color: "white", textAlign: "center" }}>
              Event Id: {item.eventId}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1B2E0F",
        }}
      >
        <Header
          centerComponent={{
            text: "Donation list",
            style: { color: "#90A5A9", fontSize: 20, fontWeight: "bold" },
          }}
          rightComponent={
            <Icon name="paw" type="font-awesome" color="#696969" />
          }
          backgroundColor="#eaf8fe"
        />

        <View style={styles.modalContainer}>
          {this.state.donationList.length === 0 ? (
            <Text style={{ color: "white", fontSize: 20 }}>
              No donations found
            </Text>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.donationList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "90%",
    justifyContent: "center",
    backgroundColor: "#1B2E0F",
  },
  img: {
    flex: 0.4,
    width: "50%",
    height: 100,
    resizeMode: "contain",
    borderRadius: 10,
    justifyContent: "center",
  },
});
