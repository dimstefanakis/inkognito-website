export interface Confession {
  id: string;
  text: string;
  gender: 'male' | 'female';
  latitude: number;
  longitude: number;
}

export const mockConfessions: Confession[] = [
  {
    id: '1',
    text: "I've been pretending to be a coffee expert, but I can't tell the difference between espresso and regular coffee.",
    gender: 'female',
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: '2',
    text: "I secretly love pineapple on pizza, but I always order without it when I'm with friends.",
    gender: 'male',
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    id: '3',
    text: "I've been using the same password for everything since high school, and I'm too lazy to change it.",
    gender: 'female',
    latitude: 51.5074,
    longitude: -0.1278,
  },
];
