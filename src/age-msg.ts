import axios from "axios";
export default async (id: number): Promise<string> => {
  const { data } = await axios("https://example.com/v1/user/" + id);
  return data.age === undefined
    ? `Please enter your age, ${data.name}.`
    : `Hi ${data.name}, you are ${data.age} years old.`;
};
