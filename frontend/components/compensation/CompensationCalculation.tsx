import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { COMPENSATION_COMPONENTS } from "@/lib/constants/compensation";
import { formatCurrency } from "@/lib/utils";
import { Calculator } from "lucide-react";

interface CompensationCalculationProps {
  landValue: number;
  solatium: number;
  interest: number;
  otherComponents: number;
  deductions: number;
  totalAmount: number;
}

export function CompensationCalculation({
  landValue,
  solatium,
  interest,
  otherComponents,
  deductions,
  totalAmount,
}: CompensationCalculationProps) {
  const components = [
    { label: COMPENSATION_COMPONENTS.LAND_VALUE, amount: landValue, isPositive: true },
    { label: COMPENSATION_COMPONENTS.SOLATIUM, amount: solatium, isPositive: true },
    { label: COMPENSATION_COMPONENTS.INTEREST, amount: interest, isPositive: true },
    { label: COMPENSATION_COMPONENTS.OTHER_COMPONENTS, amount: otherComponents, isPositive: true },
    { label: COMPENSATION_COMPONENTS.DEDUCTIONS, amount: deductions, isPositive: false },
  ];

  const subtotal = landValue + solatium + interest + otherComponents;

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600" />
          Compensation Calculation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Components */}
          {components.map((component) => (
            component.amount > 0 && (
              <div
                key={component.label}
                className="flex items-center justify-between py-2 border-b border-paper-line last:border-0"
              >
                <span className="text-sm text-muted">{component.label}</span>
                <span className={`text-sm font-medium ${component.isPositive ? 'text-text' : 'text-red-600'}`}>
                  {component.isPositive ? '+' : '-'} {formatCurrency(component.amount)}
                </span>
              </div>
            )
          ))}

          {/* Subtotal */}
          <div className="flex items-center justify-between py-2 border-t-2 border-paper-line">
            <span className="text-sm font-semibold text-text">Subtotal</span>
            <span className="text-sm font-semibold text-text">
              {formatCurrency(subtotal)}
            </span>
          </div>

          {/* Deductions */}
          {deductions > 0 && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted">Less: Deductions</span>
              <span className="text-sm font-medium text-red-600">
                - {formatCurrency(deductions)}
              </span>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between py-3 bg-emerald-50 rounded-lg px-4 mt-4">
            <span className="text-base font-bold text-emerald-900">
              Total Compensation
            </span>
            <span className="text-xl font-bold text-emerald-700">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
