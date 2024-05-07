import { NextSeo } from "next-seo";

/**
 * Page for testing env var implementation
 */

interface EnvTestPageProps {
	serverPreviewAccessToken: string;
	serverPublicAccessToken: string;
	serverTestParam: string;
	serverNextPublicParam: string;
}

export default function EnvTestPage({
	serverPreviewAccessToken,
	serverPublicAccessToken,
	serverTestParam,
	serverNextPublicParam,
}: EnvTestPageProps): JSX.Element {
	return (
		<>
			<NextSeo title="Env var test" noindex />
			<h1>Testing environment variables...</h1>
			<h2>Client side</h2>
			<ul>
				<li>
					STORYBLOK_PREVIEW_ACCESS_TOKEN:{" "}
					{process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN}
				</li>
				<li>
					STORYBLOK_PUBLIC_ACCESS_TOKEN:{" "}
					{process.env.STORYBLOK_PUBLIC_ACCESS_TOKEN}
				</li>
				<li>STORYBLOK_TEST_PARAM: {process.env.STORYBLOK_TEST_PARAM}</li>
				<li>
					NEXT_PUBLIC_STORYBLOK_TEST_PARAM_AGAIN:{" "}
					{process.env.NEXT_PUBLIC_STORYBLOK_TEST_PARAM_AGAIN}
				</li>
			</ul>
			<h2>Server side</h2>
			<ul>
				<li>STORYBLOK_PREVIEW_ACCESS_TOKEN: {serverPreviewAccessToken}</li>
				<li>STORYBLOK_PUBLIC_ACCESS_TOKEN: {serverPublicAccessToken}</li>
				<li>STORYBLOK_TEST_PARAM: {serverTestParam}</li>
				<li>NEXT_PUBLIC_STORYBLOK_TEST_PARAM_AGAIN: {serverNextPublicParam}</li>
			</ul>
		</>
	);
}

export const getServerSideProps = () => {
	return {
		props: {
			serverPreviewAccessToken:
				process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN || "undefined",
			serverPublicAccessToken:
				process.env.STORYBLOK_PUBLIC_ACCESS_TOKEN || "undefined",
			serverTestParam: process.env.STORYBLOK_TEST_PARAM || "undefined",
			serverNextPublicParam:
				process.env.NEXT_PUBLIC_STORYBLOK_TEST_PARAM_AGAIN || "undefined",
		},
	};
};
