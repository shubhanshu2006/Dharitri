"use client";

import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent, ErrorMessage, LoadingTable } from "@/components/ui";
import { Brain, ArrowRight } from "lucide-react";

export default function AIInsightsIndexPage() {
  const { data, isLoading, error } = useProjects({ limit: 25 });

  if (isLoading) {
    return <LoadingTable rows={6} />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load AI insights"
        message="Unable to fetch projects for AI analysis. Please try again."
      />
    );
  }

  const projects = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold text-text">
          <Brain className="h-8 w-8 text-emerald-600" />
          AI Insights
        </h1>
        <p className="mt-1 text-muted">
          Select a project to view risk analysis and anomaly detection.
        </p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="font-semibold text-text">No projects available</p>
            <p className="mt-1 text-sm text-muted">
              Create a project before opening AI insights.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/ai/${project.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <h2 className="font-semibold text-text">{project.name}</h2>
                    <p className="mt-1 text-sm text-muted">{project.code}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
