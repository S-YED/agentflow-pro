import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Handles equal distribution with remainder logic
export function distributeItems<T>(items: T[], agentCount: number = 5): T[][] {
  if (items.length === 0) return Array(agentCount).fill([])
  
  const baseCount = Math.floor(items.length / agentCount)
  const remainder = items.length % agentCount
  
  const distributions: T[][] = []
  let currentIndex = 0
  
  for (let i = 0; i < agentCount; i++) {
    const itemCount = baseCount + (i < remainder ? 1 : 0)
    distributions.push(items.slice(currentIndex, currentIndex + itemCount))
    currentIndex += itemCount
  }
  
  return distributions
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}