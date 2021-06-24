import {
	InferGetServerSidePropsType,
	GetServerSidePropsContext,
	GetServerSideProps,
} from "next";
import Head from "next/head";

export interface TestProps {
	test: true;
}

export const getServerSideProps: GetServerSideProps<TestProps> = async (
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
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
	return (
		<>
			<Head>
				<title>Test</title>
			</Head>
			Test: {test}
		</>
	);
}
