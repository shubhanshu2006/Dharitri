"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import maplibregl from "maplibre-gl";
import { useProjects } from "@/hooks/useProjects";
import { useProjectBoundary, useProjectParcels } from "@/hooks/useGIS";
import { Map } from "@/components/gis/Map";
import { ProjectLayer } from "@/components/gis/ProjectLayer";
import { ParcelPopup } from "@/components/gis/ParcelPopup";
import { MapLegend } from "@/components/gis/MapLegend";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  Alert,
} from "@/components/ui";
import { Map as MapIcon, Layers, X } from "lucide-react";

function GISPageContent() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("project");

  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(
    projectIdFromUrl || undefined
  );
  const [selectedParcel, setSelectedParcel] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Fetch projects list
  const { data: projectsData } = useProjects({ limit: 100 });
  const projects = projectsData?.data || [];

  // Fetch selected project boundary and parcels
  const { data: boundary, isLoading: boundaryLoading } =
    useProjectBoundary(selectedProjectId);
  const { data: parcels, isLoading: parcelsLoading } =
    useProjectParcels(selectedProjectId);

  const handleMapLoad = useCallback((mapInstance: maplibregl.Map) => {
    setMap(mapInstance);
  }, []);

  const handleParcelClick = useCallback((parcelId: string, properties: any) => {
    setSelectedParcel({
      id: parcelId,
      ...properties,
    });
  }, []);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedParcel(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 shrink-0 space-y-4 overflow-y-auto">
          {/* Header */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapIcon className="w-5 h-5 text-emerald-600" />
                  GIS & Maps
                </CardTitle>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1 hover:bg-paper-dim rounded transition-colors"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              </div>
            </CardHeader>
          </Card>

          {/* Project Selector */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Select Project</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedProjectId || ""}
                onChange={(e) => handleProjectSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-paper-line bg-white text-text focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
              >
                <option value="">Select a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.code})
                  </option>
                ))}
              </select>

              {selectedProjectId && (boundaryLoading || parcelsLoading) && (
                <div className="mt-3">
                  <Loading text="Loading project data..." size="sm" />
                </div>
              )}

              {selectedProjectId && !boundary && !boundaryLoading && (
                <Alert variant="warning" className="mt-3">
                  No boundary data available for this project.
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Project Info */}
          {selectedProjectId && boundary && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-base">Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Boundary Features</span>
                  <span className="font-medium text-text">
                    {boundary.features?.length || 0}
                  </span>
                </div>
                {parcels && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Total Parcels</span>
                    <span className="font-medium text-text">
                      {parcels.features?.length || 0}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Selected Parcel Details */}
          {selectedParcel && (
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Selected Parcel</CardTitle>
                  <button
                    onClick={() => setSelectedParcel(null)}
                    className="p-1 hover:bg-paper-dim rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-muted" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <ParcelPopup
                  parcel={selectedParcel}
                  onClose={() => setSelectedParcel(null)}
                />
              </CardContent>
            </Card>
          )}

          {/* Layer Controls */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Map Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-paper-line text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-text">Project Boundary</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-paper-line text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-text">Land Parcels</span>
              </label>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative rounded-xl overflow-hidden border border-paper-line">
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 z-10 p-2 bg-white rounded-lg shadow-lg border border-paper-line hover:bg-paper-dim transition-colors"
          >
            <Layers className="w-5 h-5 text-text" />
          </button>
        )}

        <Map onLoad={handleMapLoad} />

        {map && (
          <ProjectLayer
            map={map}
            boundary={boundary}
            parcels={parcels}
            onParcelClick={handleParcelClick}
          />
        )}

        <MapLegend />
      </div>
    </div>
  );
}

export default function GISPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loading text="Loading GIS..." size="lg" />
        </div>
      }
    >
      <GISPageContent />
    </Suspense>
  );
}
