import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ListRenderItem,
  FlatList,
  ImageBackgroundComponent
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import PixelButton from "../../components/PixelButton";
import IconButton from "../../components/IconButton";
import Header from "@/components/Header";
import SearchInput from "../../components/SearchInput";
import {
  deleteFriendship,
  fetchFriendships
} from "../../lib/database";
import { getUserIcon } from "../../lib/icon";
import { Friendship, User } from "@/constants/types";

const Leaderboard = () => {
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const loadFriendshipRequests = async () => {
      try {
        const result = await fetchFriendships();
        setFriendships(result);
      } catch (error) {
        console.error("Error fetching friendship requests:", error);
      }
    };

    loadFriendshipRequests();
  }, []);

  const handleDeletingFriendship = async (friendId: string, accepted: boolean) => {
    try {
      await deleteFriendship(friendId);
      // Update local state of friendships
      const updatedRequests = friendships.filter(
        (request) => request.$id !== friendId
      );
      setFriendships(updatedRequests);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const renderFriends: ListRenderItem<Friendship> = ({ item }) => (
    <View
    className="bg-white rounded-xl flex-row items-center p-2 px-5 my-2"
    key={item.$id}
  >
    <Image
      source={getUserIcon(item.user.icon)}
      style={{ width: 64, height: 64 }}
      resizeMode="stretch"
    />
    <View className="px-2">
      <Text className="font-zcool text-2xl">
        {item.user.username}
      </Text>
      <Text className="font-zcool text-lg text-gray">
        1351 XP
      </Text>
    </View>
  </View>
  );

  const filteredFriends = friendships;
  //  .filter(friendship => friendship.user.xp)

  const topThree = filteredFriends.slice(0, 3);
  

  return (
    <ImageBackground
      source={require("../../assets/HD/blue_sky_no_clouds.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <Header header={`Leaderboard!`} />
      <ScrollView className="flex-1 w-full">
        <View className="pt-5 px-5">
          <View className="mx-auto">
            <ImageBackground
              source={require("../../assets/HD/podium.png")}
              className="w-[89vw] h-[59vw]"
              resizeMode="cover"
            >
                
            </ImageBackground>
          </View>
          
          <FlatList
            data={filteredFriends}
            renderItem={renderFriends}
            keyExtractor={(item: User) => item.$id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Leaderboard;
