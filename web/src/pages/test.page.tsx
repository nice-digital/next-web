import {
	InferGetServerSidePropsType,
	GetServerSidePropsContext,
	GetServerSideProps,
} from "next";
import Head from "next/head";

import { logger, useLogger } from "@/logger";
import { Test } from "@/components/Test/Test";

export interface TestPageProps {
	test: true;
}

export const getServerSideProps: GetServerSideProps<TestPageProps> = async (
	_context: GetServerSidePropsContext
) => {
	logger.warn("A warning in getServerSideProps");

	logger.error(
		new Error("A test exception"),
		"A warning in getServerSideProps"
	);

	return {
		props: {
			test: true,
		},
	};
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
