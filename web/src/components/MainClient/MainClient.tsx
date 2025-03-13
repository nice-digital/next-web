"use client";

import {Main, MainProps} from "@nice-digital/global-nav";

export default function MainClient(props: MainProps): JSX.Element {
	const {children} = props;
	return (
		<Main>
			{children}
		</Main>
	);
}
