export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Valentin',
    email: 'valentin@guarddrive.fr',
    password: 'password123',
  },
  {
    id: '2',
    name: 'Marie-Thérèse',
    email: 'marie@guarddrive.fr',
    password: 'password123',
  },
];
