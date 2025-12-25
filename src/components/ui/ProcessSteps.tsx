interface ProcessStepsProps {
  currentStep: 1 | 2 | 3;
}

export default function ProcessSteps({ currentStep }: ProcessStepsProps) {
  const steps = [
    "Identifica tu situación",
    "Revisa requisitos",
    "Solicita cita",
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 mt-12 mb-20">
      <div className="flex items-center justify-between gap-6">
        {steps.map((label, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={label} className="flex-1 text-center">
              <div
                className={`mx-auto w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold
                  ${
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : isCompleted
                      ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
              >
                {stepNumber}
              </div>

              <p
                className={`mt-3 text-sm ${
                  isActive
                    ? "text-[var(--primary)] font-medium"
                    : "text-gray-500"
                }`}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
