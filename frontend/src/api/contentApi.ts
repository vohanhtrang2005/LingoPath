import { http } from "./http";

export const contentApi = {
  getKnowledge: (params: {
    language: string;
    levelSystem: string;
    levelCode: string;
    type?: string;
  }) => http.get("/content/knowledge", { params })
};
