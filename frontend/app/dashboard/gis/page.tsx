"use client";

import { useState, useCallback, Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import maplibregl from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { toast } from "sonner";
import { useProjects } from "@/hooks/useProjects";
import {
  useProjectBoundary,
  useProjectParcels,
  useUploadProjectBoundary,
  useDeleteProjectBoundary,
} from "@/hooks/useGIS";
import { Map } from "@/components/gis/Map";
import { ProjectLayer } from "@/components/gis/ProjectLayer";
import { ParcelPopup } from "@/components/gis/ParcelPopup";
import { MapLegend } from "@/components/gis/MapLegend";
import { CoordinateEntryForm } from "@/components/gis/CoordinateEntryForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  Alert,
  ConfirmModal,
} from "@/components/ui";
import { Map as MapIcon, Layers, X, Navigation } from "lucide-react";

type BoundaryGeometry = {
  type: "Polygon" | "MultiPolygon";
  coordinates: any;
};

const DRAW_STYLES = [
  {
    id: "gl-draw-polygon-fill",
    type: "fill",
    filter: ["all", ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": [
        "case",
        ["==", ["get", "active"], "true"],
        "#f59e0b",
        "#10b981",
      ],
      "fill-opacity": 0.15,
    },
  },
  {
    id: "gl-draw-lines",
    type: "line",
    filter: [
      "any",
      ["==", "$type", "LineString"],
      ["==", "$type", "Polygon"],
    ],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": [
        "case",
        ["==", ["get", "active"], "true"],
        "#f59e0b",
        "#10b981",
      ],
      "line-width": 2.5,
    },
  },
  {
    id: "gl-draw-point-outer",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "feature"]],
    paint: { "circle-radius": 7, "circle-color": "#fff" },
  },
  {
    id: "gl-draw-point-inner",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "feature"]],
    paint: {
      "circle-radius": 5,
      "circle-color": [
        "case",
        ["==", ["get", "active"], "true"],
        "#f59e0b",
        "#10b981",
      ],
    },
  },
  {
    id: "gl-draw-vertex-outer",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "meta", "vertex"],
      ["!=", "mode", "simple_select"],
    ],
    paint: { "circle-radius": 7, "circle-color": "#fff" },
  },
  {
    id: "gl-draw-vertex-inner",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "meta", "vertex"],
      ["!=", "mode", "simple_select"],
    ],
    paint: { "circle-radius": 5, "circle-color": "#f59e0b" },
  },
  {
    id: "gl-draw-midpoint",
    type: "circle",
    filter: ["all", ["==", "meta", "midpoint"]],
    paint: { "circle-radius": 3, "circle-color": "#f59e0b" },
  },
];

