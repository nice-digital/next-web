import { type FC } from "react";

import { PageHeader } from "@nice-digital/nds-page-header";

import { IndevSchedule, ProjectStatus } from "@/feeds/inDev/types";
import { formatDateStr } from "@/utils/datetime";

import { Link } from "../Link/Link";

export type ProjectPageHeadingProps = {
	project: {
		reference: string;
		title: string;
		status: string;
		indevRegisterAnInterestLink: string | null;
		indevScheduleItems?: IndevSchedule[];
		indevStakeholderRegistration?: Record<string, unknown>[];
	};
	children?: never;
};

export const ProjectPageHeading: FC<ProjectPageHeadingProps> = ({
	project: {
		reference,
		title,
		status,
		indevRegisterAnInterestLink,
		indevScheduleItems,
		indevStakeholderRegistration,
	},
}) => {
	const expectedPublicationInfo = indevScheduleItems?.find(
			(item) => item.column1 === "Expected publication"
		),
		publicationMeta = expectedPublicationInfo ? (
			<>
				<span>Expected publication date</span>{" "}
				<time dateTime={expectedPublicationInfo.column2}>
					{formatDateStr(expectedPublicationInfo.column2)}
				</time>
			</>
		) : status != "Discontinued" ? (
			"Expected publication date: TBC"
		) : null;

	//TODO stakeholder reg link e.g. https://alpha.nice.org.uk/get-involved/stakeholder-registration/register?t=&p=GID-IPG10305&returnUrl=/guidance/indevelopment/gid-ipg10305
	//TODO hardcoded 'Register an interest' link logic and querystring params - e.g. https://alpha.nice.org.uk/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest?t=0&p=GID-IPG10305&returnUrl=/guidance/indevelopment/gid-ipg10305

	// .NET example:-
	// 	private static string REGISTER_AN_INTEREST_LINK_FORMAT =
	// 	"/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest?t={0}&p={1}&returnUrl={2}";

	// public string Link { get; set; }

	// private RegisterAnInterestLinkViewModel(ProductFeed product, string returnUrl)
	// {
	// 	if (product == null || !product.ProductType.Is(ProductTypeExtension.IPG) || product.ProductStatus.IsWithdrawn())
	// 		return;
	// 	Link = string.Format(REGISTER_AN_INTEREST_LINK_FORMAT, 0, product.Id, returnUrl);
	// }

	// public RegisterAnInterestLinkViewModel(InDevProduct project, string returnUrl)
	// {
	// 	if (project == null || !project.ProductType.Is(ProductTypeExtension.IPG) || project.Status.IsDiscontinued())
	// 		return;
	// 	Link = string.Format(REGISTER_AN_INTEREST_LINK_FORMAT, 0, project.Reference, returnUrl);
	// }

	// public static RegisterAnInterestLinkViewModel Build(ProductFeed product, string returnUrl)
	//     {
	//         return new RegisterAnInterestLinkViewModel(product, returnUrl);
	//     }

	//     public static RegisterAnInterestLinkViewModel BuildForIndev(InDevProduct product, string returnUrl)
	//     {
	//         return new RegisterAnInterestLinkViewModel(product, returnUrl);
	//     }

	//TODO does it need to be aware of the productFeed? product status?
	//TODO Martin says discontinued/suspended means isWithdrawn().
	//TODO link should always start with this hardcoded "/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest"
	// condition 1: if productIsNull OR product.productType NOT "IPG" OR product.productStatus == isWithdrawn() THEN show the register an interest link with querystring ?t=0&p=[product.Id]&returnUrl[returnUrl]
	// condition 2: if projectIsNull OR project.productType NOT "IPG" OR project.Status == isDiscontinued() THEN show the register an interest link with querystring ?t=0&p=[project.Reference]&returnUrl[returnUrl]

	// public static bool IsWithdrawn(this string status)
	// {
	// 	return string.Equals(status, "Withdrawn", StringComparison.OrdinalIgnoreCase);
	// }

	// public static bool IsDiscontinued(this string status)
	// {
	// 	return string.Equals(status, GuidanceConstants.IndevDiscontinuedStatus, StringComparison.OrdinalIgnoreCase);
	// }
	// TODO: if projectIsNull OR project.productType NOT "IPG" OR project.Status == isDiscontinued() THEN show the register an interest link with querystring ?t=0&p=[project.Reference]&returnUrl[returnUrl]

	return (
		<PageHeader
			heading={title}
			useAltHeading
			id="content-start"
			metadata={[
				status != "Discontinued"
					? `In development ${reference}`
					: `Discontinued ${reference}`,
				publicationMeta,
				indevRegisterAnInterestLink ? (
					<Link to="/indevRegLink">Register an interest</Link>
				) : null,
				//TODO stakeholder link query string ? e.g. http://www.nice.org.uk/get-involved/stakeholder-registration/register?t=&p=GID-QS10164&returnUrl=/guidance/indevelopment/gid-qs10164
				//TODO is there a better way of constructing the returnUrl param?
				indevStakeholderRegistration &&
				indevStakeholderRegistration.length > 0 ? (
					<Link
						to={
							(indevStakeholderRegistration[0].href +
								`?t=&p=${reference}&returnUrl=/indicators/indevelopment/${reference}`) as string
						}
					>
						Register as a stakeholder
					</Link>
				) : null,
			].filter(Boolean)}
		/>
	);
};
