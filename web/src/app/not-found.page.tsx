import Link from "next/link";

// export const dynamic = "force-dynamic";

export default function NotFound(): JSX.Element {
	return (
		<div>
			<h2>Not Found</h2>
			<p>Could not find requested resource</p>
			<Link href="/example">Return Home</Link>
		</div>
	);
}
