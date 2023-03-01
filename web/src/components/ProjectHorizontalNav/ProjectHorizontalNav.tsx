import { useRouter } from "next/router";
import { type FC } from "react";

import {
	HorizontalNav,
	HorizontalNavLink,
} from "@nice-digital/nds-horizontal-nav";

import { ScrollToContentStartLink } from "../Link/Link";

export type ProjectHorizontalNavProps = {
	/** The nav label for the project overview */
	projectPath: string;
	hasDocuments: boolean;
	consultationUrls?: string[];
};

export const ProjectHorizontalNav: FC<ProjectHorizontalNavProps> = ({
	projectPath,
	hasDocuments,
	consultationUrls,
}) => {
	const { asPath } = useRouter(),
		path = asPath.replace(/#.*/, ""),
		documentsPath = `${projectPath}/documents`,
		isUnderDocuments = path.indexOf(documentsPath) === 0,
		consultationsPath = `${projectPath}/consultations`,
		isUnderConsultations = path.indexOf(consultationsPath) === 0,
		slug = path.split("/").pop(),
		isUnderSlug = path.indexOf(slug as string) === 0;

	return (
		<>
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

				{consultationUrls && consultationUrls.length >= 1
					? consultationUrls.map((url, index) => (
							<HorizontalNavLink
								destination={url}
								elementType={ScrollToContentStartLink}
								isCurrent={path.split("/").pop() === url.split("/").pop()}
								key={`consultationLink_${index}`}
							>
								{consultationUrls.length > 1
									? `Consultation ${index + 1}`
									: "Consulation"}
							</HorizontalNavLink>
					  ))
					: null}
			</HorizontalNav>
		</>
	);
};
