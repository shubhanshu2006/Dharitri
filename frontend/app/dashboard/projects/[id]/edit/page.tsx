"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import {
  ProjectType,
  PROJECT_TYPE_LABELS,
  LandRequirementUnit,
  LAND_UNIT_LABELS,
} from "@/lib/constants/projects";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Alert,
  Loading,
  ErrorMessage,
} from "@/components/ui";
import { ArrowLeft, Save } from "lucide-react";

// Validation schema
const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().optional(),
  type: z.nativeEnum(ProjectType),
  ministry: z.string().optional(),
  implementingAgency: z.string().min(1, "Implementing agency is required"),
  totalLandRequirement: z.coerce
    .number()
    .positive("Must be a positive number")
    .optional()
    .nullable(),
  landRequirementUnit: z.nativeEnum(LandRequirementUnit).optional(),
  estimatedCost: z.coerce
    .number()
    .positive("Must be a positive number")
    .optional()
    .nullable(),
  expectedStartDate: z.string().optional(),
  expectedCompletionDate: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: project, isLoading, error } = useProject(id);
  const updateProject = useUpdateProject(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description || "",
        type: (project.type as ProjectType) || ProjectType.HIGHWAY,
        ministry: project.ministry || "",
        implementingAgency: project.implementingAgency || "",
        totalLandRequirement: project.totalLandRequirement || undefined,
        landRequirementUnit:
          (project.landRequirementUnit as LandRequirementUnit) ||
          LandRequirementUnit.HECTARE,
        estimatedCost: project.estimatedCost || undefined,
        expectedStartDate: project.expectedStartDate
          ? project.expectedStartDate.split("T")[0]
          : "",
        expectedCompletionDate: project.expectedCompletionDate
          ? project.expectedCompletionDate.split("T")[0]
          : "",
      });
    }
  }, [project, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      // Clean up the data - remove empty strings and convert to undefined
      const cleanedData = {
        ...data,
        totalLandRequirement: data.totalLandRequirement || undefined,
        estimatedCost: data.estimatedCost || undefined,
      };
      await updateProject.mutateAsync(cleanedData);
      router.push(`/dashboard/projects/${id}`);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading text="Loading project..." size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Projects
          </Button>
        </Link>
        <ErrorMessage
          title="Project not found"
          message="The project you're trying to edit doesn't exist."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <Link href={`/dashboard/projects/${id}`}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Project
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)] mt-4">
          Edit Project
        </h1>
        <p className="text-muted mt-1">Update project details</p>
      </div>

      {/* Error Alert */}
      {updateProject.isError && (
        <Alert variant="danger" dismissible onDismiss={() => updateProject.reset()}>
          Failed to update project. Please check your inputs and try again.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update core project details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Project Name"
              error={errors.name?.message}
              required
              {...register("name")}
            />

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-paper-line bg-white text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Project Type <span className="text-clay-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-paper-line bg-white text-text focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  {...register("type")}
                >
                  {Object.entries(PROJECT_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Ministry/Department"
                {...register("ministry")}
              />
            </div>

            <Input
              label="Implementing Agency"
              error={errors.implementingAgency?.message}
              required
              {...register("implementingAgency")}
            />
          </CardContent>
        </Card>

        {/* Land Requirement */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Land Requirement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Total Land Required"
                type="number"
                step="0.01"
                error={errors.totalLandRequirement?.message}
                {...register("totalLandRequirement")}
              />

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Unit
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-paper-line bg-white text-text focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  {...register("landRequirementUnit")}
                >
                  {Object.entries(LAND_UNIT_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Estimated Cost (₹)"
              type="number"
              step="0.01"
              error={errors.estimatedCost?.message}
              {...register("estimatedCost")}
            />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Expected Start Date"
                type="date"
                {...register("expectedStartDate")}
              />

              <Input
                label="Expected Completion Date"
                type="date"
                {...register("expectedCompletionDate")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href={`/dashboard/projects/${id}`}>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            loading={updateProject.isPending}
            icon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
