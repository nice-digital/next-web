import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
	DocumentInitialProps,
} from "next/document";
import Script from "next/script";

// import { publicRuntimeConfig } from "@/config";

export type NextWebDocumentProps = Record<string, never>;
interface ExtendedDocumentInitialProps extends DocumentInitialProps {
	PUBLIC_COOKIE_BANNER_SCRIPT_URL?: string;
}

class NextWebDocument extends Document<NextWebDocumentProps> {
	static async getInitialProps(
		ctx: DocumentContext
	): Promise<ExtendedDocumentInitialProps> {
		const initialProps = await Document.getInitialProps(ctx);
		const PUBLIC_COOKIE_BANNER_SCRIPT_URL =
			process.env.PUBLIC_COOKIE_BANNER_SCRIPT_URL;
		return { ...initialProps, PUBLIC_COOKIE_BANNER_SCRIPT_URL };
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
						// src={publicRuntimeConfig.cookieBannerScriptURL}
						src={this.props.PUBLIC_COOKIE_BANNER_SCRIPT_URL}
						strategy="beforeInteractive"
					/>
				</body>
			</Html>
		);
	}
}

export default NextWebDocument;
