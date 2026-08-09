import api from "./api";

export async function analyzeText(text) {
  const response = await api.post("/ml/analyze", {
    text,
  });

  return response.data;
}