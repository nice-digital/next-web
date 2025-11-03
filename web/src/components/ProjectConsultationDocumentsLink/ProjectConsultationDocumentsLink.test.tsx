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
	it("should render a single document link when there is one consultation active", async () => {
		const singleConsultation = [...consultationUrls];
		singleConsultation.length = 1;

		const mockProps = {
			consultationUrls: singleConsultation,
		};

		render(<ProjectConsultationDocumentsLink {...mockProps} />);

		const consultationDocumentsLink = screen.getByText(
			"Consultation documents"
		);

		expect(consultationDocumentsLink).toBeInTheDocument();
		expect(consultationDocumentsLink).toHaveAttribute(
			"href",
			singleConsultation[0]
		);
	});

	it("should render indexed document links when there are multiple consultations active", async () => {
		render(<ProjectConsultationDocumentsLink {...props} />);

		for (let i = 1; i <= props.consultationUrls.length; i++) {
			expect(
				screen.getByText(`Consultation ${i} documents`)
			).toBeInTheDocument();
		}
	});
});
