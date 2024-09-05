import { useRouter } from "next/router";
import { useCallback } from "react";

export const useScrollToTarget = (
	scrollTargetId: string
): ((url: string) => void) => {
	const { events } = useRouter();

	const scrollToTarget = useCallback(
		(url: string) => {
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
