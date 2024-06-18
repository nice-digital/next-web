interface SoundCloudEmbedProps {
	id: string;
}

export const SoundCloudEmbed: React.FC<SoundCloudEmbedProps> = ({
	id,
}: SoundCloudEmbedProps) => (
	<iframe
		title="SoundCloud player for this NICE podcast"
		width="100%"
		height="200"
		scrolling="no"
		frameBorder="no"
		src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${id}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
	></iframe>
);