function GISPageContent() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("project");

  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(
    projectIdFromUrl || undefined
  );
  const [selectedParcel, setSelectedParcel] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCoordinateEntry, setShowCoordinateEntry] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [drawnBoundary, setDrawnBoundary] = useState<
    BoundaryGeometry | undefined
  >();
  const drawControl = useRef<MapboxDraw | null>(null);
  const uploadBoundary = useUploadProjectBoundary(selectedProjectId || "");
  const deleteBoundary = useDeleteProjectBoundary(selectedProjectId || "");

  useEffect(() => {
    if (!map || drawControl.current) return;

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      styles: DRAW_STYLES as any,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    map.addControl(draw as any, "top-left");
    drawControl.current = draw;

    const updateDrawnBoundary = () => {
      const feature = draw.getAll().features[0];
      const geometry = feature?.geometry;
      setDrawnBoundary(
        geometry?.type === "Polygon" || geometry?.type === "MultiPolygon"
          ? geometry
          : undefined,
      );
    };

    map.on("draw.create", updateDrawnBoundary);
    map.on("draw.update", updateDrawnBoundary);
    map.on("draw.delete", () => setDrawnBoundary(undefined));
  }, [map]);

  // Fetch projects list
  const { data: projectsData } = useProjects({ limit: 100 });
  const projects = projectsData?.data || [];

  // Fetch selected project boundary and parcels
  const { data: boundary, isLoading: boundaryLoading } =
    useProjectBoundary(selectedProjectId);
  const { data: parcels, isLoading: parcelsLoading } =
    useProjectParcels(selectedProjectId);
  const hasBoundary = Boolean(boundary?.features?.length);

  const handleMapLoad = useCallback((mapInstance: maplibregl.Map) => {
    setMap(mapInstance);
  }, []);

  const handleParcelClick = useCallback(async (parcelId: string, properties: any) => {
    try {
      // Fetch full parcel details including owner info
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gis/parcels/${parcelId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (response.ok) {
        const result = await response.json();
        setSelectedParcel(result.data);
      } else {
        // Fallback to properties if API fails
        setSelectedParcel({
          id: parcelId,
          ...properties,
        });
      }
    } catch (error) {
      console.error('Failed to fetch parcel details:', error);
      setSelectedParcel({
        id: parcelId,
        ...properties,
      });
    }
  }, []);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedParcel(null);
  };

  const handleBoundaryUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !selectedProjectId) return;

    try {
      const geojson = JSON.parse(await file.text());
      const feature = geojson.features?.[0];
      const geometry = feature?.geometry || geojson.geometry;

      if (
        !geometry ||
        (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon")
      ) {
        throw new Error("The GeoJSON file must contain a Polygon or MultiPolygon.");
      }

      await uploadBoundary.mutateAsync({
        geometry,
        sourceType: "GEOJSON_UPLOAD",
      });
      toast.success("Project boundary GeoJSON uploaded successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload boundary GeoJSON.",
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleSaveDrawnBoundary = async () => {
    if (!selectedProjectId || !drawnBoundary) return;

    try {
      await uploadBoundary.mutateAsync({
        geometry: drawnBoundary,
        sourceType: "MAP_DRAWING",
      });
      toast.success("Drawn boundary saved to project");
      setDrawnBoundary(undefined);
      drawControl.current?.deleteAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save boundary");
    }
  };

  const handleDeleteBoundary = () => {
    if (!selectedProjectId) return;
    setShowDeleteConfirm(true);
  };

  const handleConfirmDeleteBoundary = async () => {
    if (!selectedProjectId) return;
    try {
      await deleteBoundary.mutateAsync();
      toast.success("Project boundary deleted successfully");
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete boundary");
    }
  };

  const handleCoordinateGenerate = async (coordinates: Array<{ lat: number; lng: number }>) => {
    if (!selectedProjectId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gis/projects/${selectedProjectId}/boundary/from-coordinates`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await (window as any).Clerk?.session?.getToken()}`,
          },
          body: JSON.stringify({ coordinates }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate boundary from coordinates');
      }

      setShowCoordinateEntry(false);
      // Refresh boundary data
      await uploadBoundary.mutateAsync({
        geometry: (await response.json()).data.geometry,
        sourceType: 'MANUAL_COORDINATE_ENTRY',
      });
      toast.success("Boundary generated successfully from coordinates");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to generate boundary from coordinates'
      );
    }
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] gap-4 font-sans">
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDeleteBoundary}
        title="Delete Project Boundary"
        description="Are you sure you want to delete this project's boundary? All associated GIS boundary layers and parcel markers will be reset."
        variant="danger"
        confirmText="Delete Boundary"
        isLoading={deleteBoundary.isPending}
      />

      {/* Coordinate Entry Modal */}
      {showCoordinateEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4">
          <div className="max-w-2xl w-full">
            <CoordinateEntryForm
              onGenerate={handleCoordinateGenerate}
              onCancel={() => setShowCoordinateEntry(false)}
            />
          </div>
        </div>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <div className="w-84 shrink-0 space-y-3.5 overflow-y-auto pr-1">
          {/* Header */}
          <div className="bg-white rounded-2xl p-4 border border-paper-line/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80">
                  <MapIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text tracking-tight">GIS Demarcation</h2>
                  <p className="text-[11px] text-muted">Boundary ingestion & cadastral parcels</p>
                </div>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1.5 hover:bg-paper-dim rounded-lg transition-colors text-muted hover:text-text"
                title="Collapse sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Project Selector & Actions */}
          <div className="bg-white rounded-2xl p-4 border border-paper-line/80 shadow-xs space-y-3.5">
            <div>
              <label htmlFor="gis-project-select" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Target Project
              </label>
              <select
                id="gis-project-select"
                value={selectedProjectId || ""}
                onChange={(e) => handleProjectSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-paper-line bg-paper/50 hover:bg-paper focus:bg-white text-text font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 transition-all"
              >
                <option value="">Select a project to inspect...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.projectCode || project.code || "No code"})
                  </option>
                ))}
              </select>
            </div>

            {selectedProjectId && (boundaryLoading || parcelsLoading) && (
              <div className="py-3">
                <Loading text="Retrieving telemetry layers..." size="sm" />
              </div>
            )}

            {selectedProjectId && !hasBoundary && !boundaryLoading && (
              <div className="space-y-2.5 pt-1 border-t border-paper-line/70">
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                  <p className="font-semibold text-amber-900 mb-0.5">Demarcation Required</p>
                  Choose an ingestion mode below to define the statutory boundary corridor.
                </div>

                <button
                  type="button"
                  onClick={() => drawControl.current?.changeMode("draw_polygon")}
                  disabled={!map || uploadBoundary.isPending}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  Draw Polygon on Map
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <label className="cursor-pointer py-2.5 px-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 text-center text-xs font-semibold text-emerald-800 transition-colors flex items-center justify-center">
                    {uploadBoundary.isPending ? "Uploading..." : "Upload GeoJSON"}
                    <input
                      type="file"
                      accept=".geojson,application/geo+json,application/json"
                      className="sr-only"
                      disabled={uploadBoundary.isPending}
                      onChange={handleBoundaryUpload}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowCoordinateEntry(true)}
                    className="py-2.5 px-2 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50/50 text-xs font-semibold text-emerald-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                    Coordinates
                  </button>
                </div>
              </div>
            )}

            {selectedProjectId && drawnBoundary && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2.5">
                <p className="text-xs font-semibold text-emerald-900">
                  Polygon Boundary Drawn ({drawnBoundary.coordinates?.[0]?.length || 0} vertices)
                </p>
                <button
                  type="button"
                  onClick={handleSaveDrawnBoundary}
                  disabled={uploadBoundary.isPending}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
                >
                  {uploadBoundary.isPending ? "Persisting..." : "Commit Boundary to Project"}
                </button>
              </div>
            )}
          </div>

          {/* Project Boundary Info */}
          {selectedProjectId && hasBoundary && (
            <div className="bg-white rounded-2xl p-4 border border-paper-line/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-paper-line/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Corridor Telemetry</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Active
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-paper/50">
                  <span className="text-muted">Boundary Geometries</span>
                  <span className="font-bold text-text font-mono">
                    {boundary?.features?.length || 0}
                  </span>
                </div>
                {parcels && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-paper/50">
                    <span className="text-muted">Demarcated Parcels</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {parcels.features?.length || 0}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleDeleteBoundary}
                  disabled={deleteBoundary.isPending}
                  className="mt-1 w-full rounded-xl border border-red-200/80 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Delete Demarcated Boundary
                </button>
              </div>
            </div>
          )}

          {/* Selected Parcel Popup in Sidebar */}
          {selectedParcel && (
            <div className="bg-white rounded-2xl p-4 border border-paper-line/80 shadow-md">
              <ParcelPopup
                parcel={selectedParcel}
                onClose={() => setSelectedParcel(null)}
              />
            </div>
          )}

          {/* Map Layer Toggles */}
          <div className="bg-white rounded-2xl p-4 border border-paper-line/80 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-2">
              <Layers className="w-3.5 h-3.5" />
              Layer Visibility
            </h3>
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-paper/60 cursor-pointer transition-colors">
              <span className="text-xs font-medium text-text">Corridor Boundary</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-paper-line text-emerald-600 focus:ring-emerald-500"
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-paper/60 cursor-pointer transition-colors">
              <span className="text-xs font-medium text-text">Cadastral Parcels</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-paper-line text-emerald-600 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-paper-line/80 shadow-inner bg-paper/40">
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 z-10 p-2.5 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-paper-line hover:bg-paper transition-all"
            title="Expand Controls"
          >
            <Layers className="w-4 h-4 text-text" />
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
