export type CreateStudyPlanRequest = {
  targetLanguage: string;
  targetLevelSystem: string;
  targetLevelCode: string;
  durationMonths: number;
  startDate?: string;
  examDate?: string;
  currentLevelNote?: string;
  weaknessNote?: string;
};

export type StudyPlan = {
  id: string;
  userId: string;
  learningProfileId: string;
  status: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  targetLanguage: string;
  targetLevelSystem: string;
  targetLevelCode: string;
};

export type DailyLesson = {
  id: string;
  studyPlanId: string;
  lessonDate: string;
  dayIndex: number;
  lessonType: string;
  status: string;
  sections: DailySection[];
};

export type DailySection = {
  id: string;
  type: string;
  orderIndex: number;
  title: string;
  status: string;
  items: DailyLearningItem[];
};

export type DailyLearningItem = {
  id: string;
  itemType: string;
  itemId: string;
  assignmentType: string;
  orderIndex: number;
  status: string;
};
