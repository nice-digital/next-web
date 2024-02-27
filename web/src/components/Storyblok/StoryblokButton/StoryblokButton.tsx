import { Button, buttonVariants } from "@nice-digital/nds-button";

import { Link } from "@/components/Link/Link";
import { ButtonStoryblok, MultilinkStoryblok } from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

interface StoryblokButtonProps {
	button: ButtonStoryblok;
}

export const StoryblokButton: React.FC<StoryblokButtonProps> = ({
	button,
}: StoryblokButtonProps) => {
	const { text, link, variant } = button;

	// Resolve CTA & link
	let linkType,
		linkDestination = undefined;
	const resolvedLink = resolveStoryblokLink(link as MultilinkStoryblok);
	if (resolvedLink.url) {
		linkType = resolvedLink.isInternal ? Link : undefined;
		linkDestination = resolvedLink.isInternal
			? `/${resolvedLink.url}`
			: resolvedLink.url;
	} else {
		return undefined;
	}

	return (
		<Button
			variant={variant as keyof typeof buttonVariants}
			to={linkDestination}
			elementType={linkType}
			method="href"
		>
			{text}
		</Button>
	);
};
