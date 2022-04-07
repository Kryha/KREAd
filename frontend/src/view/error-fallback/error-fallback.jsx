import React from "react";

import { ErrorView } from "../error-view";

export const ErrorFallback = ({ resetErrorBoundary }) => <ErrorView onButtonClick={resetErrorBoundary} />;
