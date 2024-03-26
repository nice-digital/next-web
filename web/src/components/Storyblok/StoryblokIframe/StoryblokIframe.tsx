import React, { IframeHTMLAttributes } from "react";

import { IframeStoryblok } from "@/types/storyblok";

export interface StoryblokIframeProps
	extends IframeHTMLAttributes<HTMLIFrameElement> {
	blok: IframeStoryblok;
}

export const StoryblokIframe = React.forwardRef<
	HTMLIFrameElement,
	StoryblokIframeProps
>(({ blok, ...rest }, ref) => {
	const { title, source } = blok;
	return <iframe ref={ref} title={title} src={source} {...rest}></iframe>;
});
