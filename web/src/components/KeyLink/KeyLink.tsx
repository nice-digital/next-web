import { FC } from "react";

import { Link } from "@/components/Link/Link";

import { SubSections } from "src/pages/search.page";

export interface KeyLinkProps {
	parsedLinks: SubSections[];
}

export const KeyLink: FC<KeyLinkProps> = ({
	parsedLinks,
}: {
	parsedLinks: SubSections[];
}) => {
	const identifyKeyLink = (parsedLinks: SubSections[]) => {
		const qualityStatementsChapterLinkRegex =
			/\/chapter\/(?:list-of-quality-statements$|list-of-statements$|quality-statements$)/im;

		const recommendationsChapterLinkRegex =
			/\/chapter\/(?:recommendations|\d+-recommendations|\d+-guidance)$/im;

		const recLink = parsedLinks.find(function (el) {
			return recommendationsChapterLinkRegex.test(el.$.url);
		});

		const qsLink = parsedLinks.find(function (el) {
			return qualityStatementsChapterLinkRegex.test(el.$.url);
		});

		if (qsLink) return { text: "View quality statements", url: qsLink.$.url };
		if (recLink) return { text: "View recommendations", url: recLink.$.url };
		return false;
	};

	const linkObj = identifyKeyLink(parsedLinks);

	return linkObj ? (
		<Link to={linkObj.url}>
			<a>{linkObj.text}</a>
		</Link>
	) : null;
};
