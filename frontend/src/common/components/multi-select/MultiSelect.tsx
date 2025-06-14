/*
 * Taken from the following sources:
 * https://github.com/sersavan/shadcn-multi-select-component
 */

import { CheckIcon, ChevronDown, XCircle, XIcon } from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { MultiSelectProps } from "./MultiSelect.types";
import { multiSelectVariants } from "./multiSelectVariants";

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  onValueChange,
  variant,
  value,
  defaultValue = [],
  placeholder = "Select options",
  maxCount = 3,
  modalPopover = false,
  asChild = false,
  className,
  ref,
  ...props
}) => {
  const [internalSelectedValues, setInternalSelectedValues] =
    useState<string[]>(defaultValue);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isControlled = value !== undefined && onValueChange !== undefined;
  const selectedValues = isControlled ? value! : internalSelectedValues;

  const setSelectedValues = (newValues: string[]) => {
    if (isControlled) {
      onValueChange(newValues);
    } else {
      setInternalSelectedValues(newValues);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsPopoverOpen(true);
    } else if (event.key === "Backspace" && !event.currentTarget.value) {
      const newSelectedValues = [...selectedValues];
      newSelectedValues.pop();
      setSelectedValues(newSelectedValues);
    }
  };

  const toggleOption = (option: string) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];
    setSelectedValues(newSelectedValues);
  };

  const handleClear = () => {
    setSelectedValues([]);
  };

  const handleTogglePopover = () => {
    setIsPopoverOpen((prev) => !prev);
  };

  const clearExtraOptions = () => {
    const newSelectedValues = selectedValues.slice(0, maxCount);
    setSelectedValues(newSelectedValues);
  };

  const toggleAll = () => {
    if (selectedValues.length === options.length) {
      handleClear();
    } else {
      const allValues = options.map((option) => option.value);
      setSelectedValues(allValues);
    }
  };

  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      modal={modalPopover}
    >
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          {...props}
          onClick={handleTogglePopover}
          className={cn(
            "flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between",
            "bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto",
            className,
          )}
        >
          {selectedValues.length > 0 ? (
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-wrap items-center">
                {selectedValues.slice(0, maxCount).map((value) => {
                  const option = options.find((o) => o.value === value);
                  const IconComponent = option?.icon;
                  return (
                    <Badge
                      key={value}
                      className={cn(
                        multiSelectVariants({ variant }),
                        "cursor-auto",
                      )}
                    >
                      {IconComponent && (
                        <IconComponent className="h-4 w-4 mr-2" />
                      )}
                      {option?.label}
                      <span
                        tabIndex={0}
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            toggleOption(value);
                          }
                        }}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleOption(value);
                        }}
                      >
                        <XCircle />
                      </span>
                    </Badge>
                  );
                })}
                {selectedValues.length > maxCount && (
                  <Badge
                    className={cn(
                      "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                      multiSelectVariants({ variant }),
                    )}
                  >
                    {`+ ${selectedValues.length - maxCount} more`}
                    <span
                      tabIndex={0}
                      className="ml-2 h-4 w-4 cursor-pointer"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          clearExtraOptions();
                        }
                      }}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        clearExtraOptions();
                      }}
                    >
                      <XCircle />
                    </span>
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span
                  tabIndex={0}
                  className="h-4 mx-2 text-muted-foreground cursor-pointer"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleClear();
                    }
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClear();
                  }}
                >
                  <XIcon />
                </span>
                <Separator
                  orientation="vertical"
                  className="flex min-h-6 h-full"
                />
                <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full mx-auto">
              <span className="text-sm text-muted-foreground mx-3">
                {placeholder}
              </span>
              <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
      >
        <Command>
          <CommandInput
            placeholder="Search..."
            onKeyDown={handleInputKeyDown}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="all"
                onSelect={toggleAll}
                className="cursor-pointer"
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                    "border-primary",
                    selectedValues.length === options.length
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible",
                  )}
                >
                  <CheckIcon className="h-4 w-4" />
                </div>
                <span>(Select All)</span>
              </CommandItem>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        "border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <div className="flex items-center justify-between">
                {selectedValues.length > 0 && (
                  <>
                    <CommandItem
                      onSelect={handleClear}
                      className="flex-1 justify-center cursor-pointer"
                    >
                      Clear
                    </CommandItem>
                    <Separator
                      orientation="vertical"
                      className="flex min-h-6 h-full"
                    />
                  </>
                )}
                <CommandItem
                  onSelect={() => setIsPopoverOpen(false)}
                  className="flex-1 justify-center cursor-pointer max-w-full"
                >
                  Close
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
