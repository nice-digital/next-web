export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement {
	return (
		<html lang="en">
			<body>
				<p>Shared root layout..</p>
				{children}
			</body>
		</html>
	);
}
