import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
  buttonClassName?: string
  popoverWidth?: string
  icon?: React.ReactNode
  groupLabel?: string
  searchPlaceholder?: string
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  emptyText = "No results found.",
  className,
  buttonClassName,
  popoverWidth = "w-[200px]",
  icon,
  groupLabel = "Options",
  searchPlaceholder = "Search...",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  
  const selectedOption = React.useMemo(() => 
    options.find((option) => option.value === value), 
    [options, value]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-white border-gray-200 hover:bg-gray-50 rounded-xl",
            buttonClassName
          )}
        >
          <div className="flex items-center gap-2">
            {icon && <span className="h-5 w-5">{icon}</span>}
            {selectedOption ? 
              <span className="flex items-center gap-2 text-sm">
                {selectedOption.icon && selectedOption.icon}
                {selectedOption.label}
              </span> 
              : 
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            }
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0 rounded-xl border-gray-200", popoverWidth)}>
        <Command className={cn("rounded-xl", className)}>
          <CommandInput 
            placeholder={searchPlaceholder}
            className="rounded-t-xl border-none focus:ring-0"
          />
          <CommandEmpty className="py-6 text-center text-sm">{emptyText}</CommandEmpty>
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandGroup heading={groupLabel} className="px-2 text-xs font-medium text-muted-foreground py-2">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className="flex items-center rounded-lg hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground my-1"
                >
                  {option.icon && (
                    <span className="mr-2">{option.icon}</span>
                  )}
                  <span className="text-sm">{option.label}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-primary",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 