"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProject } from "@/hooks/useProjects";
import { useNextProjectCode } from "@/hooks/useProjectCode";
import { useStates, useDistricts } from "@/hooks/useLocations";
import { useEffect } from "react";
import {
  ProjectType,
  PROJECT_TYPE_LABELS,
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
import { toast } from "sonner";

// Validation schema - matches backend exactly
const projectSchema = z.object({
  projectCode: z.string().min(1, "Project code is required"),
  name: z.string().min(1, "Project name is required").max(240),
  projectType: z.nativeEnum(ProjectType),
  description: z.string().optional(),
  implementingAgencyId: z.string().uuid().optional().or(z.literal("")),
  ministryId: z.string().uuid().optional().or(z.literal("")),
  stateId: z.string().min(1, "State is required"),
  districtId: z.string().optional(),
  // Land requirement
  requiredAreaHectares: z.coerce.number().positive("Required area must be greater than 0"),
  // Alignment coordinates (optional)
  alignmentStartLat: z.coerce.number().min(-90).max(90).optional(),
  alignmentStartLng: z.coerce.number().min(-180).max(180).optional(),
  alignmentEndLat: z.coerce.number().min(-90).max(90).optional(),
  alignmentEndLng: z.coerce.number().min(-180).max(180).optional(),
  corridorWidthMeters: z.coerce.number().int().positive().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();
  const { suggestedCode, lastCode, loading: codeLoading } = useNextProjectCode();
  const { data: states } = useStates();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectType: ProjectType.HIGHWAY,
    },
  });

  const projectCode = useWatch({ control, name: "projectCode" });
  const selectedStateId = useWatch({ control, name: "stateId" });
  
  // Fetch districts only when state is selected
  const { data: districts } = useDistricts(selectedStateId);

  // Auto-fill the suggested project code when available
  useEffect(() => {
    if (suggestedCode && !projectCode) {
      setValue("projectCode", suggestedCode);
    }
  }, [suggestedCode, projectCode, setValue]);

  // Reset district when state changes
  useEffect(() => {
    setValue("districtId", "");
  }, [selectedStateId, setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const payload = {
        ...data,
        districtId: data.districtId || undefined,
        ministryId: data.ministryId && data.ministryId.trim() !== "" ? data.ministryId : undefined,
        implementingAgencyId: data.implementingAgencyId && data.implementingAgencyId.trim() !== "" ? data.implementingAgencyId : undefined,
        // Convert hectares to square meters for API
        requiredAreaSqMeters: data.requiredAreaHectares * 10000,
      };
      // Remove requiredAreaHectares from payload as API expects requiredAreaSqMeters
      delete (payload as any).requiredAreaHectares;
      
      const result = await createProject.mutateAsync(payload);
      toast.success(`Project ${result.projectCode || "created"} initiated successfully`);
      router.push(`/dashboard/projects/${result.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project. Please verify inputs.");
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
        <h1 className="text-3xl font-bold text-text mt-4">
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

              <div>
                <Input
                  label="Project Code"
                  placeholder={codeLoading ? "Loading..." : "PRJ-2026-001"}
                  error={errors.projectCode?.message}
                  required
                  disabled={codeLoading}
                  {...register("projectCode")}
                />
                {suggestedCode && !codeLoading && (
                  <p className="mt-1.5 text-sm text-emerald-600 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-emerald-600 rounded-full"></span>
                    Suggested: <span className="font-medium">{suggestedCode}</span>
                    {lastCode && (
                      <span className="text-muted ml-2">(Last: {lastCode})</span>
                    )}
                  </p>
                )}
                {codeLoading && (
                  <p className="mt-1.5 text-sm text-muted">
                    Generating suggested code...
                  </p>
                )}
              </div>
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
                  {...register("projectType")}
                >
                  {Object.entries(PROJECT_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.projectType && (
                  <p className="mt-1.5 text-sm text-clay-500">
                    {errors.projectType.message}
                  </p>
                )}
              </div>

              <Input
                label="Ministry/Department"
                placeholder="e.g., Ministry of Road Transport"
                helperText="Optional text field"
                error={errors.ministryId?.message}
                {...register("ministryId")}
              />
            </div>

            <Input
              label="Implementing Agency"
              placeholder="e.g., National Highways Authority of India"
              helperText="Optional text field"
              error={errors.implementingAgencyId?.message}
              {...register("implementingAgencyId")}
            />

            <div>
              <Input
                label="Required Land Area"
                type="number"
                step="0.01"
                placeholder="100"
                helperText="Total land area required in hectares"
                error={errors.requiredAreaHectares?.message}
                required
                {...register("requiredAreaHectares")}
              />
              <span className="text-xs text-gray-500 ml-2">hectares</span>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Project Location</CardTitle>
            <CardDescription>
              Select the state and district for this project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  State <span className="text-clay-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-paper-line bg-white text-text focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  {...register("stateId")}
                >
                  <option value="">Select state...</option>
                  {states?.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.stateId && (
                  <p className="mt-1.5 text-sm text-clay-500">
                    {errors.stateId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  District
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-paper-line bg-white text-text focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
                  disabled={!selectedStateId}
                  {...register("districtId")}
                >
                  <option value="">
                    {!selectedStateId ? "Select state first" : "Select district..."}
                  </option>
                  {districts?.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.districtId && (
                  <p className="mt-1.5 text-sm text-clay-500">
                    {errors.districtId.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Alignment (Optional) */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Project Alignment (Optional)</CardTitle>
            <CardDescription>
              Provide reference coordinates to guide boundary drawing in GIS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="info">
              <p className="text-sm">
                These coordinates will be displayed as reference points when drawing the project boundary on the map.
              </p>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Latitude"
                type="number"
                step="0.000001"
                placeholder="28.6139"
                helperText="e.g., 28.6139 (Decimal degrees)"
                error={errors.alignmentStartLat?.message}
                {...register("alignmentStartLat")}
              />

              <Input
                label="Start Longitude"
                type="number"
                step="0.000001"
                placeholder="77.2090"
                helperText="e.g., 77.2090 (Decimal degrees)"
                error={errors.alignmentStartLng?.message}
                {...register("alignmentStartLng")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="End Latitude"
                type="number"
                step="0.000001"
                placeholder="28.9845"
                helperText="e.g., 28.9845"
                error={errors.alignmentEndLat?.message}
                {...register("alignmentEndLat")}
              />

              <Input
                label="End Longitude"
                type="number"
                step="0.000001"
                placeholder="77.7064"
                helperText="e.g., 77.7064"
                error={errors.alignmentEndLng?.message}
                {...register("alignmentEndLng")}
              />
            </div>

            <Input
              label="Corridor Width"
              type="number"
              placeholder="45"
              helperText="Width of the corridor in meters"
              error={errors.corridorWidthMeters?.message}
              {...register("corridorWidthMeters")}
            />
            <span className="text-xs text-gray-500 ml-2">meters</span>
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
