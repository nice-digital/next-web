import { Inter, Lora } from "next/font/google";

import "@nice-digital/design-system/scss/base.scss";

const inter = Inter({
	subsets: ["latin"],
	variable: "--sans-font-family",
});

const lora = Lora({
	subsets: ["latin"],
	variable: "--serif-font-family",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement {
	return (
		<html lang="en">
			<body className={`${lora.variable} ${inter.variable}`}>
				<p>Shared root layout..</p>
				{children}
			</body>
		</html>
	);
}
