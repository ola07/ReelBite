/** Format deadline as countdown: "3d 12h left" or "Ended" */
export function formatDeadline(deadline: string | null): string {
  if (!deadline) return "No deadline";
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h left`;
  const mins = Math.floor(diff / (1000 * 60));
  return `${mins}m left`;
}

/** Format budget for display: "$500" or "$50/video" */
export function formatBudget(amount: number, type: "deal" | "contest"): string {
  return type === "deal"
    ? `$${amount.toFixed(0)}/video`
    : `$${amount.toFixed(0)} prize pool`;
}

/** Calculate platform fee (15%) */
export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * 0.15 * 100) / 100;
}

/** Calculate creator payout (85%) */
export function calculateCreatorPayout(amount: number): number {
  return Math.round(amount * 0.85 * 100) / 100;
}

/** Get status color */
export function getStatusColor(status: string): string {
  switch (status) {
    case "active": return "#10B981";
    case "pending": return "#F59E0B";
    case "approved":
    case "published":
    case "completed": return "#10B981";
    case "declined":
    case "failed":
    case "cancelled": return "#EF4444";
    case "revision_requested": return "#F59E0B";
    case "processing": return "#3B82F6";
    case "draft":
    case "paused":
    default: return "#6B7280";
  }
}

/** Campaign type badge color */
export function getCampaignTypeColor(type: "deal" | "contest"): string {
  return type === "deal" ? "#3B82F6" : "#F59E0B";
}
