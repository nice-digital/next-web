import { render, screen } from "@testing-library/react";

import {
	ProjectConsultationDocumentsLink,
	ProjectConsultationDocumentsLinkProps,
} from "./ProjectConsultationDocuments";

const consultationUrls = [
	"/indicators/indevelopment/gid-ipg10316/consultations/html-content-4",
	"/indicators/indevelopment/gid-ipg10316/consultations/html-content-2",
	"/indicators/indevelopment/gid-ipg10316/consultations/html-content",
];

const props: ProjectConsultationDocumentsLinkProps = {
	consultationUrls,
};

describe("ProjectConsultationDocumentsLink", () => {
	it.only("should render a single document link when there is one consultations active", async () => {
		const singleConsultation = [...consultationUrls];
		singleConsultation.length = 1;

		const mockProps = {
			...props,
			consultationUrls: singleConsultation,
		};
		render(<ProjectConsultationDocumentsLink {...mockProps} />);

		expect(
			screen.getByText("Read the consultation documents")
		).toBeInTheDocument();
	});

	it("should render indexed document links when there are multiple consultations active", async () => {
		render(<ProjectConsultationDocumentsLink {...props} />);

		expect(
			screen.getByText("Read consultation 1 documents")
		).toBeInTheDocument();
		expect(
			screen.getByText("Read consultation 2 documents")
		).toBeInTheDocument();
		expect(
			screen.getByText("Read consultation 3 documents")
		).toBeInTheDocument();
	});
});
