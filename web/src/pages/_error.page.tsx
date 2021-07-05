import { NextPageContext } from "next";

import { logger } from "@/logger";
import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";

interface ErrorComponentProps {
	statusCode?: number;
}

// Note: 404's are handled in LINK ./404.page.tsx
function ErrorComponent(_props: ErrorComponentProps): JSX.Element {
	return <ErrorPageContent />;
}

ErrorComponent.getInitialProps = ({ res, err }: NextPageContext) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

	// Global server-side error logging
	if (res && err) logger.error(err, err.message);

	return { statusCode };
};

export default ErrorComponent;
