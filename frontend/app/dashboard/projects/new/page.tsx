"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProject } from "@/hooks/useProjects";
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
} from "@/components/ui";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

// Validation schema
const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  code: z.string().min(3, "Project code must be at least 3 characters"),
  description: z.string().optional(),
  type: z.nativeEnum(ProjectType),
  ministry: z.string().optional(),
  implementingAgency: z.string().min(1, "Implementing agency is required"),
  totalLandRequirement: z.coerce
    .number()
    .positive("Must be a positive number")
    .optional(),
  landRequirementUnit: z.nativeEnum(LandRequirementUnit).optional(),
  estimatedCost: z.coerce.number().positive("Must be a positive number").optional(),
  expectedStartDate: z.string().optional(),
  expectedCompletionDate: z.string().optional(),
  stateId: z.string().optional(),
  districtId: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      type: ProjectType.HIGHWAY,
      landRequirementUnit: LandRequirementUnit.HECTARE,
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const result = await createProject.mutateAsync(data);
      router.push(`/dashboard/projects/${result.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Projects
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-instrument-sans)] mt-4">
          Create New Project
        </h1>
        <p className="text-muted mt-1">
          Enter project details to initiate land acquisition process
        </p>
      </div>

      {/* Error Alert */}
      {createProject.isError && (
        <Alert variant="danger" dismissible onDismiss={() => createProject.reset()}>
          Failed to create project. Please check your inputs and try again.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the core details of the project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Name"
                placeholder="NH-48 Highway Expansion"
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <Input
                label="Project Code"
                placeholder="PRJ-2024-001"
                error={errors.code?.message}
                required
                {...register("code")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Detailed project description..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-paper-line bg-white text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                {...register("description")}
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-clay-500">
                  {errors.description.message}
                </p>
              )}
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
                {errors.type && (
                  <p className="mt-1.5 text-sm text-clay-500">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <Input
                label="Ministry/Department"
                placeholder="Ministry of Road Transport"
                error={errors.ministry?.message}
                {...register("ministry")}
              />
            </div>

            <Input
              label="Implementing Agency"
              placeholder="National Highways Authority of India"
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
            <CardDescription>
              Specify the land required for this project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Total Land Required"
                type="number"
                step="0.01"
                placeholder="150.5"
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
              placeholder="50000000"
              helperText="Enter estimated project cost in rupees"
              error={errors.estimatedCost?.message}
              {...register("estimatedCost")}
            />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
            <CardDescription>Expected start and completion dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Expected Start Date"
                type="date"
                error={errors.expectedStartDate?.message}
                {...register("expectedStartDate")}
              />

              <Input
                label="Expected Completion Date"
                type="date"
                error={errors.expectedCompletionDate?.message}
                {...register("expectedCompletionDate")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard/projects">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            loading={createProject.isPending}
            icon={<Save className="w-4 h-4" />}
          >
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
}
