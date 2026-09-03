import { http } from "./http";
import type { CreateStudyPlanRequest } from "../types/learning";

export const learningApi = {
  createPlan: (request: CreateStudyPlanRequest) => http.post("/learning/plans", request),
  getCurrentPlan: () => http.get("/learning/plans/current"),
  getPlanLessons: (planId: string) => http.get(`/learning/plans/${planId}/lessons`),
  getLesson: (lessonId: string) => http.get(`/learning/lessons/${lessonId}`)
};
