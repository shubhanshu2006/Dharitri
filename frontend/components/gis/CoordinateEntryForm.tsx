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
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Enter Boundary Coordinates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="font-medium text-blue-900 mb-1">How to use:</p>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Enter at least 3 coordinate points</li>
            <li>Use decimal degrees format (e.g., 28.6139, 77.2090)</li>
            <li>Points will be connected to form a polygon</li>
            <li>Polygon will be automatically closed</li>
          </ul>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {coordinates.map((coord, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full text-emerald-700 font-semibold text-sm">
                {index + 1}
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.000001"
                  value={coord.lat || ''}
                  onChange={(e) => updateCoordinate(index, 'lat', e.target.value)}
                  placeholder="Latitude (e.g., 28.6139)"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  step="0.000001"
                  value={coord.lng || ''}
                  onChange={(e) => updateCoordinate(index, 'lng', e.target.value)}
                  placeholder="Longitude (e.g., 77.2090)"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {coordinates.length > 3 && (
                <button
                  onClick={() => removePoint(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove point"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addPoint}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Point
        </button>

        {!isValidPolygon() && coordinates.length >= 3 && (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2">
            ⚠️ Please enter valid coordinates for all points
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleGenerate}
            variant="primary"
            disabled={!isValidPolygon()}
            className="flex-1"
          >
            Generate Boundary
          </Button>
          <Button
            onClick={onCancel}
            variant="ghost"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
