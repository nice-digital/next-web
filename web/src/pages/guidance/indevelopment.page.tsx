import Head from "next/head";
import Link from "next/link";

export default function Published(): JSX.Element {
	return (
		<>
			<Head>
				<title>In development guidance</title>
			</Head>
			In development guidance
			<Link href="/guidance/published">
				<a>Go to published guidance</a>
			</Link>
		</>
	);
}
