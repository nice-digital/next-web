// @ts-check
const path = require("path");

const config = require("config"),
	glob = require("glob"),
	withNodeConfig = require("next-plugin-node-config");

/**
 * A list of paths to hooks used in global nav that should allow transpilation.
 *
 * Avoids the error "cannot use import outside a module"
 */
const globalNavHooksToTranspile = [
	"@mantine/hooks/esm/use-debounced-value",
	"@mantine/hooks/esm/use-focus-trap",
];

/**
 * A list of paths to node modules that should allow transpilation.
 * Most of our Design System components (and Global Nav) import SCSS.
 *
 * Avoids the error "CSS Modules cannot be imported from within node_modules."
 */
const niceDigitalModulesToTranspile = glob.sync(
	"@nice-digital/{*,*/node_modules/@nice-digital/*}",
	{
		cwd: "node_modules",
	}
);

/**
 * Some npm modules are published as ES6, so we need to force them to be transpiled
 * so they're ES5 compatible whilst we still support IE11.
 *
 * As per comment at https://github.com/vercel/next.js/discussions/13922#discussioncomment-23956
 */
const nonES5ModulesToTranspile = ["pino", "serialize-error"];

const commonHeaders = [
	{
		key: "Cache-Control",
		value: config.get("public.cacheControl.defaultCacheHeader"),
	},
	{
		key: "X-App",
		value: "next-web",
	},
	/**
	 * 'Best practice' security headers as per https://edibleco.de/3xcg71N
	 */
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains; preload",
	},
	{
		key: "X-XSS-Protection",
		value: "1; mode=block",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},
	/**
	 * Preload external assets and preconnecting external domains via Link header
	 */
	{
		key: "Link",
		value: [
			// Preload the cookie banner with API key domain preconnect - we want the cookie banner to show as quickly as possible
			`<${config.get("public.cookieBannerScriptURL")}>; rel=preload; as=script`,
			"<https://apikeys.civiccomputing.com>; rel=preconnect; crossorigin",
			"<https://www.googletagmanager.com>; rel=preconnect",
		].join(","),
	},
];

