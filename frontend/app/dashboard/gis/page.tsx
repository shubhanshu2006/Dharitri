"use client";

import { useState, useCallback, Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import maplibregl from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
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
        "#fbb03b",
        "#3bb2d0",
      ],
      "fill-opacity": 0.1,
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
        "#fbb03b",
        "#3bb2d0",
      ],
      "line-width": 2,
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
        "#fbb03b",
        "#3bb2d0",
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
    paint: { "circle-radius": 5, "circle-color": "#fbb03b" },
  },
  {
    id: "gl-draw-midpoint",
    type: "circle",
    filter: ["all", ["==", "meta", "midpoint"]],
    paint: { "circle-radius": 3, "circle-color": "#fbb03b" },
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
    } catch (error) {
      window.alert(
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

    await uploadBoundary.mutateAsync({
      geometry: drawnBoundary,
      sourceType: "MAP_DRAWING",
    });
    setDrawnBoundary(undefined);
    drawControl.current?.deleteAll();
  };

  const handleDeleteBoundary = async () => {
    if (!selectedProjectId) return;
    if (!window.confirm("Delete this project's saved boundary?")) return;
    await deleteBoundary.mutateAsync();
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
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to generate boundary from coordinates'
      );
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Coordinate Entry Modal */}
      {showCoordinateEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
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
                    {project.name} ({project.projectCode || project.code || "No code"})
                  </option>
                ))}
              </select>

              {selectedProjectId && !hasBoundary && (
                <button
                  type="button"
                  onClick={() => drawControl.current?.changeMode("draw_polygon")}
                  disabled={!map || uploadBoundary.isPending}
                  className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Draw boundary on map
                </button>
              )}

              {selectedProjectId && (boundaryLoading || parcelsLoading) && (
                <div className="mt-3">
                  <Loading text="Loading project data..." size="sm" />
                </div>
              )}

              {selectedProjectId && !hasBoundary && !boundaryLoading && (
                <div className="mt-3 space-y-3">
                  <Alert variant="warning">
                    No boundary data available for this project.
                  </Alert>
                  <label className="block cursor-pointer rounded-lg border border-dashed border-emerald-300 bg-emerald-50 px-3 py-3 text-center text-sm font-medium text-emerald-700 hover:bg-emerald-100">
                    {uploadBoundary.isPending
                      ? "Uploading boundary..."
                      : "Upload GeoJSON boundary"}
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
                    className="w-full rounded-lg border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Enter Coordinates
                  </button>
                </div>
              )}

              {selectedProjectId && drawnBoundary && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-emerald-700">
                    Boundary drawn. Save it to this project.
                  </p>
                  <button
                    type="button"
                    onClick={handleSaveDrawnBoundary}
                    disabled={uploadBoundary.isPending}
                    className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {uploadBoundary.isPending
                      ? "Saving boundary..."
                      : "Save drawn boundary"}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Info */}
          {selectedProjectId && hasBoundary && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-base">Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Boundary Features</span>
                  <span className="font-medium text-text">
                    {boundary?.features?.length || 0}
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
                <button
                  type="button"
                  onClick={handleDeleteBoundary}
                  disabled={deleteBoundary.isPending}
                  className="mt-3 w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  {deleteBoundary.isPending
                    ? "Deleting boundary..."
                    : "Delete saved boundary"}
                </button>
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
