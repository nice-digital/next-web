import React, {
	CSSProperties,
	FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

// import { publicRuntimeConfig } from "@/config";
import type { FormID } from "@/feeds/jotform/jotform";
import { logger } from "@/logger";

import styles from "./JotFormEmbed.module.scss";

// const jotFormBaseURL = publicRuntimeConfig.jotForm.baseURL;
const jotFormBaseURL = process.env.PUBLIC_JOTFORM_BASE_URL;

interface JotFormEmbedProps {
	jotFormID: FormID;
	title: string;
	/** An optional, initial height */
	height?: number;
	onSubmit?: () => void;
}

type JFMessageObject = {
	action: "submission-completed";
	formID: FormID;
};

type JFMessageName =
	| "scrollIntoView"
	| "setHeight"
	| "setMinHeight"
	| "collapseErrorPage"
	| "reloadPage"
	| "loadScript"
	| "exitFullscreen";

type JFMessageString = `${JFMessageName}:${number | ""}:${FormID}`;

type JFMessageEvent = MessageEvent<JFMessageObject | JFMessageString>;

export const JotFormEmbed: FC<JotFormEmbedProps> = ({
	jotFormID,
	title,
	height,
	onSubmit,
}) => {
	const iframeRef = useRef<HTMLIFrameElement>(null),
		[styleOverrides, setStyleOverrides] = useState<CSSProperties>({
			height: height ? `${height}px` : undefined,
		}),
		handleIFrameMessage = useCallback(
			(content?: JFMessageEvent) => {
				if (!iframeRef.current || !content || content.origin != jotFormBaseURL)
					return;

				const { data } = content;

				// The form completion message is an object rather than a string like other messages so handle it first
				if (
					typeof data === "object" &&
					data.action === "submission-completed"
				) {
					window.dataLayer.push({
						event: "Jotform Message",
						jf_type: "submit",
						jf_id: jotFormID,
						jf_title: title,
					});
					if (onSubmit) onSubmit();
					return;
				}

				// Ignore non-string messages as they should all be strings in the format like "setHeight:1577:230793530776059"
				if (typeof data !== "string") return;

				const messageParts = data.split(":"),
					[messageName, value, targetFormID] = messageParts,
					iframe = iframeRef.current;

				if (targetFormID !== jotFormID) {
					logger.warn(
						`Form with ID ${jotFormID} didn't match event with form ID ${targetFormID}`
					);
					return;
				}

				switch (messageName as JFMessageName) {
					case "scrollIntoView":
						if (typeof iframe.scrollIntoView === "function")
							iframe.scrollIntoView();
						// There's no 'page event' sent from JotForm for multi page forms,
						// but scrollIntoView is fired for pages so we use this as the closest thing to track pagination
						window.dataLayer.push({
							event: "Jotform Message",
							jf_type: "progress",
							jf_id: jotFormID,
							jf_title: title,
						});
						break;
					case "setHeight": {
						const height = parseInt(value, 10) + "px";
						setStyleOverrides((s) => ({ ...s, height }));
						break;
					}
					case "setMinHeight": {
						const minHeight = parseInt(value, 10) + "px";
						setStyleOverrides((s) => ({ ...s, minHeight }));
						break;
					}
					case "reloadPage":
						if (iframe.contentWindow) {
							try {
								iframe.contentWindow.location.reload();
							} catch (e) {
								window.location.reload();
							}
						} else window.location.reload();
						break;
					case "collapseErrorPage":
						if (iframe.clientHeight > window.innerHeight) {
							iframe.style.height = window.innerHeight + "px";
						}
						break;
					case "exitFullscreen":
						if (window.document.exitFullscreen)
							window.document.exitFullscreen();
						break;
					case "loadScript": {
						let src = value;
						if (messageParts.length > 3) {
							src = value + ":" + messageParts[2];
						}

						const script = document.createElement("script");
						script.src = src;
						script.type = "text/javascript";
						document.body.appendChild(script);
						break;
					}
					default:
						break;
				}

				if (iframe.contentWindow && iframe.contentWindow.postMessage) {
					const urls = {
						docurl: encodeURIComponent(global.document.URL),
						referrer: encodeURIComponent(global.document.referrer),
					};
					iframe.contentWindow.postMessage(
						JSON.stringify({ type: "urls", value: urls }),
						"*"
					);
				}
			},
			[jotFormID, onSubmit, iframeRef, title]
		);

	useEffect(() => {
		window.addEventListener("message", handleIFrameMessage, false);

		return () =>
			window.removeEventListener("message", handleIFrameMessage, false);
	}, [handleIFrameMessage]);

	useEffect(() => {
		// Only hide the iframe scroll bar once JS has kicked in and we know we can respond to the setHeight message
		setStyleOverrides((s) => ({ ...s, overflow: "hidden" }));
	}, []);

	return (
		<iframe
			id={`JotFormIFrame-${jotFormID}`}
			data-jotform-id={jotFormID}
			ref={iframeRef}
			src={`${jotFormBaseURL}/${jotFormID}?isIframeEmbed=1`}
			title={title}
			allowFullScreen
			allow="geolocation; microphone; camera"
			className={styles.iframe}
			style={styleOverrides}
			//deprecated scrolling attr to prevent iframe scrollbar flickering on validation
			// eslint-disable-next-line react/iframe-missing-sandbox
			scrolling="no"
		/>
	);
};
