export type User = {
  id: string;
  idealWeight: number;
  height: number;
};

export type Measurement = {
  id: string;
  userId: string;
  date: string; // date ISO
  weight: number;
  chest: number;
  belly: number;
  thigh: number;
};
