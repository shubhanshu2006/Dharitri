"use client";

import { useState } from "react";
import { Plus, Trash2, MapPin } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from "@/components/ui";

interface Coordinate {
  lat: number;
  lng: number;
}

interface CoordinateEntryFormProps {
  onGenerate: (coordinates: Coordinate[]) => void;
  onCancel: () => void;
}

export function CoordinateEntryForm({ onGenerate, onCancel }: CoordinateEntryFormProps) {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([
    { lat: 0, lng: 0 },
    { lat: 0, lng: 0 },
    { lat: 0, lng: 0 },
  ]);

  const addPoint = () => {
    setCoordinates([...coordinates, { lat: 0, lng: 0 }]);
  };

  const removePoint = (index: number) => {
    if (coordinates.length > 3) {
      setCoordinates(coordinates.filter((_, i) => i !== index));
    }
  };

  const updateCoordinate = (index: number, field: 'lat' | 'lng', value: string) => {
    const newCoords = [...coordinates];
    newCoords[index][field] = parseFloat(value) || 0;
    setCoordinates(newCoords);
  };

  const isValidPolygon = () => {
    return coordinates.length >= 3 && coordinates.every(c => c.lat !== 0 || c.lng !== 0);
  };

  const handleGenerate = () => {
    if (isValidPolygon()) {
      onGenerate(coordinates);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-paper-line overflow-hidden font-sans">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600" />
      <div className="p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-paper-line/70">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text tracking-tight">
              Enter Boundary Coordinates
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Input polygon vertex coordinates in decimal degrees format
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-5">
          {/* Instructions Card (Emerald instead of blue) */}
          <div className="text-xs text-emerald-950 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 space-y-1.5">
            <p className="font-semibold text-emerald-900 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Guidelines for Geodetic Coordinate Entry:
            </p>
            <ul className="list-disc list-inside text-emerald-800/90 space-y-1 pl-1">
              <li>Enter at least 3 vertex coordinates in clockwise or counter-clockwise order</li>
              <li>Standard decimal degrees format (e.g., Latitude: 28.6139, Longitude: 77.2090)</li>
              <li>The GIS engine will automatically enclose the polygon boundary upon generation</li>
            </ul>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {coordinates.map((coord, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 bg-paper/50 hover:bg-paper-dim/40 border border-paper-line/70 p-2.5 rounded-xl transition-colors"
              >
                <div className="flex items-center justify-center w-7 h-7 bg-emerald-100/80 text-emerald-800 rounded-lg font-semibold text-xs border border-emerald-200">
                  {index + 1}
                </div>

                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <label className="sr-only">Latitude {index + 1}</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={coord.lat || ""}
                      onChange={(e) => updateCoordinate(index, "lat", e.target.value)}
                      placeholder="Latitude (e.g. 28.6139)"
                      className="w-full px-3 py-2 border border-paper-line bg-white rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 transition-all placeholder:text-muted/60"
                    />
                  </div>
                  <div>
                    <label className="sr-only">Longitude {index + 1}</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={coord.lng || ""}
                      onChange={(e) => updateCoordinate(index, "lng", e.target.value)}
                      placeholder="Longitude (e.g. 77.2090)"
                      className="w-full px-3 py-2 border border-paper-line bg-white rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 transition-all placeholder:text-muted/60"
                    />
                  </div>
                </div>

                {coordinates.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removePoint(index)}
                    className="p-2 text-clay-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove point"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPoint}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-emerald-300 rounded-xl text-emerald-800 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-500 text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Vertex Point
          </button>

          {!isValidPolygon() && coordinates.length >= 3 && (
            <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2">
              <span>⚠️</span>
              <span>Please supply valid non-zero latitude and longitude for all vertex points</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-paper-line/70">
            <Button onClick={onCancel} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              variant="primary"
              size="sm"
              disabled={!isValidPolygon()}
              className="px-5 shadow-xs"
            >
              Generate Boundary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
