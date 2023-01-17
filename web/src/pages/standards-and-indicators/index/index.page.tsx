import { GetServerSideProps } from "next/types";

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		redirect: {
			destination: "/indicators/published",
			permanent: true,
		},
	};
};

export default function OldIndicatorListPage(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to redirect
}
