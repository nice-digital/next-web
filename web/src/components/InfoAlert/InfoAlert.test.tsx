import { render } from "@testing-library/react";

import { InfoAlert, type InfoAlertProps } from "./InfoAlert";

const propsWithAlert: InfoAlertProps = {
	alert: "Test Info Alert",
};

const propsWithoutAlert: InfoAlertProps = {
	alert: null,
};

describe("InfoAlert", () => {
	it("should match snapshot when we have an alert", () => {
		const { container } = render(<InfoAlert {...propsWithAlert} />);
		expect(container).toMatchSnapshot();
	});
});

describe("InfoAlert", () => {
	it("should match snapshot when alert is null", () => {
		const { container } = render(<InfoAlert {...propsWithoutAlert} />);
		expect(container).toMatchSnapshot();
	});
});
