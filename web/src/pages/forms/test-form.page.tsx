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
				src="/jotforms/js/vendor/smoothscroll.min.js"
				strategy="lazyOnload"
				onLoad={() => console.log("vendor smoothscroll loaded")}
			/>
			<Script
				src="/jotforms/js/vendor/imageinfo.js"
				strategy="lazyOnload"
				onLoad={() => console.log("imageinfo loaded")}
			/>
			<Script
				src="/jotforms/js/errorNavigation.js"
				strategy="lazyOnload"
				onLoad={() => console.log("error navigation loaded")}
			/>
			<Script
				src="/jotforms/js/prototype.forms.js"
				strategy="lazyOnload"
				onLoad={() => console.log("prototype.forms loaded")}
			/>
			<Script
				src="/jotforms/js/jotform.forms.js"
				strategy="lazyOnload"
				onLoad={() => console.log("jotform.forms loaded")}
			/>
			<Script
				src="/jotforms/js/punycode.js"
				strategy="lazyOnload"
				onLoad={() => console.log("punycode loaded")}
			/>
			<Script
				src="/jotforms/js/fileuploader.js"
				strategy="lazyOnload"
				onLoad={() => console.log("fileuploader loaded")}
			/>
			{/* <Script
				src="/jotforms/js/validgateways.js"
				strategy="lazyOnload"
				onLoad={() => console.log("validgateways loaded")}
			/> */}
			<Script
				src="/jotforms/js/jotformscript1.js"
				strategy="lazyOnload"
				onLoad={() => console.log("jotformscript1 loaded")}
			/>
			{/* <Script
				src="/jotforms/js/for-formuser.js"
				strategy="beforeInteractive"
				onLoad={() => console.log("for-formuser loaded")}
			/> */}
			<Script
				src="https://nice.jotform.com/s/umd/2e050c55582/for-formuser.js"
				strategy="lazyOnload"
				onLoad={() => console.log("for-formuser loaded")}
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
