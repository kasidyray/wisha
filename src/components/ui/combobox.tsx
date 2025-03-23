"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
  icon?: string
  category?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
}

export function Combobox({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Safely handle options - ensure it's always an array
  const safeOptions = Array.isArray(options) ? options : []

  // Group options by category if it exists
  const groupedOptions = safeOptions.reduce((acc, option) => {
    const category = option.category || "Uncategorized"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(option)
    return acc
  }, {} as Record<string, ComboboxOption[]>)

  // Sort categories with "Most Popular" first
  const sortedCategories = Object.keys(groupedOptions).sort((a, b) => {
    if (a === "Most Popular") return -1
    if (b === "Most Popular") return 1
    return a.localeCompare(b)
  })

  const selectedOption = safeOptions.find(option => option.value === value)

  // Filter the options based on search query
  const filteredCategories = searchQuery 
    ? sortedCategories.filter((category) => 
        groupedOptions[category].some((option) => 
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : sortedCategories

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedOption ? (
            <span className="flex items-center">
              {selectedOption.icon && <span className="mr-2">{selectedOption.icon}</span>}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="flex flex-col">
          <input
            className="flex h-11 w-full rounded-md bg-transparent py-3 px-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-b"
            placeholder="Search event type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="max-h-[300px] overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <div className="py-6 text-center text-sm">{emptyMessage}</div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category} className="overflow-hidden p-1 text-foreground">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {category}
                  </div>
                  {groupedOptions[category]
                    .filter((option) => 
                      !searchQuery || 
                      option.label.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                          value === option.value && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => {
                          onChange(option.value)
                          setOpen(false)
                        }}
                      >
                        <div className="flex items-center">
                          {option.icon && <span className="mr-2">{option.icon}</span>}
                          {option.label}
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                    ))}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 