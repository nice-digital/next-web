import { GetServerSideProps } from "next/types";

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	{
		slug: string;
		pdfDownloadPath: string;
	}
> = async ({ res, params, resolvedUrl }) => {
	return {
		redirect: {
			destination: `/some-html-page`,
			permanent: true,
		},
	};
};

export default function HTMLPage(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to write directly to the response
}
