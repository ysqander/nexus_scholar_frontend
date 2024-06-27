import axios from 'axios';

const API_URL = 'http://localhost:8000';  // Update this with your backend URL

export const fetchPapers = async () => {
  const response = await axios.get(`${API_URL}/papers`);
  return response.data;
};

export const analyzePaper = async (paperId) => {
  const response = await axios.post(`${API_URL}/papers/${paperId}/analyze`);
  return response.data;
};

// Add more API calls as needed
