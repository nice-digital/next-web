import { FC, ReactElement } from "react";

import {
	Breadcrumb,
	Breadcrumbs,
	type BreadcrumbsProps,
} from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { TaxonomyBreadcrumb } from "@/feeds/taxonomy/types";
import { getStatusBreadcrumb } from "@/utils/url";

export type appendArrayType = Pick<TaxonomyBreadcrumb, "title"> &
	Partial<Pick<TaxonomyBreadcrumb, "url">>;

export type GuidanceBreadcrumbProps = {
	append?: appendArrayType[];
	id: string;
	override?: ReactElement<BreadcrumbsProps>[];
	productPath: string;
	status?:
		| "published"
		| "terminated"
		| "inconsultation"
		| "indevelopment"
		| "deferred"
		| "awaiting-development"
		| "prioritisation";
	taxonomy?: TaxonomyBreadcrumb[];
	type: "guidance" | "indicators";
};

export const GuidanceBreadcrumb: FC<GuidanceBreadcrumbProps> = ({
	append = [],
	id,
	override,
	productPath,
	status,
	taxonomy = [],
	type,
}) => {
	const isGuidance = type === "guidance";
	const statusCheck = status
		? status
		: /gid-/.test(id)
		? "indevelopment"
		: undefined;
	const statusBreadcrumb = statusCheck
		? getStatusBreadcrumb(statusCheck, type)
		: undefined;

	let breadcrumbTrail;

	if (taxonomy.length > 0) {
		breadcrumbTrail = taxonomy.map(({ title, url }) => (
			<Breadcrumb key={title} to={url}>
				{title}
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

		if (statusBreadcrumb) {
			breadcrumbTrail.push(
				<Breadcrumb
					key={statusBreadcrumb.title.toLowerCase()}
					to={statusBreadcrumb.url}
					elementType={Link}
				>
					{statusBreadcrumb.title}
				</Breadcrumb>
			);
		}
	}

	if (append.length > 0) {
		breadcrumbTrail.push(
			<Breadcrumb key="product home page" to={productPath} elementType={Link}>
				{id}
			</Breadcrumb>
		);
		append.forEach(({ title, url }) => {
			breadcrumbTrail.push(
				<Breadcrumb
					key={title}
					to={url ? productPath + url : undefined}
					elementType={url ? Link : undefined}
				>
					{title}
				</Breadcrumb>
			);
		});
	} else {
		breadcrumbTrail.push(<Breadcrumb key="current page">{id}</Breadcrumb>);
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
				  ]}
		</Breadcrumbs>
	);
};
