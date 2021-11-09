import { useEffect, FC } from "react";

export interface AnnounceProps {
	announcement: string;
}

export const Announcer: FC<AnnounceProps> = ({ announcement }) => {
	useEffect(() => {
		// Use NextJS's built in announcer div so we don't need to create our own
		const nextJSRouteAnnouncer = document.getElementById(
			"__next-route-announcer__"
		);
		if (!nextJSRouteAnnouncer?.hasAttribute("aria-atomic")) {
			nextJSRouteAnnouncer?.setAttribute("aria-atomic", "true");
		}

		if (nextJSRouteAnnouncer) {
			nextJSRouteAnnouncer.textContent = "";
			window.requestAnimationFrame((_timestamp) => {
				nextJSRouteAnnouncer.textContent = announcement;
			});
		}
	}, [announcement]);

	return null;
};
