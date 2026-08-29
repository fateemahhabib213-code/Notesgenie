import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const client = axios.create({
  baseURL: BASE_URL,
});

function extractErrorMessage(error) {
  return (
    error.response?.data?.detail ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await client.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function askQuestion(question) {
  try {
    const { data } = await client.post("/ask", { question });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
