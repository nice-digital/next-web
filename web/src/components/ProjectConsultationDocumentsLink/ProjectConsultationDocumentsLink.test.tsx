import { render, screen } from "@testing-library/react";

import { IndevConsultation } from "@/feeds/inDev/types";

import {
	ProjectConsultationDocumentsLink,
	ProjectConsultationDocumentsLinkProps,
} from "./ProjectConsultationDocuments";

const consultationPanels = [
	{
		links: { self: [Array] },
		eTag: null,
		reference: "GID-IPG10316",
		title: "Percutaneous thrombectomy for massive pulmonary embolus",
		consultationName: "Interventional procedure consultation: 3",
		startDate: "2023-01-01T00:00:00",
		endDate: "2023-01-31T09:38:00",
		consultationType: "Interventional procedure consultation",
		resourceTitleId: "html-content-4",
		projectType: "IPG",
		technologyType: "Procedure",
		productTypeName: "Interventional procedures guidance",
		showExpressionOfInterestSubmissionQuestion: false,
		developedAs: null,
		relevantTo: null,
		consultationId: 2066,
		process: "IP",
		hasDocumentsWhichAllowConsultationComments: true,
		isChte: true,
		allowedRole: "CHTETeam",
		firstConvertedDocumentId: null,
		firstChapterSlugOfFirstConvertedDocument: null,
		partiallyUpdatedProjectReference: null,
		origProjectReference: null,
		areasOfInterestList: [],
		hidden: false,
	},
	{
		links: { self: [Array] },
		eTag: null,
		reference: "GID-IPG10316",
		title: "Percutaneous thrombectomy for massive pulmonary embolus",
		consultationName: "Interventional procedure consultation: 1",
		startDate: "2023-01-01T00:00:00",
		endDate: "2023-01-31T09:25:00",
		consultationType: "Interventional procedure consultation",
		resourceTitleId: "html-content",
		projectType: "IPG",
		technologyType: "Procedure",
		productTypeName: "Interventional procedures guidance",
		showExpressionOfInterestSubmissionQuestion: false,
		developedAs: null,
		relevantTo: null,
		consultationId: 2064,
		process: "IP",
		hasDocumentsWhichAllowConsultationComments: true,
		isChte: true,
		allowedRole: "CHTETeam",
		firstConvertedDocumentId: null,
		firstChapterSlugOfFirstConvertedDocument: null,
		partiallyUpdatedProjectReference: null,
		origProjectReference: null,
		areasOfInterestList: [],
		hidden: false,
	},
	{
		links: { self: [Array] },
		eTag: null,
		reference: "GID-IPG10316",
		title: "Percutaneous thrombectomy for massive pulmonary embolus",
		consultationName: "Interventional procedure consultation: 2",
		startDate: "2023-01-01T00:00:00",
		endDate: "2023-01-31T09:25:00",
		consultationType: "Interventional procedure consultation",
		resourceTitleId: "html-content-2",
		projectType: "IPG",
		technologyType: "Procedure",
		productTypeName: "Interventional procedures guidance",
		showExpressionOfInterestSubmissionQuestion: false,
		developedAs: null,
		relevantTo: null,
		consultationId: 2065,
		process: "IP",
		hasDocumentsWhichAllowConsultationComments: true,
		isChte: true,
		allowedRole: "CHTETeam",
		firstConvertedDocumentId: null,
		firstChapterSlugOfFirstConvertedDocument: null,
		partiallyUpdatedProjectReference: null,
		origProjectReference: null,
		areasOfInterestList: [],
		hidden: false,
	},
] as unknown as IndevConsultation[];

const props: ProjectConsultationDocumentsLinkProps = {
	consultationPanels,
};

describe("ProjectConsultationDocumentsLink", () => {
	it("should render a single document link when there is one consultations active", async () => {
		const singleConsultation = [...consultationPanels];
		singleConsultation.length = 1;
		const mockProps = {
			...props,
			consultationPanels: singleConsultation,
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
