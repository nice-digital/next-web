import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
	DocumentInitialProps,
} from "next/document";
import Script from "next/script";

import { publicRuntimeConfig } from "@/config";

export type NextWebDocumentProps = Record<string, never>;

class NextWebDocument extends Document<NextWebDocumentProps> {
	static async getInitialProps(
		ctx: DocumentContext
	): Promise<DocumentInitialProps> {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render(): JSX.Element {
		return (
			<Html lang="en-GB" prefix="og: http://ogp.me/ns#">
				<Head>
					{/* Note: The 2 google font preconnects are set in the global Link header. See LINK ./../../next.config.js#font-preconnects */}
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Lora:ital,wght@0,600;1,600&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
					<Script
						src={publicRuntimeConfig.cookieBannerScriptURL}
						strategy="beforeInteractive"
					/>
				</body>
			</Html>
		);
	}
}

export default NextWebDocument;
