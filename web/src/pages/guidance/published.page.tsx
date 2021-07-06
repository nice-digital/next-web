import Head from "next/head";
import Link from "next/link";

export default function Published(): JSX.Element {
	return (
		<>
			<Head>
				<title>Published guidance</title>
			</Head>
			Published guidance
			<Link href="/guidance/indevelopment">
				<a>Go to in development guidance</a>
			</Link>
		</>
	);
}
