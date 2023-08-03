export type FormID = `${number}`;

export type Duration = `${number}ms`;

export type NotFoundResponse = {
	responseCode: 404;
	message: string;
	content: "";
	duration: Duration;
	info: string;
};

export type NotAuthorizedResponse = {
	responseCode: 401;
	message: string;
	content: "";
	duration: Duration;
	info: string;
};

export type FormStatus = "ENABLED" | "DISABLED";

export type FormType = "LEGACY" | "CARD";

export type FormSuccessResponse = {
	responseCode: 200;
	message: "success";
	content: {
		id: string;
		username: string;
		title: string;
		height: number;
		status: FormStatus;
		/** Format like "2023-03-21 09:27:18" */
		created_at: string;
		updated_at: string;
		last_submission: string;
		new: `${number}`;
		count: `${number}`;
		type: FormType;
		favorite: `${number}`;
		archived: `${number}`;
		url: string;
	};
	duration: Duration;
};

export type GetFormResponse =
	| NotAuthorizedResponse
	| NotFoundResponse
	| FormSuccessResponse;
