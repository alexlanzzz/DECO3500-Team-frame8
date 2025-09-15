// app/map_page.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Button,
  Image,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./App";
import { Place } from "./types";

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, "MapPage">;

const sampleData: Place[] = [
  {
    id: "1",
    time: "8:00 am",
    name: "City Botanic Garden",
    type: "place",
    latitude: -27.477,
    longitude: 153.029,
  },
  {
    id: "2",
    time: "12:00 pm",
    name: "Sinjeon",
    type: "move",
    latitude: -27.47,
    longitude: 153.025,
  },
  {
    id: "3",
    time: "14:00 pm",
    name: "City Botanic Garden",
    type: "place",
    latitude: -27.469,
    longitude: 153.032,
  },
];

const MapPage = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});

  const handleConfirm = (id: string) => {
    console.log("Confirmed comment:", comments[id]);
    setOpenCommentId(null);
  };

  const TimelineIcon = ({ type }: { type: Place["type"] }) => {
    if (type === "move") return <Ionicons name="walk-outline" size={16} color="#007AFF" />;
    return <MaterialCommunityIcons name="map-marker-outline" size={18} color="#007AFF" />;
  };

  const renderItem = ({ item, index }: { item: Place; index: number }) => {
    const isFirst = index === 0;
    const isLast = index === sampleData.length - 1;

    return (
      <View style={styles.row}>
        
        <View style={styles.rail}>
          {!isFirst && <View style={[styles.railLine, { top: 0 }]} />}
          <View style={styles.railNode}>
            <View style={styles.railDot} />
            <View style={styles.railIconWrap}>
              <TimelineIcon type={item.type} />
            </View>
          </View>
          {!isLast && <View style={[styles.railLine, { bottom: 0 }]} />}
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: item.image || "https://via.placeholder.com/600x300.png" }}
            style={styles.image}
          />
          <View style={styles.cardFooter}>
            <Text style={styles.timeText}>
              {item.time} {item.name}
            </Text>

            <TouchableOpacity
              onPress={() => setOpenCommentId(openCommentId === item.id ? null : item.id)}
              style={styles.commentBtn}
            >
              <Text style={styles.commentText}>comment</Text>
            </TouchableOpacity>
          </View>

          {openCommentId === item.id && (
            <View style={styles.commentBox}>
              <TextInput
                placeholder="Enter your comment..."
                style={styles.input}
                multiline
                value={comments[item.id] || ""}
                onChangeText={(t) => setComments((prev) => ({ ...prev, [item.id]: t }))}
              />
              <Button title="Confirm" onPress={() => handleConfirm(item.id)} />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.navbar}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Brisbane</Text>

        <TouchableOpacity onPress={() => navigation.navigate("Map", { places: sampleData })}>
          <View style={styles.mapViewBtn}>
            <Ionicons name="map-outline" size={16} color="#007AFF" />
            <Text style={styles.mapViewText}>Map View</Text>
          </View>
        </TouchableOpacity>
      </View>


      <FlatList
        data={sampleData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const RAIL_WIDTH = 36;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  navbar: {
    height: 56,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E6E6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  title: { fontSize: 18, fontWeight: "600" },
  mapViewBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  mapViewText: { color: "#007AFF", fontSize: 16, fontWeight: "500" },

  listContent: { paddingVertical: 12, paddingRight: 12 },

  row: { flexDirection: "row", paddingLeft: 12, paddingVertical: 6 },

  rail: { width: RAIL_WIDTH, alignItems: "center", position: "relative" },
  railLine: {
    position: "absolute",
    width: 2,
    backgroundColor: "#D7D7D7",
    left: RAIL_WIDTH / 2 - 1,
    top: 0,
    bottom: 0,
  },
  railNode: { width: RAIL_WIDTH, height: 24, alignItems: "center", justifyContent: "center" },
  railDot: { position: "absolute", width: 10, height: 10, borderRadius: 5, backgroundColor: "#007AFF" },
  railIconWrap: { position: "absolute", top: -18, right: 2, backgroundColor: "transparent" },

  card: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  image: { width: "100%", height: 150 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeText: { fontSize: 15, fontWeight: "500" },
  commentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D0D0D0",
  },
  commentText: { color: "#007AFF", fontSize: 13, fontWeight: "600" },

  commentBox: { paddingHorizontal: 12, paddingBottom: 12, gap: 8 },
  input: { borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 8, padding: 10, minHeight: 40 },
});

export default MapPage;
