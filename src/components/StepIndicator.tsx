import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-border z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: "0%" }}
            animate={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <motion.div
              key={step.id}
              className="flex flex-col items-center relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Step Circle */}
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shadow-soft border-2 transition-all duration-300",
                  isCompleted && "bg-success border-success text-success-foreground",
                  isCurrent && "bg-primary border-primary text-primary-foreground shadow-glow",
                  isUpcoming && "bg-card border-border text-muted-foreground"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </motion.div>

              {/* Step Info */}
              <div className="mt-3 text-center max-w-24">
                <motion.h3
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    (isCurrent || isCompleted) && "text-foreground",
                    isUpcoming && "text-muted-foreground"
                  )}
                  animate={{
                    color: isCurrent ? "hsl(var(--primary))" : undefined
                  }}
                >
                  {step.title}
                </motion.h3>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}