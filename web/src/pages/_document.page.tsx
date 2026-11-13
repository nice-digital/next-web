import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
	DocumentInitialProps,
} from "next/document";
import Script from "next/script";

import { AwsWafPreconnect } from "@/components/AwsWafPreconnect/AwsWafPreconnect";
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
					<AwsWafPreconnect />
				</Head>
				<body>
					<Main />
					<NextScript />
					{/* Deliberately before the cookie banner: the WAF SDK has to be in place before anything
					else makes a request, see docs/aws-waf-ddos-mitigation.md. It's written out in full here,
					rather than tucked away in a component, because NextJS only hoists `beforeInteractive`
					scripts that are direct children of Head or body - wrap one and it renders nothing at all */}
					{publicRuntimeConfig.awsWaf.scriptURL && (
						<Script
							id="awsWafIntegration"
							src={publicRuntimeConfig.awsWaf.scriptURL}
							strategy="beforeInteractive"
						/>
					)}
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
