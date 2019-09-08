import axios from "axios";
export default async (): Promise<string> => {
  const { data } = await axios("https://example.com/v1/me");
  return data.age === undefined
    ? "Please enter your age."
    : `You are ${data.age} years old.`;
};
