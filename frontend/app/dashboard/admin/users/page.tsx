"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Building2,
  Briefcase,
  MapPin,
  Shield,
} from "lucide-react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useStates, useDistricts } from "@/hooks/useLocations";
import { Role, ROLE_DESCRIPTIONS, ROLE_COLORS } from "@/lib/constants/roles";

interface ApprovalFormData {
  roleCode: string;
  stateId: string;
  districtId: string;
  departmentId: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightUserId = searchParams.get("user");

  const { pendingUsers, allUsers, approveUser, rejectUser, isLoading } = useAdminUsers();
  
  // Fetch states and districts for dropdowns
  const { data: states } = useStates();
  const { data: allDistricts } = useDistricts(); // Get all districts for lookup

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [approvalData, setApprovalData] = useState<ApprovalFormData>({
    roleCode: "",
    stateId: "",
    districtId: "",
    departmentId: "",
  });
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out CITIZEN role from assignment options (public role)
  const assignableRoles = Object.entries(Role).filter(
    ([key]) => key !== "CITIZEN"
  );

  const handleApprove = async (userId: string) => {
    if (!approvalData.roleCode) {
      alert("Please select a role");
      return;
    }

    setIsSubmitting(true);
    try {
      await approveUser(userId, approvalData);
      setSelectedUser(null);
      setApprovalData({
        roleCode: "",
        stateId: "",
        districtId: "",
        departmentId: "",
      });
      alert("User approved successfully!");
    } catch (error) {
      console.error("Failed to approve user:", error);
      alert("Failed to approve user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm("Are you sure you want to reject this user?")) {
      return;
    }

    setIsSubmitting(true);
    try {
      await rejectUser(userId, rejectReason);
      setSelectedUser(null);
      setRejectReason("");
      alert("User rejected successfully");
    } catch (error) {
      console.error("Failed to reject user:", error);
      alert("Failed to reject user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-600" />
          User Management
        </h1>
        <p className="text-gray-600 mt-2">
          Approve pending users and manage system access
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">
                {pendingUsers?.length || 0}
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {allUsers?.filter((u) => u.status === "ACTIVE").length || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {allUsers?.length || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingUsers && pendingUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Pending Approvals ({pendingUsers.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className={`p-6 ${highlightUserId === user.id ? "bg-amber-50" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-emerald-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {user.requestedRole && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-emerald-500" />
                          <span className="text-gray-600">Requested Role:</span>
                          <span className="font-semibold text-emerald-700 px-2 py-0.5 bg-emerald-50 rounded">
                            {user.requestedRole}
                          </span>
                        </div>
                      )}
                      {user.requestedStateId && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-600">State:</span>
                          <span className="font-medium text-gray-900">
                            {states?.find(s => s.id === user.requestedStateId)?.name || user.requestedStateId}
                          </span>
                        </div>
                      )}
                      {user.requestedDistrictId && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-600">District:</span>
                          <span className="font-medium text-gray-900">
                            {allDistricts?.find(d => d.id === user.requestedDistrictId)?.name || user.requestedDistrictId}
                          </span>
                        </div>
                      )}
                      {user.requestedDepartment && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Department:</span>
                          <span className="font-medium text-gray-900">
                            {user.requestedDepartment}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Signed up:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                          })}
                        </span>
                      </div>
                    </div>

                    {user.requestReason && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-900">
                          <strong>Reason:</strong> "{user.requestReason}"
                        </p>
                      </div>
                    )}

                    {selectedUser?.id === user.id ? (
                      <div className="bg-gray-50 rounded-lg p-4 mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Shield className="w-4 h-4 inline mr-1" />
                              Assign Role *
                            </label>
                            <select
                              value={approvalData.roleCode}
                              onChange={(e) =>
                                setApprovalData({
                                  ...approvalData,
                                  roleCode: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="">Select role...</option>
                              {assignableRoles.map(([key, value]) => (
                                <option key={key} value={value}>
                                  {value.replace(/_/g, " ")}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <MapPin className="w-4 h-4 inline mr-1" />
                              State
                            </label>
                            <select
                              value={approvalData.stateId}
                              onChange={(e) => {
                                setApprovalData({
                                  ...approvalData,
                                  stateId: e.target.value,
                                  districtId: "", // Reset district when state changes
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="">Select state...</option>
                              {states?.map((state) => (
                                <option key={state.id} value={state.id}>
                                  {state.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <MapPin className="w-4 h-4 inline mr-1" />
                              District
                            </label>
                            <select
                              value={approvalData.districtId}
                              onChange={(e) =>
                                setApprovalData({
                                  ...approvalData,
                                  districtId: e.target.value,
                                })
                              }
                              disabled={!approvalData.stateId}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                            >
                              <option value="">
                                {!approvalData.stateId ? "Select state first" : "Select district..."}
                              </option>
                              {allDistricts
                                ?.filter(d => d.stateId === approvalData.stateId)
                                .map((district) => (
                                  <option key={district.id} value={district.id}>
                                    {district.name}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Building2 className="w-4 h-4 inline mr-1" />
                              Department
                            </label>
                            <input
                              type="text"
                              value={approvalData.departmentId}
                              onChange={(e) =>
                                setApprovalData({
                                  ...approvalData,
                                  departmentId: e.target.value,
                                })
                              }
                              placeholder="e.g., Land Acquisition"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(user.id)}
                            disabled={isSubmitting || !approvalData.roleCode}
                            className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {isSubmitting ? "Approving..." : "Approve & Assign Role"}
                          </button>
                          <button
                            onClick={() => setSelectedUser(null)}
                            disabled={isSubmitting}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Or Reject (optional reason):
                          </label>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Reason for rejection..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            />
                            <button
                              onClick={() => handleReject(user.id)}
                              disabled={isSubmitting}
                              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            // Pre-fill the requested role and location if available
                            setApprovalData({
                              roleCode: user.requestedRole || "",
                              stateId: user.requestedStateId || "",
                              districtId: user.requestedDistrictId || "",
                              departmentId: "",
                            });
                          }}
                          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          Assign Role & Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Pending Users */}
      {pendingUsers && pendingUsers.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            All Clear!
          </h3>
          <p className="text-gray-600">
            There are no pending user approvals at this time.
          </p>
        </div>
      )}
    </div>
  );
}
