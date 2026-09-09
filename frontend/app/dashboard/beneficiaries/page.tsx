"use client";

import { useBeneficiaries } from "@/hooks/useBeneficiary";
import { Card, CardContent, ErrorMessage, LoadingTable } from "@/components/ui";
import { Users } from "lucide-react";

export default function BeneficiariesPage() {
  const { data, isLoading, error } = useBeneficiaries({ skip: 0, take: 25 });

  if (isLoading) {
    return <LoadingTable rows={8} />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load beneficiaries"
        message="Unable to fetch beneficiaries. Please try again."
      />
    );
  }

  const beneficiaries = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text font-instrument-sans">
          Beneficiaries
        </h1>
        <p className="mt-1 text-muted">
          Manage people and families affected by land acquisition.
        </p>
      </div>

      {beneficiaries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Users className="h-10 w-10 text-muted" />
            <h2 className="text-lg font-semibold text-text">
              No beneficiaries found
            </h2>
            <p className="text-sm text-muted">
              Beneficiary records will appear here when they are added.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {beneficiaries.map((beneficiary) => (
            <Card key={beneficiary.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <h2 className="font-semibold text-text">
                    {beneficiary.displayName}
                  </h2>
                  {beneficiary.externalReference && (
                    <p className="mt-1 text-sm text-muted">
                      {beneficiary.externalReference}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  {beneficiary.verificationStatus.replace(/_/g, " ")}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
