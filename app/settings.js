import { useState, useEffect } from "react";
import supabase from "./Supabase";
import { StyleSheet, View, Alert } from "react-native";
import { Button, Text } from "react-native-elements";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
  const params = useLocalSearchParams();
  console.log("params: ", params);
  const email = params.email;
  // const [email, setEmail] = useState("");

  // async function getProfile() {
  //   try {
  //     setLoading(true);
  //     if (!session?.user) throw new Error("No user on the session!");

  //     // const { data, error, status } = await supabase
  //     //   .from("profiles")
  //     //   .select(`username, website, avatar_url`)
  //     //   .eq("id", session?.user.id)
  //     //   .single();
  //     // if (error && status !== 406) {
  //     //   throw error;
  //     // }

  //     if (data) {
  //       setUsername(data.username);
  //       setWebsite(data.website);
  //       setAvatarUrl(data.avatar_url);
  //     }
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       Alert.alert(error.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // async function updateProfile({ username, website, avatar_url }) {
  //   try {
  //     setLoading(true);
  //     if (!session?.user) throw new Error("No user on the session!");

  //     const updates = {
  //       id: session?.user.id,
  //       username,
  //       website,
  //       avatar_url,
  //       updated_at: new Date(),
  //     };

  //     const { error } = await supabase.from("profiles").upsert(updates);

  //     if (error) {
  //       throw error;
  //     }
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       Alert.alert(error.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text>Your email: {email}</Text>
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
