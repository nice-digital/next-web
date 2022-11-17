import { type GetServerSideProps } from "next";

export type InformationForPublicPageProps = {
	productPath: string;
};

export default function InformationForPublicPage({
	productPath,
}: InformationForPublicPageProps): JSX.Element {
	return <></>;
}

export const getServerSideProps: GetServerSideProps<
	InformationForPublicPageProps,
	{ slug: string }
> = async () => {
	// TODO: implement IFP when we move guidance to Next Web.
	// Indicators don't have IFP
	return { notFound: true };
};
