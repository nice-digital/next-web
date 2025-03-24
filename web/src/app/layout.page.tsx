import { Inter, Lora } from "next/font/google";
import Script from "next/script";

import { Container } from "@nice-digital/nds-container";

import FooterClient from "@/components/FooterClient/FooterClient";
import { GoogleTagManager } from "@/components/GoogleTagManager/GoogleTagManager";
import HeaderClient from "@/components/HeaderClient/HeaderClient";
import MainClient from "@/components/MainClient/MainClient";
import { publicRuntimeConfig } from "@/config";

import "../pages/_app.page.scss";
import { Suspense } from "react";

// export const metadata = {
//   title: 'Next.js',
//   description: 'Generated by Next.js',
// }

const inter = Inter({ subsets: ["latin"], variable: "--sans-font-family" });
const lora = Lora({ subsets: ["latin"], variable: "--serif-font-family" });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return (
		<html lang="en">
			<body className={`${lora.variable} ${inter.variable}`}>
				{/*
				Example to show it's possible to pass current config values from server components to client components
				as props.
			*/}
				<Suspense fallback="Loading...">
					<HeaderClient
						searchBasePath={publicRuntimeConfig.search.baseURL}
						authEnv={publicRuntimeConfig.authEnvironment}
					/>
				</Suspense>

				{/* <MainClient> */}
					<Container>{children}</Container>
				{/* </MainClient> */}
				<Suspense fallback="Loading footer...">
					<FooterClient />
				</Suspense>

				{/* <Script
					id="cookieBanner"
					src={publicRuntimeConfig.cookieBannerScriptURL}
					strategy="beforeInteractive"
				/>
				<GoogleTagManager /> */}
			</body>
		</html>
	);
}
