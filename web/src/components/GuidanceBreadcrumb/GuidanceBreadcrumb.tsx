import { FC, ReactElement } from "react";

import {
	Breadcrumb,
	Breadcrumbs,
	type BreadcrumbsProps,
} from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { TaxonomyBreadcrumb } from "@/feeds/taxonomy/types";

export interface GuidanceBreadcrumbProps {
	id: string;
	override?: ReactElement<BreadcrumbsProps>[];
	taxonomy?: TaxonomyBreadcrumb[];
	type: "guidance" | "indicators";
}

export const GuidanceBreadcrumb: FC<GuidanceBreadcrumbProps> = ({
	id,
	override,
	taxonomy = [],
	type,
}) => {
	const isGuidance = type === "guidance";
	const isIndev = /gid-/.test(id);
	let breadcrumbTrail;

	if (taxonomy.length > 0) {
		breadcrumbTrail = taxonomy.map((crumb) => (
			<Breadcrumb key={crumb.title} to={crumb.url}>
				{crumb.title}
			</Breadcrumb>
		));
	} else {
		breadcrumbTrail = [
			<Breadcrumb
				key={type}
				to={
					isGuidance
						? "/guidance"
						: "/what-nice-does/standards-and-indicators/indicators"
				}
				elementType={Link}
			>
				{isGuidance ? "NICE guidance" : "Indicators"}
			</Breadcrumb>,
		];

		if (isIndev) {
			breadcrumbTrail.push(
				<Breadcrumb
					key="in development"
					to={`/${type}/indevelopment`}
					elementType={Link}
				>
					In development
				</Breadcrumb>
			);
		}
	}

	return (
		<Breadcrumbs>
			{override
				? [...override]
				: [
						<Breadcrumb key="home" to="/" elementType={Link}>
							Home
						</Breadcrumb>,
						...breadcrumbTrail,
						<Breadcrumb key="current page">{id}</Breadcrumb>,
				  ]}
		</Breadcrumbs>
	);
};
