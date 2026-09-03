export type KnowledgeItem = {
  id: string;
  language: string;
  levelSystem: string;
  levelCode: string;
  type: string;
  status: string;
  origin?: string;
  confidence?: number;
  contentJson: Record<string, unknown>;
  orderIndex?: number;
  difficulty?: string;
};
