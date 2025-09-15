export type Place = {
  id: string;
  time: string;
  name: string;
  type: "place" | "move";
  latitude: number;
  longitude: number;
  image?: string;
};