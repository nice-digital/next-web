import {
	InferGetServerSidePropsType,
	GetServerSidePropsContext,
	GetServerSideProps,
} from "next";
import Head from "next/head";

import { logger } from "../logger/logger";

export interface TestProps {
	test: true;
}

export const getServerSideProps: GetServerSideProps<TestProps> = async (
	_context: GetServerSidePropsContext
) => {
	logger.warn("A warning in getServerSideProps");

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
