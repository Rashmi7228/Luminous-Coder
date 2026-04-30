import { Patient } from './db';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface RiskResult {
  level: RiskLevel;
  reasons: string[];
}

export function computeRisk(patient: Patient): RiskResult {
  const reasons: string[] = [];
  let level: RiskLevel = 'LOW';

  // HIGH risk conditions
  let isHigh = false;

  if (patient.pregnancyWeek !== null && patient.pregnancyWeek > 36) {
    reasons.push('Pregnancy week > 36');
    isHigh = true;
  }
  if (patient.tbSymptoms) {
    reasons.push('TB symptoms present');
    isHigh = true;
  }
  if (patient.bp) {
    if (patient.bp.systolic >= 140 || patient.bp.systolic <= 90 || patient.bp.diastolic >= 90 || patient.bp.diastolic <= 60) {
      reasons.push(`Abnormal BP (${patient.bp.systolic}/${patient.bp.diastolic})`);
      isHigh = true;
    }
  }
  if (patient.vaccinationStatus) {
    const missed = patient.vaccinationStatus.filter(v => !v.given).length;
    if (missed >= 2) {
      reasons.push(`${missed} missed vaccines`);
      isHigh = true;
    }
  }

  if (isHigh) {
    return { level: 'HIGH', reasons };
  }

  // MEDIUM risk conditions
  let isMedium = false;

  if (patient.pregnancyWeek !== null && patient.pregnancyWeek >= 28 && patient.pregnancyWeek <= 36) {
    reasons.push('3rd trimester pregnancy');
    isMedium = true;
  }
  if (patient.bp) {
    if ((patient.bp.systolic >= 130 && patient.bp.systolic <= 139) || (patient.bp.diastolic >= 85 && patient.bp.diastolic <= 89)) {
      reasons.push(`Slightly elevated BP (${patient.bp.systolic}/${patient.bp.diastolic})`);
      isMedium = true;
    }
  }
  if (patient.vaccinationStatus) {
    const missed = patient.vaccinationStatus.filter(v => !v.given).length;
    if (missed === 1) {
      reasons.push('1 missed vaccine');
      isMedium = true;
    }
  }

  if (isMedium) {
    return { level: 'MEDIUM', reasons };
  }

  return { level: 'LOW', reasons };
}
