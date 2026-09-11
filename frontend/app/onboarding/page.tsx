"use client";

import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Clock, Mail, User, Building2, Briefcase, MessageSquare, LogOut, MapPin } from "lucide-react";
import { useCurrentUser } from "@/hooks/useUser";
import { useStates, useDistricts } from "@/hooks/useLocations";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function OnboardingPage() {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const { data: currentUser, isLoading } = useCurrentUser();
  const router = useRouter();
  
  const [requestData, setRequestData] = useState({
    requestedRole: "",
    requestedStateId: "",
    requestedDistrictId: "",
    requestReason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch states and districts
  const { data: states, isLoading: statesLoading } = useStates();
  const { data: districts, isLoading: districtsLoading } = useDistricts(requestData.requestedStateId);

  // 13 Roles organized by scope level (exact match with backend Role enum)
  const rolesByScope = {
    national: [
      { value: "CENTRAL_MINISTRY", label: "Central Ministry", description: "Central government ministry access" },
    ],
    state: [
      { value: "STATE_ADMIN", label: "State Admin", description: "State-level administration" },
      { value: "GIS_OFFICER", label: "GIS Officer", description: "GIS and mapping operations" },
    ],
    district: [
      { value: "DISTRICT_ADMIN", label: "District Admin", description: "District-level administration" },
      { value: "LAND_ACQUISITION_OFFICER", label: "Land Acquisition Officer", description: "Land acquisition operations" },
      { value: "FINANCE_OFFICER", label: "Finance Officer", description: "Financial operations and payments" },
      { value: "RR_OFFICER", label: "R&R Officer", description: "Rehabilitation and resettlement" },
      { value: "FIELD_VERIFIER", label: "Field Verifier", description: "Field verification operations" },
    ],
    project: [
      { value: "PROJECT_IMPLEMENTING_AGENCY", label: "Project Implementing Agency", description: "Project implementation and management" },
    ],
    review: [
      { value: "REVIEWER", label: "Reviewer", description: "Review and approval operations" },
      { value: "EXECUTIVE_VIEWER", label: "Executive Viewer", description: "Executive dashboard and reports access" },
    ],
  };

  // If user is active, redirect to dashboard
  if (!isLoading && currentUser?.status === "ACTIVE") {
    router.push("/dashboard");
    return null;
  }

  // If user is rejected, show rejection message
  if (!isLoading && currentUser?.status === "REJECTED") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Application Not Approved
            </h1>
            <p className="text-gray-600 mb-4">
              Your DHARITRI account application was not approved.
            </p>
            {currentUser?.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  <strong>Reason:</strong> {currentUser.rejectionReason}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600 mb-6">
              If you believe this was an error, please contact your department administrator.
            </p>
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update user's access request
      await api.patch(`/auth/me/access-request`, requestData);
      setSubmitted(true);
      toast.success("Access request submitted successfully");
    } catch (error) {
      console.error("Failed to submit access request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Account Pending Approval</h1>
          <p className="text-emerald-50">
            Your account has been created and is awaiting administrator approval
          </p>
        </div>

        <div className="p-8">
          {/* User Info */}
          <div className="bg-emerald-50 rounded-lg p-6 mb-6 border border-emerald-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Account Details
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{currentUser?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{currentUser?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Pending Approval
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Request Access Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  ✨ Request Access
                </h3>
                <p className="text-sm text-blue-800">
                  Select your role and explain why you need access to DHARITRI platform.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Requested Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={requestData.requestedRole}
                  onChange={(e) =>
                    setRequestData({ ...requestData, requestedRole: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select the role you need</option>
                  
                  <optgroup label="🌐 National Scope">
                    {rolesByScope.national.map((role) => (
                      <option key={role.value} value={role.value} title={role.description}>
                        {role.label}
                      </option>
                    ))}
                  </optgroup>
                  
                  <optgroup label="🏛️ State Scope">
                    {rolesByScope.state.map((role) => (
                      <option key={role.value} value={role.value} title={role.description}>
                        {role.label}
                      </option>
                    ))}
                  </optgroup>
                  
                  <optgroup label="🏢 District Scope">
                    {rolesByScope.district.map((role) => (
                      <option key={role.value} value={role.value} title={role.description}>
                        {role.label}
                      </option>
                    ))}
                  </optgroup>
                  
                  <optgroup label="📁 Project Scope">
                    {rolesByScope.project.map((role) => (
                      <option key={role.value} value={role.value} title={role.description}>
                        {role.label}
                      </option>
                    ))}
                  </optgroup>
                  
                  <optgroup label="👁️ Review & Executive">
                    {rolesByScope.review.map((role) => (
                      <option key={role.value} value={role.value} title={role.description}>
                        {role.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Roles are organized by their operational scope level
                </p>
              </div>

              {/* Show state/district fields for roles that need geographic scope */}
              {(requestData.requestedRole === "STATE_ADMIN" || 
                requestData.requestedRole === "GIS_OFFICER" ||
                requestData.requestedRole === "DISTRICT_ADMIN" ||
                requestData.requestedRole === "LAND_ACQUISITION_OFFICER" ||
                requestData.requestedRole === "FINANCE_OFFICER" ||
                requestData.requestedRole === "RR_OFFICER" ||
                requestData.requestedRole === "FIELD_VERIFIER") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      State {(requestData.requestedRole === "STATE_ADMIN" || requestData.requestedRole === "GIS_OFFICER") && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      value={requestData.requestedStateId}
                      onChange={(e) => {
                        setRequestData({ 
                          ...requestData, 
                          requestedStateId: e.target.value,
                          requestedDistrictId: "" // Reset district when state changes
                        });
                      }}
                      required={requestData.requestedRole === "STATE_ADMIN" || requestData.requestedRole === "GIS_OFFICER"}
                      disabled={statesLoading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                    >
                      <option value="">
                        {statesLoading ? "Loading states..." : "Select state"}
                      </option>
                      {states?.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(requestData.requestedRole === "DISTRICT_ADMIN" ||
                    requestData.requestedRole === "LAND_ACQUISITION_OFFICER" ||
                    requestData.requestedRole === "FINANCE_OFFICER" ||
                    requestData.requestedRole === "RR_OFFICER" ||
                    requestData.requestedRole === "FIELD_VERIFIER") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={requestData.requestedDistrictId}
                        onChange={(e) =>
                          setRequestData({ ...requestData, requestedDistrictId: e.target.value })
                        }
                        required
                        disabled={!requestData.requestedStateId || districtsLoading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                      >
                        <option value="">
                          {!requestData.requestedStateId 
                            ? "Select state first" 
                            : districtsLoading 
                            ? "Loading districts..." 
                            : "Select district"}
                        </option>
                        {districts?.map((district) => (
                          <option key={district.id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Your work location - admin will assign scope based on this
                      </p>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Reason for Access <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={requestData.requestReason}
                  onChange={(e) =>
                    setRequestData({ ...requestData, requestReason: e.target.value })
                  }
                  rows={4}
                  required
                  placeholder="Example: I am a Land Acquisition Officer at District Collectorate. I need access to manage land acquisition cases, process compensation assessments, and coordinate with field verification teams for highway projects."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mention: Your current designation, organization/department, and key responsibilities
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Access Request"}
              </button>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Request Submitted!
              </h3>
              <p className="text-green-800 mb-4">
                Your access request has been sent to administrators.
              </p>
            </div>
          )}

          {/* What's Next */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-600">1</span>
                </div>
                <p className="text-sm text-gray-700">
                  Administrator will review your account details and request
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-600">2</span>
                </div>
                <p className="text-sm text-gray-700">
                  You'll be assigned an appropriate role based on your department
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-600">3</span>
                </div>
                <p className="text-sm text-gray-700">
                  You'll receive an email notification once approved
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-600">4</span>
                </div>
                <p className="text-sm text-gray-700">
                  You can then access the full DHARITRI platform
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">⏱️ Typical approval time:</strong> 1-2 business days
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
