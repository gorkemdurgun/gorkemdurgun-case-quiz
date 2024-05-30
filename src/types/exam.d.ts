type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Question = {
  id: number;
  title: string;
  options: string[];
  answer?: number;
};
