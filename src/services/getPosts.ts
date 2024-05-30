import Axios from "../utils/Axios";

export const getPosts = async () => {
  try {
    const response = await Axios.get<Post[]>("/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching questions", error);
    return [];
  }
};
