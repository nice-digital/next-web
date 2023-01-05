import { type FC } from "react";

import { PageHeader } from "@nice-digital/nds-page-header";

import { IndevSchedule } from "@/feeds/inDev/types";
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
	// TODO: if projectIsNull OR project.productType NOT "IPG" OR project.Status == isDiscontinued() DONT show the register an interest link with querystring ?t=0&p=[project.Reference]&returnUrl[returnUrl]

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
					<Link
						to={`/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest?t=0&p=${reference}&returnUrl=/guidance/indevelopment/${reference}`}
					>
						Register an interest
					</Link>
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
