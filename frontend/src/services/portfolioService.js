import axios from "axios";

const API = "http://localhost:8000/api/portfolios/";

export const getPortfolios = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getPortfoliosDestaque = async () => {
  const res = await axios.get(`${API}?destaque=true`);
  return res.data;
};