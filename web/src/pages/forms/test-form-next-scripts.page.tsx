import Script from "next/script";
import React, { useState, useEffect } from "react";

const TestFormPage: React.FC = () => {
	const [htmlContent, setHtmlContent] = useState("");

	useEffect(() => {
		fetch("/jotforms/Interventional_procedures_notification_form.html")
			.then((response) => response.text())
			.then((html) => {
				setHtmlContent(html);
			});
	}, []);

	return (
		<>
			<Script
				src="/jotforms/js/test.js"
				strategy="lazyOnload"
				onLoad={() => console.log("test js loaded")}
			/>
			<div
				dangerouslySetInnerHTML={{
					__html: htmlContent,
				}}
			/>
		</>
	);
};

export default TestFormPage;
