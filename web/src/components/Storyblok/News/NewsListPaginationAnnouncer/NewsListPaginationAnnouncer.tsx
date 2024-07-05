import React, { useEffect, useState } from "react";

import { Announcer } from "@/components/Announcer/Announcer";

type NewsListPaginationAnnouncerProps = {
	currentPage: number;
	total: number;
	perPage: number;
	announcementPrefix: string;
};

export const NewsListPaginationAnnouncer: React.FC<
	NewsListPaginationAnnouncerProps
> = ({ currentPage, total, perPage, announcementPrefix }) => {
	const [announcement, setAnnouncement] = useState("");
	const totalPages = Math.ceil(total / perPage);
	useEffect(() => {
		const announcementText = `${announcementPrefix}, ${currentPage} of ${totalPages}`;
		setAnnouncement(announcementText);

		return () => {
			setAnnouncement("");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, totalPages]);

	return <Announcer announcement={announcement} />;
};
