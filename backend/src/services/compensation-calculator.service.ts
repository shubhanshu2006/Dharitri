/**
 * RFCTLARR Act 2013 Compensation Calculator
 * Right to Fair Compensation and Transparency in Land Acquisition,
 * Rehabilitation and Resettlement Act, 2013
 */

export interface CompensationInput {
  // Land details
  landAreaSqM: number;
  marketValuePerSqM: number;
  landType: 'agricultural' | 'residential' | 'commercial' | 'industrial';
  
  // Asset details
  structureValue?: number;
  treeCount?: number;
  cropValue?: number;
  
  // Family details
  familySize?: number;
  isDisplaced?: boolean;
  
  // Timeline
  notificationDate: Date;
  
  // Location multiplier (urban/rural)
  locationMultiplier?: number; // 1 for rural, 2 for urban (as per Act)
}

export interface CompensationBreakdown {
  // Land compensation components
  marketValue: number;
  multipliedValue: number; // 2x or 4x of market value
  solatium: number; // Additional amount
  
  // Asset compensation
  structureCompensation: number;
  treeCompensation: number;
  cropCompensation: number;
  
  // Time-based compensation
  interest: number;
  
  // R&R compensation
  rrCompensation: number;
  
  // Total
  totalCompensation: number;
  
  // Additional info
  perSqMRate: number;
  calculationDate: Date;
  actReference: string;
}

export interface RRBreakdown {
  shiftingAllowance: number;
  subsistenceGrant: number;
  houseConstructionGrant: number;
  oneLumpSum: number;
  annuityValue: number;
  total: number;
}

export class CompensationCalculatorService {
  /**
   * Calculate compensation as per RFCTLARR Act 2013
   */
  calculateCompensation(input: CompensationInput): CompensationBreakdown {
    // 1. Market Value (Section 26)
    const marketValue = input.landAreaSqM * input.marketValuePerSqM;
    
    // 2. Multiplier based on land type and location
    // Section 26: In rural areas - 2x, In urban areas - market value
    // For infrastructure projects, typically 2x is applied
    const multiplier = input.locationMultiplier || 2;
    const multipliedValue = marketValue * multiplier;
    
    // 3. Solatium (Section 27)
    // 30% of multiplied value as solatium
    const solatium = multipliedValue * 0.30;
    
    // 4. Structure Compensation
    const structureCompensation = input.structureValue || 0;
    
    // 5. Tree Compensation
    // Average ₹500 per tree (varies by species)
    const treeCompensation = (input.treeCount || 0) * 500;
    
    // 6. Crop Compensation
    const cropCompensation = input.cropValue || 0;
    
    // 7. Interest (Section 28)
    // 12% per annum from date of notification to payment
    const monthsSinceNotification = this.getMonthsDifference(
      input.notificationDate,
      new Date()
    );
    const interest = (marketValue * 0.12 * monthsSinceNotification) / 12;
    
    // 8. R&R Compensation (if displaced)
    let rrCompensation = 0;
    if (input.isDisplaced) {
      const rrBreakdown = this.calculateRRCompensation(input);
      rrCompensation = rrBreakdown.total;
    }
    
    // 9. Total Compensation
    const totalCompensation = 
      multipliedValue + 
      solatium + 
      structureCompensation + 
      treeCompensation + 
      cropCompensation + 
      interest + 
      rrCompensation;
    
    return {
      marketValue,
      multipliedValue,
      solatium,
      structureCompensation,
      treeCompensation,
      cropCompensation,
      interest,
      rrCompensation,
      totalCompensation,
      perSqMRate: totalCompensation / input.landAreaSqM,
      calculationDate: new Date(),
      actReference: 'RFCTLARR Act 2013, Sections 26-28'
    };
  }

  /**
   * Calculate R&R compensation as per Schedule I of RFCTLARR Act
   */
  calculateRRCompensation(input: CompensationInput): RRBreakdown {
    const familySize = input.familySize || 5;
    
    // 1. Shifting Allowance (Para 3, Schedule I)
    const shiftingAllowance = 50000;
    
    // 2. Subsistence Grant (Para 4, Schedule I)
    // ₹3,000 per month per family for 1 year
    const subsistenceGrant = 3000 * 12 * familySize;
    
    // 3. House Construction Grant (Para 5, Schedule I)
    // If residential structure is affected
    const houseGrant = input.structureValue && input.structureValue > 0 ? 150000 : 0;
    
    // 4. One-time lump sum (Para 6, Schedule I)
    // Equal to compensation for 1 acre (4047 sq.m)
    const oneAcreSqM = 4047;
    const lumpSum = input.marketValuePerSqM * oneAcreSqM;
    
    // 5. Annuity (Para 7, Schedule I)
    // ₹2,000 per month, capitalized for 20 years
    const monthlyAnnuity = 2000;
    const annuityYears = 20;
    const annuityValue = monthlyAnnuity * 12 * annuityYears * familySize;
    
    return {
      shiftingAllowance,
      subsistenceGrant,
      houseConstructionGrant: houseGrant,
      oneLumpSum: lumpSum,
      annuityValue,
      total: shiftingAllowance + subsistenceGrant + houseGrant + lumpSum + annuityValue
    };
  }

  /**
   * Calculate months between two dates
   */
  private getMonthsDifference(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    
    return months >= 0 ? months : 0;
  }

  /**
   * Get market rate suggestions based on location and land type
   */
  getMarketRateSuggestion(
    stateCode: string,
    districtName: string,
    landType: string
  ): { min: number; max: number; suggested: number } {
    // This would ideally come from government rate tables
    // For demo, return realistic ranges
    
    const ratesByType: Record<string, { min: number; max: number; suggested: number }> = {
      agricultural: { min: 5000, max: 25000, suggested: 15000 },
      residential: { min: 25000, max: 100000, suggested: 50000 },
      commercial: { min: 50000, max: 200000, suggested: 100000 },
      industrial: { min: 15000, max: 75000, suggested: 35000 }
    };
    
    return ratesByType[landType] || ratesByType.agricultural;
  }
}

export default new CompensationCalculatorService();
