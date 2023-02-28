import { useRouter } from "next/router";
import { type FC } from "react";

import {
	HorizontalNav,
	HorizontalNavLink,
} from "@nice-digital/nds-horizontal-nav";

import { type Consultation } from "@/feeds/inDev/types";

import { ScrollToContentStartLink } from "../Link/Link";

export type ProjectHorizontalNavProps = {
	/** The nav label for the project overview */
	projectPath: string;
	hasDocuments: boolean;
	consultations: Consultation[];
};

export const ProjectHorizontalNav: FC<ProjectHorizontalNavProps> = ({
	projectPath,
	hasDocuments,
	consultations,
}) => {
	const { asPath } = useRouter(),
		path = asPath.replace(/#.*/, ""),
		documentsPath = `${projectPath}/documents`,
		isUnderDocuments = path.indexOf(documentsPath) === 0,
		consultationsPath = `${projectPath}/documents`,
		isUnderConsultations = path.indexOf(consultationsPath) === 0;

	return (
		<HorizontalNav>
			<HorizontalNavLink
				destination={projectPath}
				elementType={ScrollToContentStartLink}
				isCurrent={!isUnderDocuments && !isUnderConsultations}
			>
				Project Information
			</HorizontalNavLink>
			{hasDocuments ? (
				<HorizontalNavLink
					destination={`${projectPath}/documents`}
					elementType={ScrollToContentStartLink}
					isCurrent={isUnderDocuments}
				>
					Project Documents
				</HorizontalNavLink>
			) : null}

			{consultations.length >= 1 ? (
				<HorizontalNavLink
					destination={`${projectPath}/consultations`}
					elementType={ScrollToContentStartLink}
					isCurrent={false}
				>
					Consultation - TODO
				</HorizontalNavLink>
			) : null}
		</HorizontalNav>
	);
};
