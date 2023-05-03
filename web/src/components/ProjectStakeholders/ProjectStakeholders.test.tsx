import { render, screen, within } from "@testing-library/react";

import {
	IndevCommentator,
	IndevConsultee,
	IndevLegacyStakeholder,
} from "@/feeds/inDev/types";
import { arrayify } from "@/utils/array";

import mockProjectWithStakeholders from "./../../__mocks__/__data__/inDev/project/gid-hst10037.json";
import mockProjectWithLegacyStakeholders from "./../../__mocks__/__data__/inDev/project/gid-mt130.json";
import { Stakeholders, StakeholdersProps } from "./ProjectStakeholders";

const consultees = arrayify(
	mockProjectWithStakeholders._embedded["nice.indev:consultee-list"]._embedded[
		"nice.indev:consultee"
	]
) as unknown as IndevConsultee[];
const commentators = arrayify(
	mockProjectWithStakeholders._embedded["nice.indev:commentator-list"]
		._embedded["nice.indev:commentator"]
) as unknown as IndevCommentator[];
const legacyStakeholders = arrayify(
	mockProjectWithLegacyStakeholders._embedded[
		"nice.indev:legacy-stakeholder-list"
	]._embedded["nice.indev:legacy-stakeholder"]
) as unknown as IndevLegacyStakeholder[];

const props: StakeholdersProps = {
	consultees,
	commentators,
	legacyStakeholders,
};

describe("Stakeholders", () => {
	it("should render consultee stakeholder items", async () => {
		render(<Stakeholders {...props} />);

		expect(
			screen.getByRole("heading", { level: 3, name: "Stakeholders" })
		).toBeInTheDocument();

		const consulteeList = screen.getByLabelText("Consultee stakeholders");
		const { getAllByRole } = within(consulteeList);
		const consulteeListItems = getAllByRole("definition");
		expect(consulteeListItems.length).toBe(44);
	});

	it("should render commentator stakeholder items", async () => {
		render(<Stakeholders {...props} />);

		expect(
			screen.getByRole("heading", { level: 3, name: "Stakeholders" })
		).toBeInTheDocument();

		const commentatorList = screen.getByLabelText("Commentator stakeholders");
		const { getAllByRole } = within(commentatorList);
		const commentatorListItems = getAllByRole("definition");
		expect(commentatorListItems.length).toBe(30);
	});

	it("should render legacy stakeholder items", async () => {
		render(<Stakeholders {...props} />);

		const legacyStakeholderList = screen.getAllByRole("list", {
			name: "Legacy stakeholders",
		});

		expect(legacyStakeholderList).toMatchSnapshot();

		expect(
			screen.getByRole("heading", { level: 3, name: "Stakeholders" })
		).toBeInTheDocument();
	});
});
