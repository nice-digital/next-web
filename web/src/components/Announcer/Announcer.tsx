import { useEffect, FC } from "react";
import { isNoSubstitutionTemplateLiteral } from "typescript";

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

		const appendSpaces = () => {
			let stringToAppend = "";
			let counter = 0;
			const randomNumber = Math.floor(Math.random() * 25);
			while (counter < randomNumber) {
				counter++;
				stringToAppend += "\xa0";
			}
			return stringToAppend;
		};

		if (nextJSRouteAnnouncer) {
			nextJSRouteAnnouncer.textContent = "";
			window.requestAnimationFrame((_timestamp) => {
				nextJSRouteAnnouncer.textContent = announcement + appendSpaces();
			});
		}
	});

	return null;
};
