import { ReactChild } from "react";

import {
	SearchResults,
	SearchUrl,
	SortOrder,
	Document,
} from "@nice-digital/search-client";

export interface ActiveModifier {
	displayName: string;
	toggleUrl: string;
}

export interface GuidanceListPageDataProps {
	results: SearchResults;
	activeModifiers: ActiveModifier[];
	searchUrl: SearchUrl;
}

export type GuidanceListPageProps = GuidanceListPageDataProps & {
	metaDescription: string;
	breadcrumb: ReactChild;
	preheading: ReactChild;
	heading: ReactChild;
	title: string;
	defaultSort: {
		order: SortOrder;
		label: string;
	};
	secondarySort?: {
		order: SortOrder;
		label: string;
	};
	showDateFilter: boolean;
	dateFilterLabel?: string;
	useFutureDates?: boolean;
	tableBodyRender: (documents: Document[]) => JSX.Element;
} & (
		| { showDateFilter: true; dateFilterLabel: string; useFutureDates: boolean }
		| {
				showDateFilter: false;
		  }
	);
