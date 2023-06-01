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
				<Head />
				<body>
					<Main />
					<NextScript />
					<Script
						id="cookieBanner"
						src={publicRuntimeConfig.cookieBannerScriptURL}
						strategy="beforeInteractive"
					/>
				</body>
			</Html>
		);
	}
}

export default NextWebDocument;
