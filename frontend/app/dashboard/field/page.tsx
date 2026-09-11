"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFieldVisitsByOfficer } from "@/hooks/useField";
import { useUser } from "@clerk/nextjs";
import {
  FieldVisitStatus,
  FIELD_STATUS_LABELS,
  FIELD_STATUS_COLORS,
  getGPSAccuracyLabel,
  getGPSAccuracyColor,
} from "@/lib/constants/field";
import { getAllOfflineFieldVisits, getStorageInfo } from "@/lib/offline/storage";
import { isOnline } from "@/lib/offline/sync";
import {
  Card,
  CardContent,
  Loading,
  Badge,
  Button,
} from "@/components/ui";
import {
  MapPin,
  Camera,
  CheckSquare,
  Wifi,
  WifiOff,
  Plus,
  Clock,
  Navigation,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function FieldVisitsPage() {
  const { user } = useUser();
  const [online, setOnline] = useState(true);
  const [offlineCount, setOfflineCount] = useState(0);

  const { data, isLoading, error } = useFieldVisitsByOfficer(user?.id);

  // Check online status
  useEffect(() => {
    setOnline(isOnline());

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load offline data count
  useEffect(() => {
    getStorageInfo().then((info) => {
      setOfflineCount(info.visits + info.queueItems);
    });
  }, []);

  const visits = data?.data || [];

  // Filter by status for quick access
  const draftVisits = visits.filter((v) => v.status === FieldVisitStatus.DRAFT);
  const inProgressVisits = visits.filter(
    (v) => v.status === FieldVisitStatus.IN_PROGRESS
  );
  const submittedVisits = visits.filter(
    (v) => v.status === FieldVisitStatus.SUBMITTED
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Loading text="Loading field visits..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Fixed */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold font-['Instrument_Sans']">
              Field Visits
            </h1>
            <div className="flex items-center gap-2">
              {/* Online/Offline Indicator */}
              <Badge
                className={cn(
                  "text-sm font-medium",
                  online
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                )}
              >
                {online ? (
                  <>
                    <Wifi className="h-4 w-4 mr-1" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 mr-1" />
                    Offline
                  </>
                )}
              </Badge>
            </div>
          </div>

          {/* Offline Queue Badge */}
          {offlineCount > 0 && (
            <Badge className="bg-amber-100 text-amber-700 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {offlineCount} pending sync
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Quick Stats - Mobile Optimized */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">
                {inProgressVisits.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Active</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">
                {submittedVisits.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Submitted</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-gray-600">
                {draftVisits.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Draft</p>
            </CardContent>
          </Card>
        </div>

        {/* Field Visit Cards - Large Touch Targets */}
        {visits.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Navigation className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                No field visits yet
              </p>
              <p className="text-sm text-gray-500">
                Start a new field verification visit
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {visits.map((visit) => {
              const statusColors =
                FIELD_STATUS_COLORS[visit.status as FieldVisitStatus];
              const photoCount = visit.evidence?.length || 0;
              const checklistTotal = visit.checklistItems?.length || 0;
              const checklistComplete =
                visit.checklistItems?.filter(
                  (item) => item.status === "PASS" || item.status === "NOT_APPLICABLE"
                ).length || 0;

              return (
                <Link key={visit.id} href={`/dashboard/field/${visit.id}`}>
                  <Card className="hover:shadow-md transition-shadow active:scale-[0.98] active:shadow-sm transition-transform">
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-mono text-sm text-gray-500">
                            {visit.id.slice(0, 8)}...
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(visit.startedAt)}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "text-sm font-medium",
                            statusColors.bg,
                            statusColors.text
                          )}
                        >
                          {FIELD_STATUS_LABELS[visit.status as FieldVisitStatus]}
                        </Badge>
                      </div>

                      {/* Info Grid - Large Icons */}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {/* GPS Status */}
                        <div className="text-center">
                          <div
                            className={cn(
                              "w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2",
                              visit.latitude && visit.longitude
                                ? "bg-emerald-100"
                                : "bg-gray-100"
                            )}
                          >
                            <MapPin
                              className={cn(
                                "h-6 w-6",
                                visit.latitude && visit.longitude
                                  ? "text-emerald-600"
                                  : "text-gray-400"
                              )}
                            />
                          </div>
                          <p className="text-xs font-medium">
                            {visit.latitude && visit.longitude ? (
                              <span
                                className={getGPSAccuracyColor(
                                  visit.gpsAccuracyMeters
                                )}
                              >
                                GPS ✓
                              </span>
                            ) : (
                              <span className="text-gray-400">No GPS</span>
                            )}
                          </p>
                          {visit.gpsAccuracyMeters && (
                            <p className="text-xs text-gray-500">
                              {getGPSAccuracyLabel(visit.gpsAccuracyMeters)}
                            </p>
                          )}
                        </div>

                        {/* Photos */}
                        <div className="text-center">
                          <div
                            className={cn(
                              "w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2",
                              photoCount > 0 ? "bg-emerald-100" : "bg-gray-100"
                            )}
                          >
                            <Camera
                              className={cn(
                                "h-6 w-6",
                                photoCount > 0 ? "text-emerald-600" : "text-gray-400"
                              )}
                            />
                          </div>
                          <p className="text-xs font-medium">
                            {photoCount} Photo{photoCount !== 1 ? "s" : ""}
                          </p>
                        </div>

                        {/* Checklist */}
                        <div className="text-center">
                          <div
                            className={cn(
                              "w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2",
                              checklistComplete === checklistTotal && checklistTotal > 0
                                ? "bg-emerald-100"
                                : "bg-gray-100"
                            )}
                          >
                            <CheckSquare
                              className={cn(
                                "h-6 w-6",
                                checklistComplete === checklistTotal &&
                                  checklistTotal > 0
                                  ? "text-emerald-600"
                                  : "text-gray-400"
                              )}
                            />
                          </div>
                          <p className="text-xs font-medium">
                            {checklistComplete}/{checklistTotal}
                          </p>
                          <p className="text-xs text-gray-500">Checks</p>
                        </div>
                      </div>

                      {/* Project Info */}
                      {visit.projectId && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs text-gray-500">Project</p>
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {visit.projectId.slice(0, 12)}...
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button - Large Touch Target */}
      <div className="fixed bottom-6 right-6 z-10">
        <Link href="/dashboard/field/new">
          <Button
            className="w-16 h-16 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-transform"
            style={{ minHeight: "64px", minWidth: "64px" }}
          >
            <Plus className="h-8 w-8" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
