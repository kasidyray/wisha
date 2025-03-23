"use client";

import * as React from "react";
import { cn } from '@/lib/utils';
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { createContext, useContext } from "react";

// Types
type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: "horizontal" | "vertical";
};

type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

type StepState = "active" | "completed" | "inactive" | "loading";

type StepperStep = {
  id: string | number;
  title: string;
  description?: string;
  optional?: boolean;
  completed?: boolean;
};

// Contexts
const StepperContext = createContext<StepperContextValue | undefined>(undefined);
const StepItemContext = createContext<StepItemContextValue | undefined>(undefined);

const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
};

const useStepItem = () => {
  const context = useContext(StepItemContext);
  if (!context) {
    throw new Error("useStepItem must be used within a StepperItem");
  }
  return context;
};

// Components
interface AirbnbStepperProps {
  steps: StepperStep[];
  activeStep: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Stepper = ({
  steps,
  activeStep,
  className,
  orientation = 'horizontal',
}: AirbnbStepperProps) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'flex-row items-center' : 'flex-col gap-6',
        className
      )}
    >
      {steps.map((step, index) => {
        const isActive = activeStep === index;
        const isCompleted = step.completed || index < activeStep;
        const isLastStep = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                'flex flex-col',
                isHorizontal && 'items-center'
              )}
            >
              <div className="flex items-center">
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full transition-all duration-200',
                    'w-10 h-10 text-sm font-medium shadow-sm',
                    isCompleted
                      ? 'bg-[#FF385C] text-white'
                      : isActive
                      ? 'border-2 border-[#FF385C] text-[#FF385C] bg-white'
                      : 'bg-gray-100 text-gray-400'
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {!isHorizontal && (
                  <div className="ml-4">
                    <div
                      className={cn(
                        'font-medium',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {isHorizontal && (
                <div
                  className={cn(
                    'mt-2 text-center',
                    isActive ? 'text-[#FF385C] font-medium' : 'text-gray-500'
                  )}
                >
                  {step.title}
                </div>
              )}
            </div>
            {!isLastStep && (
              <div
                className={cn(
                  'transition-colors duration-200',
                  isHorizontal 
                    ? 'flex-1 h-1 mx-2 rounded-full' 
                    : 'ml-5 mt-1 h-[calc(100%-24px)] w-0.5',
                  index < activeStep 
                    ? 'bg-[#FF385C]' 
                    : 'bg-gray-200'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// StepperItem
interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper();

  const state: StepState =
    completed || step < activeStep ? "completed" : activeStep === step ? "active" : "inactive";

  const isLoading = loading && step === activeStep;

  return (
    <StepItemContext.Provider value={{ step, state, isDisabled: disabled, isLoading }}>
      <div
        data-slot="stepper-item"
        className={cn(
          "group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col",
          className,
        )}
        data-state={state}
        {...(isLoading ? { "data-loading": true } : {})}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  );
}

// StepperTrigger
interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function StepperTrigger({ asChild = false, className, children, ...props }: StepperTriggerProps) {
  const { setActiveStep } = useStepper();
  const { step, isDisabled } = useStepItem();

  if (asChild) {
    return (
      <span data-slot="stepper-trigger" className={className}>
        {children}
      </span>
    );
  }

  return (
    <button
      data-slot="stepper-trigger"
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center gap-3 rounded-full outline-none focus-visible:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      onClick={() => setActiveStep(step)}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
}

// StepperIndicator
interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

function StepperIndicator({
  asChild = false,
  className,
  children,
  ...props
}: StepperIndicatorProps) {
  const { state, step, isLoading } = useStepItem();

  return (
    <span
      data-slot="stepper-indicator"
      className={cn(
        "bg-muted text-muted-foreground data-[state=active]:bg-primary data-[state=completed]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:text-primary-foreground relative flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
        className,
      )}
      data-state={state}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <span className="transition-all group-data-loading/step:scale-0 group-data-loading/step:opacity-0 group-data-loading/step:transition-none group-data-[state=completed]/step:scale-0 group-data-[state=completed]/step:opacity-0">
            {step}
          </span>
          <CheckIcon
            className="absolute scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100"
            size={16}
            aria-hidden="true"
          />
          {isLoading && (
            <span className="absolute transition-all">
              <LoaderCircleIcon className="animate-spin" size={14} aria-hidden="true" />
            </span>
          )}
        </>
      )}
    </span>
  );
}

// StepperTitle
function StepperTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 data-slot="stepper-title" className={cn("text-sm font-medium", className)} {...props} />
  );
}

// StepperDescription
function StepperDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="stepper-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

// StepperSeparator
function StepperSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="stepper-separator"
      className={cn(
        "bg-muted group-data-[state=completed]/step:bg-primary m-0.5 group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=horizontal]/stepper:flex-1 group-data-[orientation=vertical]/stepper:h-12 group-data-[orientation=vertical]/stepper:w-0.5",
        className,
      )}
      {...props}
    />
  );
}

export {
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
};
