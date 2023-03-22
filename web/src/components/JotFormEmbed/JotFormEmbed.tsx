import React, {
	CSSProperties,
	FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import styles from "./JotFormEmbed.module.scss";

type JotFormID = `${number}`;

interface JotFormEmbedProps {
	jotFormID: JotFormID;
	title: string;
	onSubmit?: () => void;
}

type JFMessageObject = {
	action: "submission-completed";
	formID: JotFormID;
};

type JFMessageName =
	| "scrollIntoView"
	| "setHeight"
	| "setMinHeight"
	| "collapseErrorPage"
	| "reloadPage"
	| "loadScript"
	| "exitFullscreen";

type JFMessageString = `${JFMessageName}:${number | ""}:${JotFormID}`;

type JFMessageEvent = MessageEvent<JFMessageObject | JFMessageString>;

const JotFormBaseURL = "https://nice.jotform.com";

export const JotFormEmbed: FC<JotFormEmbedProps> = ({
	jotFormID,
	title,
	onSubmit,
}) => {
	const iframeRef = useRef<HTMLIFrameElement>(null),
		[styleOverrides, setStyleOverrides] = useState<CSSProperties>({}),
		handleIFrameMessage = useCallback(
			(content?: JFMessageEvent) => {
				if (!iframeRef.current || !content || content.origin != JotFormBaseURL)
					return;

				const { data } = content;

				console.log({ data });

				// The form completion message is an object rather than a string like other messages so handle it first
				if (
					typeof data === "object" &&
					data.action === "submission-completed" &&
					onSubmit
				) {
					onSubmit();
					return;
				}

				// Ignore non-string messages as they should all be strings in the format like "setHeight:1577:230793530776059"
				if (typeof data !== "string") return;

				const messageParts = data.split(":"),
					[messageName, value, targetFormID] = messageParts,
					iframe = iframeRef.current;

				if (targetFormID !== jotFormID) return;

				switch (messageName as JFMessageName) {
					case "scrollIntoView":
						if (typeof iframe.scrollIntoView === "function") {
							iframe.scrollIntoView();
						}
						break;
					case "setHeight": {
						const minHeight = parseInt(value, 10);
						setStyleOverrides((s) => ({ ...s, minHeight }));
						break;
					}
					case "setMinHeight": {
						const minHeight = parseInt(value, 10);
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
			[jotFormID, onSubmit, iframeRef]
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
			id={`JotFormIFrame${jotFormID}`}
			ref={iframeRef}
			src={`${JotFormBaseURL}/${jotFormID}`}
			title={title}
			allowFullScreen
			allow="geolocation; microphone; camera"
			className={styles.iframe}
			style={styleOverrides}
		/>
	);
};
