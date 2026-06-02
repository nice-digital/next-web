import { type FC } from "react";

export type InfoAlertProps = {
	alert: string | null;
	children?: never;
};

export const InfoAlert: FC<InfoAlertProps> = ({ alert }) => {
	return (
		alert && (
			<div
				className="alert alert--info"
				data-component="alert--info"
				role="alert"
				dangerouslySetInnerHTML={{ __html: alert }}
			/>
		)
	);
};
