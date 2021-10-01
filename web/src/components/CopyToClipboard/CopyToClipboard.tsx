import * as clipboard from "clipboard-polyfill";
import React, {
	FC,
	ReactNode,
	useCallback,
	useEffect,
	useState,
	MouseEvent,
} from "react";

import { Alert } from "@nice-digital/nds-alert";
import { Button } from "@nice-digital/nds-button";

import { useLogger } from "@/logger";

export interface CopyToClipboardProps {
	children: ReactNode;
	targetId: string;
}

export const CopyToClipboard: FC<CopyToClipboardProps> = ({
	children,
	targetId,
}) => {
	const logger = useLogger();

	const [canUseDOM, setCanUseDOM] = useState(false),
		[success, setSuccess] = useState<boolean | undefined>(undefined),
		// Bit hacky to use state rather than a ref for the button element
		// but currently nds-button doesn't forward refs
		[copyButtonElement, setCopyButtonElement] =
			useState<HTMLButtonElement | null>(null);

	useEffect(() => {
		setCanUseDOM(true);
	}, []);

	const copyClickHandler = useCallback(
		async (e: MouseEvent<HTMLButtonElement>) => {
			setCopyButtonElement(e.currentTarget);

			setSuccess(undefined);

			const el = document.getElementById(targetId);

			if (el) {
				const item = new clipboard.ClipboardItem({
					"text/html": new Blob([el.outerHTML], { type: "text/html" }),
					"text/plain": new Blob(["Paste into Excel to see the results"], {
						type: "text/plain",
					}),
				});
				try {
					await clipboard.write([item]);
					setSuccess(true);
				} catch (e) {
					logger.error(e as Error, "Error copying to clipboard");
					setSuccess(false);
				}
			} else {
				logger.error(
					`Couldn't copy to clipboard: couldn't find target element with id ${targetId}`
				);
				setSuccess(false);
			}
		},
		[targetId, logger]
	);

	const dismissClickHandler = useCallback(() => {
		setSuccess(undefined);

		// Restore focus back to the original copy button after dismissing:
		// helps screenreader/keyboard users know where they are within the document
		if (copyButtonElement) copyButtonElement.focus();
	}, [copyButtonElement]);

	return canUseDOM ? (
		<>
			<Button className="mt--d ml--0" onClick={copyClickHandler}>
				{children}
			</Button>
			{success === true ? (
				<Alert type="success">
					<p role="alert" aria-live="assertive" aria-atomic="true">
						Results copied to the clipboard, paste into excel to see the
						results.
					</p>
					<Button variant="secondary" onClick={dismissClickHandler}>
						Dismiss message
					</Button>
				</Alert>
			) : success === false ? (
				<Alert type="error">
					<p role="alert" aria-live="assertive" aria-atomic="true">
						Sorry, there was an error copying to the clipboard
					</p>
					<Button variant="inverse" onClick={dismissClickHandler}>
						Dismiss message
					</Button>
				</Alert>
			) : null}
		</>
	) : null;
};
