import { RREntitlement } from "@/hooks/useRR";
import {
  ENTITLEMENT_STATUS_LABELS,
  EntitlementStatus,
} from "@/lib/constants/rr";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { Package, CheckCircle, Clock } from "lucide-react";

interface RREntitlementsProps {
  entitlements: RREntitlement[];
}

export function RREntitlements({ entitlements }: RREntitlementsProps) {
  if (!entitlements || entitlements.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No entitlements recorded yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case EntitlementStatus.VERIFIED:
      case EntitlementStatus.PROVIDED:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case EntitlementStatus.APPROVED:
        return "bg-green-100 text-green-700 border-green-200";
      case EntitlementStatus.ASSESSED:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case EntitlementStatus.DISPUTED:
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {entitlements.map((entitlement) => (
        <Card key={entitlement.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">
                  {entitlement.entitlementType}
                </CardTitle>
              </div>
              <Badge
                className={`${getStatusColor(entitlement.status)} border font-medium`}
              >
                {ENTITLEMENT_STATUS_LABELS[entitlement.status as EntitlementStatus] ||
                  entitlement.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* Assessed Value */}
              <div className="border-l-2 border-amber-500 pl-4">
                <p className="text-sm text-gray-600 mb-1">Assessed Value</p>
                <pre className="text-sm bg-gray-50 p-2 rounded">
                  {JSON.stringify(entitlement.assessedValue, null, 2)}
                </pre>
              </div>

              {/* Approved Value */}
              {entitlement.approvedValue && (
                <div className="border-l-2 border-green-500 pl-4">
                  <p className="text-sm text-gray-600 mb-1">Approved Value</p>
                  <pre className="text-sm bg-gray-50 p-2 rounded">
                    {JSON.stringify(entitlement.approvedValue, null, 2)}
                  </pre>
                </div>
              )}

              {/* Provided Value */}
              {entitlement.providedValue && (
                <div className="border-l-2 border-emerald-500 pl-4">
                  <p className="text-sm text-gray-600 mb-1">Provided Value</p>
                  <pre className="text-sm bg-gray-50 p-2 rounded">
                    {JSON.stringify(entitlement.providedValue, null, 2)}
                  </pre>
                </div>
              )}

              {/* Timestamps */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                {entitlement.verifiedAt && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Verified: {formatDate(entitlement.verifiedAt)}</span>
                  </div>
                )}
                {entitlement.completedAt && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>Completed: {formatDate(entitlement.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
