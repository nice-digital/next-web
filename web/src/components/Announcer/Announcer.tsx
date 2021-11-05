import { useEffect, FC, useRef } from "react";

export interface AnnounceProps {
	announcement: string;
}

export const Announcer: FC<AnnounceProps> = ({ announcement }) => {
	function usePrevious(value) {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		});
		return ref.current;
	}

	const previousAnnouncement = usePrevious(announcement);

	useEffect(() => {
		// Use NextJS's built in announcer div so we don't need to create our own
		const nextJSRouteAnnouncer = document.getElementById(
			"__next-route-announcer__"
		);
		if (nextJSRouteAnnouncer?.hasAttribute("aria-atomic") !== true) {
			nextJSRouteAnnouncer?.setAttribute("aria-atomic", "true");
		}
		let checkedAnnouncement = "";
		if (nextJSRouteAnnouncer && announcement == previousAnnouncement) {
			console.log("it's the same", announcement, " ", previousAnnouncement);
			// const randomNumber = Math.floor(Math.random() * 101).toString();
			// checkedAnnouncement = announcement + randomNumber;
			checkedAnnouncement = announcement;
		} else {
			console.log("it's different", announcement, " ", previousAnnouncement);
			checkedAnnouncement = announcement;
		}

		if (nextJSRouteAnnouncer) {
			nextJSRouteAnnouncer.textContent = "";
			window.requestAnimationFrame((_timestamp) => {
				nextJSRouteAnnouncer.textContent = checkedAnnouncement;
			});
		}
	});

	return null;
};
