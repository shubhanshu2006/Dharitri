"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Mail, MessageSquare, Save, CheckCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NotificationType } from "@/lib/constants/notifications";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface NotificationPreference {
  type: NotificationType;
  label: string;
  description: string;
  inApp: boolean;
  email: boolean;
  sms: boolean;
}

export default function NotificationPreferencesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch preferences from API
  const { data: apiPreferences, isLoading, error } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: () => api.get<NotificationPreference[]>("/notifications/preferences"),
  });

  // Initialize local state with API data
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      type: NotificationType.PROJECT_CREATED,
      label: "Project Created",
      description: "When a new project is created in the system",
      inApp: true,
      email: true,
      sms: false,
    },
    {
      type: NotificationType.PROJECT_APPROVED,
      label: "Project Approved",
      description: "When a project receives approval",
      inApp: true,
      email: true,
      sms: false,
    },
    {
      type: NotificationType.PROJECT_COMPLETED,
      label: "Project Completed",
      description: "When a project is marked as completed",
      inApp: true,
      email: true,
      sms: true,
    },
    {
      type: NotificationType.PARCEL_VERIFIED,
      label: "Parcel Verified",
      description: "When a cadastral parcel is verified",
      inApp: true,
      email: false,
      sms: false,
    },
    {
      type: NotificationType.COMPENSATION_ASSESSED,
      label: "Compensation Assessed",
      description: "When compensation amount is assessed",
      inApp: true,
      email: true,
      sms: false,
    },
    {
      type: NotificationType.PAYMENT_INITIATED,
      label: "Payment Initiated",
      description: "When a payment is initiated",
      inApp: true,
      email: true,
      sms: false,
    },
    {
      type: NotificationType.PAYMENT_COMPLETED,
      label: "Payment Completed",
      description: "When a payment is successfully completed",
      inApp: true,
      email: true,
      sms: true,
    },
    {
      type: NotificationType.PAYMENT_FAILED,
      label: "Payment Failed",
      description: "When a payment fails",
      inApp: true,
      email: true,
      sms: true,
    },
    {
      type: NotificationType.RR_CASE_ASSIGNED,
      label: "R&R Case Assigned",
      description: "When a resettlement case is assigned to you",
      inApp: true,
      email: true,
      sms: false,
    },
    {
      type: NotificationType.POSSESSION_RECORDED,
      label: "Possession Recorded",
      description: "When possession of land is recorded",
      inApp: true,
      email: true,
      sms: false,
    },
    {
      type: NotificationType.DOCUMENT_UPLOADED,
      label: "Document Uploaded",
      description: "When a new document is uploaded",
      inApp: true,
      email: false,
      sms: false,
    },
    {
      type: NotificationType.FIELD_VISIT_ASSIGNED,
      label: "Field Visit Assigned",
      description: "When you are assigned a field visit",
      inApp: true,
      email: true,
      sms: true,
    },
    {
      type: NotificationType.GRIEVANCE_SUBMITTED,
      label: "Grievance Submitted",
      description: "When a grievance is submitted",
      inApp: true,
      email: true,
      sms: false,
    },
    {
      type: NotificationType.ALERT_CRITICAL,
      label: "Critical Alerts",
      description: "Critical system alerts requiring immediate attention",
      inApp: true,
      email: true,
      sms: true,
    },
    {
      type: NotificationType.ALERT_WARNING,
      label: "Warning Alerts",
      description: "Warning alerts about potential issues",
      inApp: true,
      email: true,
      sms: false,
    },
    {
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      label: "System Announcements",
      description: "General system announcements and updates",
      inApp: true,
      email: false,
      sms: false,
    },
  ]);

  // Update local state when API data loads
  useEffect(() => {
    if (apiPreferences && apiPreferences.length > 0) {
      setPreferences(apiPreferences);
    }
  }, [apiPreferences]);

  // Save preferences mutation
  const savePreferences = useMutation({
    mutationFn: (prefs: NotificationPreference[]) =>
      api.post("/notifications/preferences", { preferences: prefs }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const togglePreference = (
    index: number,
    channel: "inApp" | "email" | "sms"
  ) => {
    const updated = [...preferences];
    updated[index][channel] = !updated[index][channel];
    setPreferences(updated);
  };

  const handleSave = () => {
    savePreferences.mutate(preferences);
  };

  const enableAll = (channel: "inApp" | "email" | "sms") => {
    setPreferences(preferences.map((p) => ({ ...p, [channel]: true })));
  };

  const disableAll = (channel: "inApp" | "email" | "sms") => {
    setPreferences(preferences.map((p) => ({ ...p, [channel]: false })));
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner message="Loading preferences..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <ErrorMessage
          message="Failed to load notification preferences"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Notification Preferences
          </h1>
          <p className="text-gray-600 mt-1">
            Manage how you receive notifications for different events
          </p>
        </div>
        <Button onClick={handleSave} disabled={savePreferences.isPending} loading={savePreferences.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {savePreferences.isPending ? "Saving..." : "Save Preferences"}
        </Button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-900">
              Preferences saved successfully!
            </p>
          </div>
        </Card>
      )}

      {/* Error Message */}
      {savePreferences.isError && (
        <ErrorMessage
          message={savePreferences.error?.message || "Failed to save preferences"}
          onRetry={() => savePreferences.reset()}
        />
      )}

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Bell className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              About Notifications
            </h3>
            <p className="text-sm text-blue-800">
              Choose how you want to be notified for each type of event. In-app
              notifications appear in the notification center, emails are sent
              to your registered email, and SMS messages are sent to your mobile
              number.
            </p>
          </div>
        </div>
      </Card>

      {/* Preferences Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Event Type
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      In-App
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => enableAll("inApp")}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Enable all
                      </button>
                      <span className="text-xs text-gray-400">|</span>
                      <button
                        onClick={() => disableAll("inApp")}
                        className="text-xs text-gray-600 hover:underline"
                      >
                        Disable all
                      </button>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => enableAll("email")}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Enable all
                      </button>
                      <span className="text-xs text-gray-400">|</span>
                      <button
                        onClick={() => disableAll("email")}
                        className="text-xs text-gray-600 hover:underline"
                      >
                        Disable all
                      </button>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => enableAll("sms")}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Enable all
                      </button>
                      <span className="text-xs text-gray-400">|</span>
                      <button
                        onClick={() => disableAll("sms")}
                        className="text-xs text-gray-600 hover:underline"
                      >
                        Disable all
                      </button>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {preferences.map((pref, index) => (
                <tr key={pref.type} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{pref.label}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {pref.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={pref.inApp}
                      onChange={() => togglePreference(index, "inApp")}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={pref.email}
                      onChange={() => togglePreference(index, "email")}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={pref.sms}
                      onChange={() => togglePreference(index, "sms")}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={savePreferences.isPending} loading={savePreferences.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {savePreferences.isPending ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
