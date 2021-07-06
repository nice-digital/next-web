import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
	DocumentInitialProps,
} from "next/document";

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
			<Html lang="en-GB">
				<Head>
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link
						rel="preconnect"
						href="https://fonts.gstatic.com"
						crossOrigin="anonymous"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<body>
					<noscript>
						<iframe
							src="https://www.googletagmanager.com/ns.html?id=GTM-M55QTQ"
							height="0"
							width="0"
							style={{ display: "none" }}
						></iframe>
					</noscript>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default NextWebDocument;
