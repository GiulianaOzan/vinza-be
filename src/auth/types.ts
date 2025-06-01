export type RegisterDto = {
  name: string;
  age: number;
  email: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type JwtAuthPayload = {
  user: number;
  role: number;
};
