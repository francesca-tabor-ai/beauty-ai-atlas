"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, DollarSign, Calendar, Percent } from "lucide-react";

interface ROICalculatorProps {
  investmentLow?: number;
  investmentHigh?: number;
  investmentRange?: string;
}

export function ROICalculator({
  investmentLow,
  investmentHigh,
  investmentRange,
}: ROICalculatorProps) {
  // Input state
  const [baselineConversion, setBaselineConversion] = useState(2.5); // %
  const [conversionUplift, setConversionUplift] = useState(30); // %
  const [baselineAOV, setBaselineAOV] = useState(50); // $
  const [aovUplift, setAovUplift] = useState(20); // %
  const [monthlyTraffic, setMonthlyTraffic] = useState(10000); // visitors
  const [returnRate, setReturnRate] = useState(15); // %
  const [returnReduction, setReturnReduction] = useState(10); // %
  const [investment, setInvestment] = useState(
    investmentLow && investmentHigh
      ? Math.round((investmentLow + investmentHigh) / 2)
      : 500000
  ); // $

  // Calculate investment range from props
  const investmentMin = investmentLow || 0;
  const investmentMax = investmentHigh || 1000000;

  // Calculations
  const calculations = useMemo(() => {
    // Convert percentages to decimals
    const baselineConvDecimal = baselineConversion / 100;
    const conversionUpliftDecimal = conversionUplift / 100;
    const aovUpliftDecimal = aovUplift / 100;
    const returnRateDecimal = returnRate / 100;
    const returnReductionDecimal = returnReduction / 100;

    // New conversion rate after uplift
    const newConversionRate = baselineConvDecimal * (1 + conversionUpliftDecimal);
    
    // New AOV after uplift
    const newAOV = baselineAOV * (1 + aovUpliftDecimal);

    // Incremental Revenue (annual)
    // = (traffic × new_conversion × new_AOV - traffic × baseline_conversion × baseline_AOV) × 12
    const baselineMonthlyRevenue = monthlyTraffic * baselineConvDecimal * baselineAOV;
    const newMonthlyRevenue = monthlyTraffic * newConversionRate * newAOV;
    const incrementalMonthlyRevenue = newMonthlyRevenue - baselineMonthlyRevenue;
    const incrementalAnnualRevenue = incrementalMonthlyRevenue * 12;

    // Cost Savings (annual)
    // = (traffic × conversion × return_rate × reduction × AOV) × 12
    const monthlyReturns = monthlyTraffic * newConversionRate * returnRateDecimal;
    const monthlyReturnValue = monthlyReturns * newAOV;
    const monthlySavings = monthlyReturnValue * returnReductionDecimal;
    const annualCostSavings = monthlySavings * 12;

    // Total Benefit
    const totalAnnualBenefit = incrementalAnnualRevenue + annualCostSavings;

    // Payback Period (months)
    const monthlyBenefit = totalAnnualBenefit / 12;
    const paybackPeriod = investment > 0 && monthlyBenefit > 0 
      ? investment / monthlyBenefit 
      : 0;

    // ROI %
    const roi = investment > 0 
      ? ((totalAnnualBenefit - investment) / investment) * 100 
      : 0;

    return {
      incrementalAnnualRevenue,
      annualCostSavings,
      totalAnnualBenefit,
      paybackPeriod,
      roi,
    };
  }, [
    baselineConversion,
    conversionUplift,
    baselineAOV,
    aovUplift,
    monthlyTraffic,
    returnRate,
    returnReduction,
    investment,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>ROI Assumptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Baseline Conversion Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="baseline-conversion">Baseline Conversion Rate</Label>
                <span className="text-sm font-medium">{baselineConversion}%</span>
              </div>
              <Slider
                id="baseline-conversion"
                min="0.5"
                max="10"
                step="0.1"
                value={baselineConversion}
                onChange={(e) => setBaselineConversion(parseFloat(e.target.value))}
              />
            </div>

            {/* Conversion Uplift */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="conversion-uplift">Expected Conversion Uplift</Label>
                <span className="text-sm font-medium">{conversionUplift}%</span>
              </div>
              <Slider
                id="conversion-uplift"
                min="0"
                max="100"
                step="1"
                value={conversionUplift}
                onChange={(e) => setConversionUplift(parseFloat(e.target.value))}
              />
            </div>

            {/* Baseline AOV */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="baseline-aov">Baseline Average Order Value</Label>
                <span className="text-sm font-medium">{formatCurrency(baselineAOV)}</span>
              </div>
              <Slider
                id="baseline-aov"
                min="10"
                max="500"
                step="5"
                value={baselineAOV}
                onChange={(e) => setBaselineAOV(parseFloat(e.target.value))}
              />
            </div>

            {/* AOV Uplift */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="aov-uplift">Expected AOV Uplift</Label>
                <span className="text-sm font-medium">{aovUplift}%</span>
              </div>
              <Slider
                id="aov-uplift"
                min="0"
                max="100"
                step="1"
                value={aovUplift}
                onChange={(e) => setAovUplift(parseFloat(e.target.value))}
              />
            </div>

            {/* Monthly Traffic */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="monthly-traffic">Monthly Traffic (Visitors)</Label>
                <span className="text-sm font-medium">
                  {monthlyTraffic.toLocaleString()}
                </span>
              </div>
              <Slider
                id="monthly-traffic"
                min="1000"
                max="100000"
                step="1000"
                value={monthlyTraffic}
                onChange={(e) => setMonthlyTraffic(parseInt(e.target.value))}
              />
            </div>

            {/* Return Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="return-rate">Current Return Rate</Label>
                <span className="text-sm font-medium">{returnRate}%</span>
              </div>
              <Slider
                id="return-rate"
                min="0"
                max="50"
                step="0.5"
                value={returnRate}
                onChange={(e) => setReturnRate(parseFloat(e.target.value))}
              />
            </div>

            {/* Return Reduction */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="return-reduction">Expected Return Reduction</Label>
                <span className="text-sm font-medium">{returnReduction}%</span>
              </div>
              <Slider
                id="return-reduction"
                min="0"
                max="50"
                step="0.5"
                value={returnReduction}
                onChange={(e) => setReturnReduction(parseFloat(e.target.value))}
              />
            </div>

            {/* Investment */}
            <div className="space-y-2">
              <Label htmlFor="investment">Investment Amount</Label>
              <Input
                id="investment"
                type="number"
                min={investmentMin}
                max={investmentMax}
                step="10000"
                value={investment}
                onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
                className="w-full"
              />
              {investmentRange && (
                <p className="text-xs text-muted-foreground">
                  Project range: {investmentRange}
                </p>
              )}
              {investmentLow && investmentHigh && (
                <p className="text-xs text-muted-foreground">
                  Range: {formatCurrency(investmentLow)} - {formatCurrency(investmentHigh)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Output Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              ROI Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Incremental Annual Revenue */}
            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Incremental Annual Revenue
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {formatCurrency(calculations.incrementalAnnualRevenue)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            {/* Annual Cost Savings */}
            <Card className="bg-green-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Annual Cost Savings
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {formatCurrency(calculations.annualCostSavings)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            {/* Total Annual Benefit */}
            <Card className="bg-blue-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Annual Benefit
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {formatCurrency(calculations.totalAnnualBenefit)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            {/* Payback Period */}
            <Card className="bg-yellow-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Payback Period
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {calculations.paybackPeriod > 0
                        ? `${calculations.paybackPeriod.toFixed(1)} months`
                        : "N/A"}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            {/* ROI % */}
            <Card
              className={
                calculations.roi >= 0
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-red-500/10 border-red-500/20"
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      ROI
                    </p>
                    <p
                      className={`text-3xl font-bold mt-1 ${
                        calculations.roi >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatPercent(calculations.roi)}
                    </p>
                  </div>
                  <Percent className="h-8 w-8 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

