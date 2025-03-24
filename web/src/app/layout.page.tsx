import { Inter, Lora } from "next/font/google";


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
				<div>{children}</div>
			</body>
		</html>
	);
}
