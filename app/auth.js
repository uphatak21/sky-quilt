import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  Text,
} from "react-native";
import supabase from "./Supabase";
import { Button, Input } from "react-native-elements";
// change to be a pressable?

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    console.log("pressed");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
    } catch (error) {
      console.error(error);
    }
    // if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    console.log("pressed");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
    } catch (error) {
      console.error(error);
    }
    // if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
          style={styles.button}
        />
      </View>
      {/* <Pressable style={styles.buttonContainer} onPress={signInWithEmail}>
        <Text style={styles.buttonText}>sign in</Text>
      </Pressable> */}
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
      {/* <Pressable
        style={styles.buttonContainer}
        onPress={() => signUpWithEmail()}
      >
        <Text style={styles.buttonText}>sign up</Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    width: "90%",
    // borderColor: "blue",
    // borderWidth: 5,
    marginTop: windowHeight * 0.1,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  buttonContainer: {
    borderRadius: 8,
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: windowWidth * 0.04,
    fontWeight: "bold",
    textAlign: "center",
  },
});
