"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Button, Badge, Alert } from "@/components/ui";
import { MapPin, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import {
  getGPSAccuracyLabel,
  getGPSAccuracyColor,
  MOBILE_SETTINGS,
} from "@/lib/constants/field";
import { cn } from "@/lib/utils";

interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface GPSCaptureProps {
  onLocationCaptured: (location: GPSLocation) => void;
  currentLocation?: GPSLocation | null;
  className?: string;
}

export function GPSCapture({
  onLocationCaptured,
  currentLocation,
  className,
}: GPSCaptureProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [location, setLocation] = useState<GPSLocation | null>(
    currentLocation || null
  );

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError("GPS not supported on this device");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: GPSLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        setLocation(newLocation);
        setLoading(false);
        onLocationCaptured(newLocation);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("GPS permission denied. Please enable location access.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("GPS unavailable. Please check your device settings.");
            break;
          case err.TIMEOUT:
            setError("GPS timeout. Please try again.");
            break;
          default:
            setError("Failed to get GPS location");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: MOBILE_SETTINGS.GPS_TIMEOUT,
        maximumAge: 0,
      }
    );
  };

  // Auto-capture on mount if no location
  useEffect(() => {
    if (!currentLocation && !location) {
      captureLocation();
    }
  }, []);

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              location ? "bg-emerald-100" : "bg-gray-100"
            )}
          >
            {loading ? (
              <Loader2 className="h-6 w-6 text-gray-600 animate-spin" />
            ) : (
              <MapPin
                className={cn(
                  "h-6 w-6",
                  location ? "text-emerald-600" : "text-gray-400"
                )}
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium">GPS Location</h3>
            <p className="text-sm text-gray-500">
              {loading
                ? "Acquiring location..."
                : location
                ? "Location captured"
                : "No location yet"}
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <div>
              <p className="font-medium">GPS Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </Alert>
        )}

        {location && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
            {/* Coordinates */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Coordinates</p>
              <p className="font-mono text-sm">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
            </div>

            {/* Accuracy */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Accuracy</p>
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    "text-sm",
                    location.accuracy <= 10
                      ? "bg-emerald-100 text-emerald-700"
                      : location.accuracy <= 20
                      ? "bg-blue-100 text-blue-700"
                      : location.accuracy <= 50
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  {getGPSAccuracyLabel(location.accuracy)}
                </Badge>
                <span className="text-sm text-gray-600">
                  ±{Math.round(location.accuracy)}m
                </span>
              </div>
            </div>

            {/* Timestamp */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Captured</p>
              <p className="text-sm">
                {new Date(location.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}

        {/* Capture/Refresh Button - Large Touch Target */}
        <Button
          onClick={captureLocation}
          disabled={loading}
          className={cn(
            "w-full",
            location
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-emerald-600 hover:bg-emerald-700"
          )}
          style={{ minHeight: "48px" }}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Getting Location...
            </>
          ) : location ? (
            <>
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh GPS
            </>
          ) : (
            <>
              <MapPin className="h-5 w-5 mr-2" />
              Capture GPS
            </>
          )}
        </Button>

        {location && location.accuracy > 50 && (
          <p className="text-xs text-amber-600 mt-2 text-center">
            ⚠️ Poor accuracy. Consider refreshing GPS in open area
          </p>
        )}
      </CardContent>
    </Card>
  );
}
