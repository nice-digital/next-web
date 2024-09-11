import { useRouter } from "next/router";
import { useCallback } from "react";

export const useScrollToTarget = (
	scrollTargetId: string
): (() => void) => {
	const { events } = useRouter();

	const scrollToTarget = useCallback(
		() => {
			const targetElement = document.getElementById(scrollTargetId);

			if (targetElement) {
				targetElement.setAttribute("tabIndex", "-1");
				targetElement.focus();
				targetElement.scrollIntoView();
			} else {
				console.warn(`Element with id ${scrollTargetId} could not be found`);
			}

			events.off("routeChangeComplete", scrollToTarget);
		},
		[events, scrollTargetId]
	);

	return scrollToTarget;
};
