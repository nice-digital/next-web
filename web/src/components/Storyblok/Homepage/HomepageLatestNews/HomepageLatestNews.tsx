import { type NewsStory } from "@/types/News";

import { FeaturedStory } from "../../News/FeaturedStory/FeaturedStory";
import { NewsGrid } from "../../News/NewsGrid/NewsGrid";

interface LatestNewsProps {
	featuredStory?: NewsStory;
	latestNews: NewsStory[];
}

export const HomepageLatestNews: React.FC<LatestNewsProps> = ({
	featuredStory,
	latestNews,
}: LatestNewsProps) => {
	console.log("Latest news in the component:", latestNews);

	return (
		<>
			<h2>Latest from NICE</h2>
			{featuredStory && <FeaturedStory story={featuredStory} />}
			<NewsGrid news={latestNews} />
		</>
	);
};
