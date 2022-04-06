//@ts-ignore
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

export function StateErrorBoundary({ children }: React.PropsWithChildren<{}>) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-danger text-light">
          Something went wrong displaying state data
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
