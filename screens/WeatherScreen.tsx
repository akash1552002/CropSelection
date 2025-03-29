import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

type Props = {}; // Define props type if needed
type State = {}; // Define state type if needed

export default class WeatherScreen extends Component<Props, State> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>🌤️ Weather Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 20, fontWeight: "bold", color: "#4CAF50" },
});
