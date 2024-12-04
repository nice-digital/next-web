import React from "react";
import { ResolvingMetadata, Metadata } from 'next';
import { getDefaultSeoConfig } from "src/pages/next-seo.config";


type Props = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }

  export const generateMetadata = async(
	props: Props,
	parent: ResolvingMetadata
  ): Promise<Metadata> => {

	const defaultSeoConfig = getDefaultSeoConfig("example") as unknown as Metadata;

	return {title: "Example Page | NICE",...defaultSeoConfig}
  }

const ExamplePage = (): React.ReactNode => {
	return (
		<main>
			<h1>Welcome to the Example Page</h1>
			<p>This is a basic example of a page in the Next.js App Router.</p>
		</main>
	);
};

export default ExamplePage;
