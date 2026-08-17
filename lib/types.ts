export interface Collection {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface Snippet {
  id: number;
  title: string;
  code: string;
  language: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
  collection?: Collection;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
}
