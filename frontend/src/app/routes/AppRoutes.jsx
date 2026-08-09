import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import News from "../../pages/News/News";
import AnalyzedNews from "../../pages/AnalyzedNews/AnalyzedNews";
import Analyze from "../../pages/Analyze/Analyze";

export default function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/news" replace />}
      />

      <Route
        path="/news"
        element={
          <MainLayout>
            <News />
          </MainLayout>
        }
      />

      <Route
        path="/analyzed"
        element={
          <MainLayout>
            <AnalyzedNews />
          </MainLayout>
        }
      />

      <Route
        path="/analyze"
        element={
          <MainLayout>
            <Analyze />
          </MainLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <DashboardPlaceholder />
          </MainLayout>
        }
      />

    </Routes>
  );
}

function DashboardPlaceholder() {
  return (
    <div className="py-12 md:py-16">
      <div
        className="mx-auto w-[calc(100%-48px)]"
        style={{ maxWidth: "1280px" }}
      >
        <h1 className="text-3xl font-semibold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Statistics will be displayed here.
        </p>
      </div>
    </div>
  );
}