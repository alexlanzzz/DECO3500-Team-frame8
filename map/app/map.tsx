import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import MapView, { Marker, Polyline, LatLng } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./App";

type MapRouteProp = RouteProp<RootStackParamList, "Map">;

export default function MapScreen() {
  const navigation = useNavigation();
  const route = useRoute<MapRouteProp>();
  const { places } = route.params;

 
  const mapRef = useRef<MapView | null>(null);

 
  const initial = places[0]
    ? { latitude: places[0].latitude, longitude: places[0].longitude }
    : { latitude: -27.4698, longitude: 153.0251 };


  useEffect(() => {
    if (!places?.length) return;
    const coords: LatLng[] = places.map(p => ({ latitude: p.latitude, longitude: p.longitude }));
    
    requestAnimationFrame(() => {
      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
        animated: true,
      });
    });
  }, [places]);

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Brisbane</Text>
        <View style={{ width: 24 }} />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: initial.latitude,
          longitude: initial.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {places.map(p => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={`${p.time} ${p.name}`}
          />
        ))}

        <Polyline
          coordinates={places.map(p => ({ latitude: p.latitude, longitude: p.longitude }))}
          strokeColor="#FF0000"
          strokeWidth={3}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navbar: {
    height: 56,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E6E6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  title: { fontSize: 18, fontWeight: "600" },
  map: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
