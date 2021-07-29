import {
	InferGetServerSidePropsType,
	GetServerSidePropsContext,
	GetServerSideProps,
} from "next";
import Head from "next/head";

import { Test } from "@/components/Test/Test";
import { useLogger } from "@/logger";

export interface TestPageProps {
	test: true;
}

export const getServerSideProps: GetServerSideProps<TestPageProps> = async (
	_context: GetServerSidePropsContext
) => {
	// This demonstrates server-side error handling. Go to /guidance/errotest and you should see 2 things in the production build:
	// - an exception logged
	// - a 'server error' page served to the user
	// Note: in development you'll just get a normal NextJS error for debugging purposes
	throw new Error("A deliberate error thrown in getServerSideProps");
};

export default function TestPage({
	test,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
	const childLogger = useLogger();

	childLogger.error(new Error("A child logger error"), "Error in a component");

	childLogger.info("Some useful log message");

	return (
		<>
			<Head>
				<title>Test</title>
			</Head>
			Test: {test}
			<Test />
		</>
	);
}
