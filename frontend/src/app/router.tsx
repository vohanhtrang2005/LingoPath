import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { CreateStudyPlanPage } from "../features/study-plan/CreateStudyPlanPage";
import { CurrentPlanPage } from "../features/study-plan/CurrentPlanPage";
import { LessonListPage } from "../features/lesson/LessonListPage";
import { LessonDetailPage } from "../features/lesson/LessonDetailPage";
import { KnowledgeItemListPage } from "../features/content/KnowledgeItemListPage";
import { AdminBooksPage } from "../features/admin/pages/AdminBooksPage";
import { AdminBookDocumentsPage } from "../features/admin/pages/AdminBookDocumentsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "plans/new", element: <CreateStudyPlanPage /> },
      { path: "plans/current", element: <CurrentPlanPage /> },
      { path: "lessons", element: <LessonListPage /> },
      { path: "lessons/:lessonId", element: <LessonDetailPage /> },
      { path: "knowledge", element: <KnowledgeItemListPage /> },
      { path: "admin/books", element: <AdminBooksPage /> },
      { path: "admin/books/:bookId/documents", element: <AdminBookDocumentsPage /> }
    ]
  }
]);
