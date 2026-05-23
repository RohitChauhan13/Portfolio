export const PROFESSIONAL_EXPERIENCE_START_DATE = "2025-05-21";
export const PROFESSIONAL_EXPERIENCE_START_LABEL = "May 21, 2025";

const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

export function getProfessionalExperienceYears(now = new Date()) {
  const start = new Date(`${PROFESSIONAL_EXPERIENCE_START_DATE}T00:00:00.000Z`);
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const elapsed = Math.max(0, today.getTime() - start.getTime());

  return Math.floor((elapsed / MS_PER_YEAR) * 10) / 10;
}

export function formatExperienceYears(years: number) {
  return Number.isInteger(years) ? String(years) : years.toFixed(1);
}

export function experienceYearUnit(yearsLabel: string) {
  return yearsLabel === "1" ? "year" : "years";
}
