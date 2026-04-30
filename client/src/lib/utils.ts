import { OrgType, QueueStatus } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: QueueStatus) {
  switch (status) {

    case "waiting":
      return "bg-blue-100 text-blue-800 border-blue-200"

    case "in_progress":
      return "bg-purple-100 text-purple-800 border-purple-200"

    case "completed":
      return "bg-green-100 text-green-800 border-green-200"

    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"

    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function getStatusLabel(status: QueueStatus) {
  switch (status) {

    case "waiting":
      return "Waiting"

    case "in_progress":
      return "In Progress"

    case "completed":
      return "Completed"

    case "cancelled":
      return "Cancelled"

    default:
      return "Unknown"
  }
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const past = new Date(date)

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"

  const minutes = Math.floor(diffInSeconds / 60)
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`

  const years = Math.floor(days / 365)
  return `${years} year${years > 1 ? "s" : ""} ago`
}

import {
  Hospital,
  Banknote,
  Briefcase,
  Stethoscope,
  type LucideIcon,
} from "lucide-react"


export function getOrgTypeIcon(type: OrgType): LucideIcon {
  switch (type) {
    case "hospital":
      return Hospital

    case "bank":
      return Banknote

    case "office":
      return Briefcase

    case "clinic":
      return Stethoscope

    default: {
      const _exhaustiveCheck: never = type
      return _exhaustiveCheck
    }
  }
}
export function formatDuration(
  input: number,
  unit: "seconds" | "milliseconds" = "seconds"
): string {
  const totalSeconds =
    unit === "milliseconds" ? Math.floor(input / 1000) : input

  if (!totalSeconds || totalSeconds < 0) return "0s"

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts: string[] = []

  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)

  return parts.join(" ")
}


export function getInitials(name?: string): string {
  if (!name || typeof name !== "string") return ""

  const parts = name
    .trim()
    .split(" ")
    .filter(Boolean)

  if (parts.length === 0) return ""
  if (parts.length === 1) {
    return parts[0][0].toUpperCase()
  }
  const first = parts[0][0]
  const last = parts[parts.length - 1][0]

  return (first + last).toUpperCase()
}