import { useEffect, useRef } from "react";
import { Container } from "@nice-digital/nds-container";
import styles from "./customer-voice.module.scss";

declare global {
    interface Window {
        SurveyEmbed: {
            new (key: string, url: string, cdn: string, flag: string): {
                renderInline: (
                    containerId: string,
                    options: { [key: string]: string }
                ) => void;
            };
        };
    }
}

const SurveyFormOriginal = () => {
    const surveyContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Ensure the SurveyEmbed library is initialized when the component is mounted
        if (typeof window !== "undefined" && window.SurveyEmbed) {
            const se = new window.SurveyEmbed(
                "efQwYEKzLUel3XQP91ON6fIhpwsw1jRDoSJZSVZYegJUMjQ3M1laSE9TVThHMzFXRFE5NkJIV1Y4Ni4u",
                "https://customervoice.microsoft.com/",
                "https://mfpembedcdnweu.azureedge.net/mfpembedcontweu/",
                "true"
            );
            se.renderInline("survey-container", {
                "First Name": "John",
                "Last Name": "Doe",
                locale: "en-US",
            });
        }
    }, []);

    // Wait for iframe to be added to the DOM
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    const iframe = document.querySelector("iframe");
                    if (iframe) {
                        console.log("✅ Iframe detected:", iframe);
                        iframe.onload = () => {
                            console.log("✅ Iframe loaded!");
                            setTimeout(() => {
                                try {
                                    console.log("✅ Injecting custom CSS...");
                                    const styleTag = document.createElement("style");
                                    styleTag.innerHTML = `
                                        body { font-family: Arial, sans-serif !important; }
                                        .survey-container { background: green !important; }
                                        input {border: 10px solid red;}
                                    `;
                                    if (iframe.contentDocument) {
                                        iframe.contentDocument.head.appendChild(styleTag);
                                        console.log("✅ Style tag injected:", styleTag);

                                        // Use ResizeObserver to monitor changes in the iframe content size
                                        const resizeObserver = new ResizeObserver((entries) => {
                                            for (let entry of entries) {
                                                if (surveyContainerRef.current) {
                                                    surveyContainerRef.current.style.height = `${entry.contentRect.height}px`;
                                                }
                                            }
                                        });

                                        if (iframe.contentDocument.body) {
                                            resizeObserver.observe(iframe.contentDocument.body);
                                        }
                                    } else {
                                        console.warn("🚨 Unable to access iframe contentDocument.");
                                    }
                                } catch (error) {
                                    console.warn(
                                        "🚨 Unable to access iframe content due to cross-origin policy."
                                    );
                                }
                            }, 250); // Delay to ensure iframe content is fully loaded
                        };
                        // Stop observing once iframe is found
                        observer.disconnect();
                    }
                }
            });
        });

        // Observe changes to the entire document
        observer.observe(document.body, { childList: true, subtree: true });

        // Cleanup observer on unmount
        return () => observer.disconnect();
    }, []);

    // Listen for messages from the iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            console.log("📡 Message received:", event.data);
			console.log("📡 Message type:", event.data.type);
            if (event.data === "ResponsePageLoaded" && surveyContainerRef.current) {
                console.log("📏 Resizing survey container...");
                surveyContainerRef.current.style.height = `1500px`;
            }
        };

        window.addEventListener("message", handleMessage);

        // Cleanup event listener on unmount
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return <div id="survey-container" ref={surveyContainerRef} className={styles.surveyContainer} />;
};

const SurveyForm = () => {
    return (
        <iframe
            src="/api/proxy"
            width="100%"
            height="1000px"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
        />
    );
};

export default function CustomerVoiceTestForm(): JSX.Element {
    return (
        <Container>
            <SurveyFormOriginal />
        </Container>
    );
}