// Prevent emebdding this site in frames in production, but allow it in dev so we can use the Storyblok preview editor
if (process.env.NODE_ENV === "production") {
	commonHeaders.push(
		{
			key: "X-Frame-Options",
			value: "DENY",
		},
		{
			key: "Content-Security-Policy",
			value: "frame-ancestors 'self' https://*.infogram.com",
		}
	);
}

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	nodeConfigServerKey: "server",
	nodeConfigPublicKey: "public",
	// Strict mode gives useful feedback in dev, see https://edibleco.de/3x9GXry
	reactStrictMode: true,
	eslint: {
		// We run ESLint ourselves at the root of this monorepo
		ignoreDuringBuilds: true,
	},
	// Add page.tsx for test co-location, see https://edibleco.de/3qCAkvg
	pageExtensions: ["page.tsx", "api.ts"],
	// Don't send the x-powered-by header: we don't want to expose things like that. See https://edibleco.de/2TpDVAK
	poweredByHeader: false,
	async rewrites() {
		return [
			{
				source:
					"/:productRoot(indicators|guidance)/:statusSlug(indevelopment|discontinued|awaiting-development|topic-selection)/:path*",
				destination:
					"/indicators/indevelopment/:path*?productRoot=:productRoot&statusSlug=:statusSlug",
			},
			{
				source:
					"/:productRoot(indicators|guidance|advice|process|corporate)/:path+",
				destination: "/indicators/:path*?productRoot=:productRoot",
			},
			{
				source: "/robots.txt",
				destination: "/api/robots",
			},
		];
	},
	async redirects() {
		return [
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/participation-in-clinical-trials-and-subsequent-access-to-drugs-appraised-by-nice-a-statement-on-the-applicability-of-about-technology-appraisal-guidance",
				destination:
					"/position-statements/participation-in-clinical-trials-and-subsequent-access-to-drugs-appraised-by-nice-a-statement-on-the-applicability-of-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/technology-appraisal-and-highly-specialised-technologies-appeals/past-appeals-and-decisions",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-and-highly-specialised-technologies-appeals/past-appeals-and-decisions",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/developing-a-positive-working-culture-for-supporting-disabled-children-and-young-people-with-severe-complex-needs",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/biosimilar-technologies-nice-position-statement-information-for-the-public",
				destination:
					"/position-statements/biosimilar-technologies-nice-position-statement-information-for-the-public",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-about-technology-appraisal-guidance/Technology-appraisal-and-Highly-specialised-technologies-appeals",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-and-highly-specialised-technologies-appeals",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/support-for-vcs-organisations/help-us-develop-guidance/guides-to-developing-our-guidance",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-a-voluntary-and-community-sector-organisation/contributing-to-the-development-of-our-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/technology-appraisal-submission-templates-and-supporting-documents",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-submission-templates-and-supporting-documents",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/improving-young-people-s-experiences-in-transition-to-and-from-inpatient-mental-health-settings",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/provider-information/core-standards--non-agents",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/overview-how-we-develop-about-technology-appraisal-guidance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/how-we-develop-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/chemotherapy-dose-standardisation-nice-position-statement",
				destination:
					"/position-statements/chemotherapy-dose-standardisation-nice-position-statement",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/organisations-eligible-to-use-the-framework",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/provider-information/core-standards--agents",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/promoting-wellbeing-and-positive-identity-for-a-child-or-young-person-who-is-looked-after",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-dementia-with-the-contact-details-of-a-named-carer-on-their-record",
				destination: "/indicators/IND114-dementia-named-carer",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/provider-information/sole-supplied-titles",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/sole-supplied-titles",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/arranging-services-for-people-with-a-learning-disability-and-behaviour-that-challenges",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/supporting-people-who-provide-unpaid-care-for-adults-with-health-or-social-care-needs",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/modular-updates-for-technology-appraisals-guidance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/modular-updates-for-our-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/purchasing-steps--further-competition",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-further-competition",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-cvd-who-are-currently-treated-with-a-lipid-lowering-therapy",
				destination:
					"/indicators/IND230-cardiovascular-disease-prevention-secondary-prevention-with-lipid-lowering-therapies",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/biosimilar-technologies-nice-position-statement",
				destination:
					"/position-statements/biosimilar-technologies-nice-position-statement",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/planning-your-technology-appraisal-submission-to-nice",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/planning-your-technology-appraisal-submission-to-nice",
				permanent: true,
			},
			{
				source:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration--guidelines--quality-standards-and-indicators",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration-guidelines-quality-standards-and-indicators",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/changes-to-health-technology-evaluation",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/purchasing-steps--direct-awards",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-direct-awards",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/achieving-and-demonstrating-compliance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/compliance-with-nice-approved-medicine-or-treatment",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books-journals-and-databases/purchasing-steps--direct-awards",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-direct-awards",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/data/cancer-appraisal-recommendations",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-data-cancer-appraisal-recommendations",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/helping-to-prevent-winter-deaths-and-illnesses-associated-with-cold-homes",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/uk-licensing-and-technology-appraisals",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/uk-licensing-and-technology-appraisals",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/what-lay-members-do/lay-member-payments-and-expenses/how-lay-member-payments-affect-benefits",
				destination:
					"/get-involved/our-committees/your-role-as-a-nice-committee-member",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/data/appraisal-recommendations",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-data-appraisal-recommendations",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/support-for-vcs-organisations/help-us-develop-guidance",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-a-voluntary-and-community-sector-organisation/how-voluntary-and-community-sector-organisations-can-help-us-develop-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/mapping-nice-guidelines-to-the-care-quality-commission-s-single-assessment-framework",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/mapping-nice-guidelines-to-the-cqc-s-single-assessment-framework",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books-journals-and-databases/provider-information",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/provider-information",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides-for-social-care/therapeutic-interventions-after-abuse-and-neglect",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/quality-standards-advisory-committee/quality-standards-advisory-committee-members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/quality-standards-advisory-committee/quality-standards-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides-for-social-care/promoting-independence-through-intermediate-care",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/data-collection-agreement",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/data-collection-agreement",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/getting-involved-as-someone-with-lived-experience",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-someone-with-lived-experience",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/charging/procedure-tahst",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/fees-for-technology-appraisals-and-highly-specialised-technologies/charging-procedure",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/types-of-recommendation",
				destination:
					"/what-nice-does/our-guidance/types-of-recommendation-nice-can-make",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/maintaining-and-updating-our-guideline-portfolio",
				destination:
					"/what-nice-does/our-guidance/Prioritising-our-guidance-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/coding-recommendations",
				destination:
					"/what-nice-does/our-guidance/about-interventional-procedures-guidance/clinical-coding-recommendations-for-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers--september-2024",
				destination:
					"/about-us/our-board/public-board-meetings/2024/public-board-meetings-agenda-and-papers-september-2024",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/process/mta-timeline",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/technology-appraisal-processes-and-timelines/multiple-technology-appraisal-process-timeline",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers-september-2023",
				destination:
					"/about-us/our-board/public-board-meetings/2023/public-board-meeting-agenda-and-papers-september-2023",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers-december-2023",
				destination:
					"/about-us/our-board/public-board-meetings/2023/public-board-meeting-agenda-and-papers-december-2023",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/recognising-and-responding-to-domestic-violence-and-abuse",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/models-for-the-evaluation-and-purchase-of-antimicrobials",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/a-new-model-for-evaluating-and-purchasing-antimicrobials-in-the-uk",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/dementia-discussing-and-planning-support-after-diagnosis",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/nice-voluntary-and-community-sector-forum",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-a-voluntary-and-community-sector-organisation/nice-voluntary-and-community-sector-forum",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/public-involvement-programme-expert-panel",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-someone-with-lived-experience/join-our-people-and-communities-network",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers--july-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-july-2022",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers--july-2023",
				destination:
					"/about-us/our-board/public-board-meetings/2023/public-board-meeting-agenda-and-papers-july-2023",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers--july-2024",
				destination:
					"/about-us/our-board/public-board-meetings/2024/public-board-meeting-agenda-and-papers-july-2024",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/process/sta-timeline",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/technology-appraisal-processes-and-timelines/single-technology-appraisal-timeline",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/building-independence-through-planning-for-transition",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/moving-between-hospital-and-home-including-care-homes",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/medical-technologies-guidance/register-as-a-stakeholder",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration-medical-technologies",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/promoting-positive-mental-wellbeing-for-older-people",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/making-decisions-using-nice-guidelines",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/making-decisions-using-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/patient-and-public-involvement-policy",
				destination:
					"/get-involved/people-and-communities/patient-and-public-involvement-policy",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/reducing-the-risk-violent-and-aggressive-behaviours",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-diagnostics-guidance/dt-stakeholder-registration",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration-diagnostic-technologies",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/what-to-expect-during-assessment-and-care-planning",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/assessment-and-diagnosis-of-autism-what-to-expect",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/digital-health/multi-agency-advisory-service-for-ai-and-data-driven-technologies",
				destination:
					"/what-nice-does/digital-health/artificial-intelligence-ai-and-digital-regulations-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/openathens-registration-help",
				destination:
					"/library-and-knowledge-services/openathens/openathens-registration-help",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/board/public-board-meetings/public-board-meeting-agenda-and-papers--january-2022",
				destination: "/about-us/our-board/public-board-meetings/2022",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/interventional-procedures-guidance/recommendations",
				destination:
					"/what-nice-does/our-guidance/types-of-recommendation-nice-can-make",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/evidence-for-strengths-and-asset-based-outcomes",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/charging",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/fees-for-technology-appraisals-and-highly-specialised-technologies",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/board/public-board-meetings/public-board-meeting-agenda-and-papers--march-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-march-2022",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/improving-oral-health-for-adults-in-care-homes",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-medical-technologies-guidance/get-involved",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/get-involved-with-medical-technologies-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/implementing-nice-guidance",
				destination: "/implementing-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice",
				destination: "/implementing-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Highly-Specialised-Technologies-Evaluation-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/highly-specialised-technologies-evaluation-committee/highly-specialised-technologies-evaluation-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books-journals-and-databases",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/our-role-in-the-innovative-licensing-and-access-pathway--ilap",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/our-role-in-the-innovative-licensing-and-access-pathway-ilap",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/evidence-standards-framework-for-digital-health-technologies",
				destination:
					"/what-nice-does/digital-health/evidence-standards-framework-esf-for-digital-health-technologies",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/how-we-develop-nice-guidelines",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/how-we-develop-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/notify",
				destination:
					"/what-nice-does/our-guidance/about-interventional-procedures-guidance/notify-an-interventional-procedure",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-medical-technologies-evaluation-programme",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/get-a-medical-technology-evaluated",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-research-work/use-of-ai-in-evidence-generation--nice-position-statement",
				destination:
					"/position-statements/use-of-AI-in-evidence-generation-NICE-position-statement",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-highly-specialised-technologies-guidance",
				destination:
					"/what-nice-does/our-guidance/about-highly-specialised-technologies-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/support-for-vcs-organisations",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-a-voluntary-and-community-sector-organisation",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/effective-record-keeping-ordering-medicines",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/enabling-positive-lives-for-autistic-adults",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/openathens-eligibility",
				destination:
					"/library-and-knowledge-services/openathens/openathens-eligibility",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/data",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-research-work/partnering-with-us-for-research---timescales-and-process",
				destination:
					"/what-nice-does/our-research-work/partnering-with-us-for-research-timescales-and-process",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/medicines-and-prescribing/nice-medicines-and-prescribing-associates",
				destination:
					"/implementing-nice-guidance/implementation-help-and-advice/nice-medicines-and-prescribing-associates",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/eq-5d-5l",
				destination:
					"/position-statements/position-statement-on-use-of-the-eq-5d-5l-value-set-for-england-updated-october-2019",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/discussing-and-planning-medicines-support",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/office-for-market-access/early-access-to-medicines-scheme",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/early-access-to-medicines-scheme-eams",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-diagnostics-guidance/process-timeline",
				destination:
					"/what-nice-does/our-guidance/about-diagnostics-guidance/diagnostics-assessment-programme-process-timeline",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/process",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/methods-and-processes-used-before-2022",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/openathens-support",
				destination:
					"/library-and-knowledge-services/openathens/openathens-support",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-about-medical-technologies-guidance",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-about-technology-appraisal-guidance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/making-a-positive-impact",
				destination:
					"/get-involved/people-and-communities/making-a-positive-impact-people-and-communities-network-case-studies",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/good-practice-in-safeguarding-training",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/modern-slavery-and-human-trafficking-statement",
				destination:
					"/about-us/policies-procedures-and-reports/modern-slavery-and-human-trafficking-statement",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-interventional-procedures-guidance",
				destination:
					"/what-nice-does/our-guidance/about-interventional-procedures-guidance",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Highly-Specialised-Technologies-Evaluation-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/highly-specialised-technologies-evaluation-committee",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Interventional-Procedures-Advisory-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/interventional-procedures-advisory-committee/interventional-procedures-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/shared-decision-making",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/about-shared-decision-making",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/recognising-and-preventing-delirium",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/appraisal-methodology-for-records-1999-2013",
				destination:
					"/about-us/policies-procedures-and-reports/appraisal-methodology-for-records-1999-2013",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-appraisal-Committee/Committee-A-Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees/tac-a-members",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-appraisal-Committee/Committee-B-Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees/tac-b-members",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-appraisal-Committee/Committee-C-Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees/tac-c-members",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-appraisal-Committee/Committee-D-Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees/tac-d-members",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/helping-to-prevent-pressure-ulcers",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-and-papers-march-2024",
				destination: "/about-us/our-board/public-board-meetings/2024",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-september-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-september-2022",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/better-home-care-for-older-people",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/supporting-the-health-and-care-system-to-implement-virtual-wards",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/supporting-the-health-care-system-to-implement-virtual-wards",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-december-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-december-2022",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-december-2024",
				destination:
					"/about-us/our-board/public-board-meetings/2024/public-board-meeting-agenda-and-papers-december-2024",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/what-lay-members-do/lay-member-payments-and-expenses",
				destination:
					"/get-involved/our-committees/your-role-as-a-nice-committee-member",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Medical-Technologies-Advisory-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/medical-technologies-advisory-committee/medical-technologies-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/creating-a-safeguarding-culture",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/understanding-intermediate-care",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/using-nice-guidance-principal-social-workers",
				destination:
					"/implementing-nice-guidance/social-care/using-nice-guidance-in-social-work-scenarios/families-and-relationships-settings/developing-relationships-with-parents",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/getting-help-to-overcome-abuse",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/person-centred-future-planning",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/prioritising-our-guidance-topics/our-prioritisation-decisions",
				destination:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-march-2023",
				destination: "/about-us/our-board/public-board-meetings/2023",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-march-2025",
				destination: "/about-us/our-board/public-board-meetings/2025",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/join-a-committee/how-to-apply-to-join-a-committee",
				destination:
					"/get-involved/our-committees/your-role-as-a-nice-committee-member",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Interventional-Procedures-Advisory-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/interventional-procedures-advisory-committee",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/helping-to-prevent-infection",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/indicator-advisory-committee-iac/iac-members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/indicator-advisory-committee/indicator-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-may-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-may-2022",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-may-2023",
				destination:
					"/about-us/our-board/public-board-meetings/2023/public-board-meeting-agenda-and-papers-may-2023",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-may-2024",
				destination:
					"/about-us/our-board/public-board-meetings/2024/public-board-meeting-agenda-and-papers-may-2024",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/involving-you",
				destination:
					"/get-involved/people-and-communities/involving-you-in-the-development-of-our-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/access",
				destination:
					"/library-and-knowledge-services/openathens/openathens-access",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/board-executive-team-and-senior-leaders-interests-register",
				destination:
					"/about-us/our-board/board-executive-team-and-senior-leaders-interests-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/selecting-and-prioritising-quality-standard-topics",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards/selecting-and-prioritising-quality-standard-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/types-of-nice-recommendation",
				destination:
					"/what-nice-does/our-guidance/types-of-recommendation-nice-can-make",
				permanent: true,
			},
			{
				source:
					"/get-involved/study-nice-and-lse-s-executive-msc-healthcare-decision-making",
				destination:
					"/get-involved/nice-training-and-development-opportunities/study-nice-and-lse-s-executive-msc-healthcare-decision-making",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/giving-medicines-covertly",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/resources-help-put-guidance-into-practice",
				destination: "/implementing-nice-guidance/into-practice-resources",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-advice/medtech-innovation-briefings",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/medtech-innovation-briefings",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/trade-union-facility-time-report",
				destination:
					"/about-us/policies-procedures-and-reports/trade-union-facility-time-report",
				permanent: true,
			},
			{
				source:
					"/get-involved/register-as-a-stakeholder/who-can-register-as-a-stakeholder",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/who-can-register-as-a-stakeholder",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-diagnostics-guidance",
				destination: "/what-nice-does/our-guidance/about-diagnostics-guidance",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Medical-Technologies-Advisory-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/medical-technologies-advisory-committee",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Diagnostics-Advisory-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/diagnostics-advisory-committee/diagnostics-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/the-nice-strategy-2021-to-2026",
				destination:
					"/about-us/corporate-publications/nice-transformation-plan",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/advance-care-planning",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/using-nice-guidance-in-social-work",
				destination:
					"/implementing-nice-guidance/social-care/using-nice-guidance-in-social-work-scenarios",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Quality-Standards-Advisory-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/quality-standards-advisory-committee",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/OpenAthens",
				destination: "/library-and-knowledge-services/openathens",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/measuring-the-uptake-of-nice-guidance",
				destination:
					"/implementing-nice-guidance/measuring-the-use-of-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/get-involved/stakeholder-registration/tobacco-industry-organisations",
				destination:
					"/position-statements/position-statement-on-engagement-with-tobacco-industry-organisations",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/get-involved/quality-standard-consultations",
				destination:
					"/get-involved/help-develop-quality-standards/quality-standard-consultations",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/antimicrobials-evaluation-committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/antimicrobial-evaluation-committee",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-health-advisory-committees",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/public-health-advisory-committees",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/social-care-trainers-resource",
				destination:
					"/implementing-nice-guidance/social-care/social-care-trainers-resource",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-research-work/methodological-research-areas",
				destination: "/what-nice-does/our-research-work/methods-research-areas",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/proportionate-approach-to-technology-appraisals",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/taking-a-proportionate-approach-to-technology-appraisals",
				permanent: true,
			},
			{
				source:
					"/get-involved/careers/our-benefits--rewards-and-work-life-balance",
				destination: "/careers/our-benefits-rewards-and-work-life-balance",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/get-involved/support-a-quality-standard",
				destination:
					"/get-involved/help-develop-quality-standards/support-a-quality-standard",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Evidence-Services/Clinical-knowledge-summaries",
				destination: "https://cks.nice.org.uk/",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/child-abuse-neglect-guidance",
				destination:
					"/implementing-nice-guidance/social-care/child-abuse-and-neglect-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quality-improvement-resource",
				destination:
					"/implementing-nice-guidance/social-care/quality-improvement-resource-for-adult-social-care",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/nice-international/knowledge-transfer-seminars",
				destination:
					"/what-nice-does/nice-international/knowledge-transfer-seminars",
				permanent: true,
			},
			{
				source:
					"/get-involved/stakeholder-registration/confidentiality-agreement",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration-confidentiality-agreement",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Diagnostics-Advisory-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/diagnostics-advisory-committee",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-Appraisal-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/cost-savings-resource-planning",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-advice/evidence-summaries",
				destination: "/what-nice-does/our-guidance/about-evidence-summaries",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/timeline-developing-quality-standards",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards/timeline-for-developing-quality-standards",
				permanent: true,
			},
			{
				source:
					"/About/Who-we-are/Policies-and-procedures/NICE-equality-scheme",
				destination:
					"/about-us/policies-procedures-and-reports/edi-roadmap-and-annual-action-plan",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement",
				destination: "/get-involved/people-and-communities",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/modular-updates",
				destination: "/what-nice-does/our-guidance/modular-updates",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines",
				destination: "/what-nice-does/our-guidance/about-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/gender-pay-gap-report",
				destination:
					"/about-us/policies-procedures-and-reports/gender-pay-gap-report",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/transparency-of-spend",
				destination:
					"/about-us/policies-procedures-and-reports/transparency-of-spend",
				permanent: true,
			},
			{
				source:
					"/get-involved/jobs/our-benefits--rewards-and-work-life-balance",
				destination: "/careers/our-benefits-rewards-and-work-life-balance",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/how-gps-help-develop-our-guidance",
				destination: "/get-involved/gps-and-primary-care",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international/about-nice-international",
				destination:
					"/what-nice-does/nice-international/about-nice-international",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international/adapting-nice-guidelines",
				destination:
					"/what-nice-does/nice-international/adapting-nice-guidelines",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/our-projects-and-partners",
				destination:
					"/what-nice-does/our-research-work/our-projects-and-partners",
				permanent: true,
			},
			{
				source: "/get-involved/meetings-in-public/indicator-advisory-committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/indicator-advisory-committee",
				permanent: true,
			},
			{
				source: "/about/nice-communities/library-and-knowledge-services-staff",
				destination: "/library-and-knowledge-services",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/help-implement-nice-guidance",
				destination: "/get-involved/help-implement-nice-guidance",
				permanent: true,
			},
			{
				source: "/About/What-we-do/Evidence-Services/journals-and-databases",
				destination: "/library-and-knowledge-services",
				permanent: true,
			},
			{
				source: "/about/what-we-do/digital-health/office-for-digital-health",
				destination: "/what-nice-does/digital-health/office-for-digital-health",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/resource-impact-assessment",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/assessing-the-resource-impact-of-nice-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/bringing-our-guidance-together-by-topic",
				destination:
					"/what-nice-does/our-guidance/bringing-our-guidance-together-by-topic",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international/consultancy-services",
				destination: "/what-nice-does/nice-international/consultancy-services",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international/speaking-engagements",
				destination: "/what-nice-does/nice-international/speaking-engagements",
				permanent: true,
			},
			{
				source: "/get-involved/our-committees/what-professional-members-do",
				destination:
					"/get-involved/our-committees/your-role-as-a-nice-committee-member",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/quality-standards-topic-library",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards/selecting-and-prioritising-quality-standard-topics",
				permanent: true,
			},
			{
				source: "/Get-Involved/Meetings-in-public/Appeal-panel-membership",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-and-highly-specialised-technologies-appeals/appeal-panel-membership",
				permanent: true,
			},
			{
				source: "/about/who-we-are/executive-team/executive-team-meetings",
				destination: "/about-us/executive-team/executive-team",
				permanent: true,
			},
			{
				source: "/about/nice-communities/generalpractice/reference-panel",
				destination: "/forms/subscribe-to-our-gp-reference-panel",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/get-involved/topic-engagement",
				destination:
					"/get-involved/help-develop-quality-standards/topic-engagement",
				permanent: true,
			},
			{
				source: "/Get-Involved/Meetings-in-public/Public-board-meetings",
				destination: "/about-us/our-board/public-board-meetings",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/how-to-use-quality-standards",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards/how-to-use-quality-standards",
				permanent: true,
			},
			{
				source: "/about/what-we-do/forward-view---our-priority-topics",
				destination:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics/forward-view-our-priority-topics",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/hta-lab-projects",
				destination:
					"/what-nice-does/our-research-work/hta-lab/hta-lab-projects",
				permanent: true,
			},
			{
				source: "/terms-and-conditions/cks-end-user-licence-agreement",
				destination: "/cks-end-user-licence-agreement",
				permanent: true,
			},
			{
				source: "/about/what-we-do/late-stage-assessment-for-medtech",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/late-stage-assessment-lsa-for-medtech",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/life-sciences-tools",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/tools-for-building-or-evaluating-an-evidence-base",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/nice-advice-service",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/commercial-liaison-team/services",
				destination:
					"/what-nice-does/patient-access-schemes-and-pricing-agreements/services",
				permanent: true,
			},
			{
				source: "/about/what-we-do/prioritising-our-guidance-topics",
				destination:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics",
				permanent: true,
			},
			{
				source: "/about/nice-communities/medicines-and-prescribing",
				destination: "/implementing-nice-guidance/medicines-and-prescribing",
				permanent: true,
			},
			{
				source: "/about/nice-communities/social-care/quick-guides",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/resource-planner",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/resource-planner",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/nice-listens",
				destination: "/what-nice-does/our-research-work/nice-listens",
				permanent: true,
			},
			{
				source: "/get-involved/our-committees/what-lay-members-do",
				destination:
					"/get-involved/our-committees/your-role-as-a-nice-committee-member",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/nice-field-team",
				destination:
					"/implementing-nice-guidance/implementation-help-and-advice/helping-you-put-our-guidance-into-practice",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/managed-access",
				destination:
					"/what-nice-does/patient-access-schemes-and-pricing-agreements/managed-access",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/patient-safety",
				destination: "/patient-safety",
				permanent: true,
			},
			{
				source: "/re-using-our-content/content-assurance-service",
				destination: "/reusing-our-content/content-assurance-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-and-health-inequalities",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/nice-guidance",
				destination: "/what-nice-does/our-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/adoption-team",
				destination:
					"/implementing-nice-guidance/implementation-help-and-advice/adoption-and-implementation-support",
				permanent: true,
			},
			{
				source: "/get-involved/careers/diversity-and-inclusion",
				destination: "/careers/diversity-and-inclusion",
				permanent: true,
			},
			{
				source: "/get-involved/careers/we-care-about-our-staff",
				destination: "/careers/we-care-about-our-staff",
				permanent: true,
			},
			{
				source: "/re-using-our-content/uk-open-content-licence",
				destination: "/forms/use-of-nice-content-in-the-uk-form",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/hta-lab",
				destination:
					"/what-nice-does/our-research-work/health-technology-assessment-innovation-laboratory",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/quality-standards",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/diversity-and-inclusion",
				destination: "/careers/diversity-and-inclusion",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/we-care-about-our-staff",
				destination: "/careers/we-care-about-our-staff",
				permanent: true,
			},
			{
				source: "/about/what-we-do/commercial-liaison-team",
				destination:
					"/what-nice-does/patient-access-schemes-and-pricing-agreements",
				permanent: true,
			},
			{
				source: "/about/who-we-are/policies-and-procedures",
				destination: "/about-us/policies-procedures-and-reports",
				permanent: true,
			},
			{
				source: "/about/who-we-are/board/board-committees",
				destination: "/about-us/our-board/board-committees",
				permanent: true,
			},
			{
				source: "/about/who-we-are/corporate-publications",
				destination: "/about-us/corporate-publications",
				permanent: true,
			},
			{
				source: "/about/who-we-are/senior-management-team",
				destination: "/about-us/executive-team/",
				permanent: true,
			},
			{
				source: "/about/nice-communities/generalpractice",
				destination:
					"/implementing-nice-guidance/general-practice-keep-your-practice-up-to-date",
				permanent: true,
			},
			{
				source: "/About/Who-we-are/Board/Board-expenses",
				destination: "/about-us/our-board/board-expenses",
				permanent: true,
			},
			{
				source: "/Get-Involved/stakeholder-registration",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-syndication-api",
				destination: "/reusing-our-content/nice-syndication-api",
				permanent: true,
			},
			{
				source: "/get-involved/careers/digital-at-nice",
				destination: "/careers/digital-at-nice",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international",
				destination: "/what-nice-does/nice-international",
				permanent: true,
			},
			{
				source: "/about/who-we-are/guidance-executive",
				destination: "/about-us/guidance-executive",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/indicators",
				destination: "/what-nice-does/standards-and-indicators/indicators",
				permanent: true,
			},
			{
				source: "/about/nice-communities/social-care",
				destination: "/implementing-nice-guidance/social-care/",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work",
				destination: "/what-nice-does/our-research-work",
				permanent: true,
			},
			{
				source: "/about/who-we-are/structure-of-nice",
				destination: "/about-us/structure-of-nice",
				permanent: true,
			},
			{
				source: "/about/what-we-do/eva-for-medtech",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/early-value-assessment-eva-for-medtech",
				permanent: true,
			},
			{
				source: "/about/who-we-are/history-of-nice",
				destination: "/about-us/history-of-nice",
				permanent: true,
			},
			{
				source: "/news/nice-newsletters-and-alerts",
				destination: "/nice-newsletters-and-alerts",
				permanent: true,
			},
			{
				source: "/re-using-our-content/public-task",
				destination: "/reusing-our-content/public-task",
				permanent: true,
			},
			{
				source: "/Get-Involved/Meetings-in-public",
				destination: "/get-involved/meetings-in-public",
				permanent: true,
			},
			{
				source: "/about/what-we-do/digital-health",
				destination: "/what-nice-does/digital-health",
				permanent: true,
			},
			{
				source: "/about/who-we-are/our-principles",
				destination: "/about-us/our-principles",
				permanent: true,
			},
			{
				source: "/about/who-we-are/sustainability",
				destination: "/about-us/sustainability",
				permanent: true,
			},
			{
				source: "/about/what-we-do/accreditation",
				destination: "/what-nice-does/accreditation",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market",
				permanent: true,
			},
			{
				source: "/forms/life-sciences-contact-us",
				destination: "/forms/nice-advice-contact-us",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/index",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/about/who-we-are/our-charter",
				destination: "/about-us/corporate-publications/our-charter",
				permanent: true,
			},
			{
				source: "/Get-Involved/our-committees",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source: "/Get-Involved/Consultations",
				destination: "/get-involved/consultations",
				permanent: true,
			},
			{
				source: "/standards-and-indicators",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/get-involved/contact-us",
				destination: "/contact-us",
				permanent: true,
			},
			{
				source: "/about/who-we-are/board",
				destination: "/about-us/our-board/board-members",
				permanent: true,
			},
			{
				source: "/get-involved/careers",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/news/press-and-media",
				destination: "/contact-us",
				permanent: true,
			},
			{
				source: "/re-using-our-content",
				destination: "/reusing-our-content",
				permanent: true,
			},
			{
				source: "/covid-19/rapid-c19",
				destination: "/rapid-c-19",
				permanent: true,
			},
			{
				source: "/get-involved/jobs",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/guidance/proposed",
				destination: "/guidance/awaiting-development",
				permanent: true,
			},
			{
				source: "/about/what-we-do",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/bnfc-uk-only",
				destination: "/bnfc-via-nice-is-only-available-in-the-uk",
				permanent: true,
			},
			{
				source: "/bnf-uk-only",
				destination: "/bnf-via-nice-is-only-available-in-the-uk",
				permanent: true,
			},
			{
				source: "/cks-uk-only",
				destination: "/cks-is-only-available-in-the-uk",
				permanent: true,
			},
			{
				source: "/news/events",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/indicators",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/about",
				destination: "/about-us",
				permanent: true,
			},
			{
				source: "/aac",
				destination: "https://www.england.nhs.uk/aac/about-us/who-we-are/",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/research-and-development/research-recommendations/:slug*",
				destination:
					"/about/what-we-do/science-policy-research/research-recommendations",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/qofindicators/:path*",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/gpqualityimprovements/:path*",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/:path*",
				destination: "/indicators/published",
				permanent: true,
			},
		];
	},
	async headers() {
		return [
			{
				// Add common headers to all pages
				source: "/(.*)",
				headers: commonHeaders,
			},
		];
	},
	transpilePackages: [
		...niceDigitalModulesToTranspile,
		...nonES5ModulesToTranspile,
		...globalNavHooksToTranspile,
	],
	typescript: {
		// We run our own typechecking so no need to do it twice
		ignoreBuildErrors: process.env.NODE_ENV === "production",
	},
	sassOptions: {
		fiber: false,
		includePaths: [path.join(__dirname, "node_modules/@nice-digital")],
	},
	images: {
		// https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
		remotePatterns: [
			{
				protocol: "https",

				hostname: "**.nice.org.uk",
				port: "",
			},
			{
				protocol: "https",

				hostname: "a.storyblok.com",
				port: "",
			},
		],
	},
};

// The weird comment syntax below is a JSDoc TypeScript cast: https://edibleco.de/2UMm8nx
/** @type {import('next').NextConfig} */
const finalConfig = withNodeConfig(nextConfig);

// Delete the following properties now we are finished with them or next-js will warn 'root value has an unexpected property xxx - which is not in the list of allowed properties'
delete finalConfig["nodeConfigServerKey"];
delete finalConfig["nodeConfigPublicKey"];

module.exports = finalConfig;
