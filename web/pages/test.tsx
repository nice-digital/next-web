import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import Head from "next/head";

// A test SSR page
export const getServerSideProps = async (
	_context: GetServerSidePropsContext
) => {
	return {
		props: {
			test: true,
		},
	};
};

export default function Test({
	test,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<Head>
				<title>Test</title>
			</Head>
			Test: {test}
		</>
	);
}
