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
	{
		key: "Content-Security-Policy",
		value: "frame-ancestors 'self' https://app.storyblok.com",
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

// TODO: Prevent the live site being embedded in iframes at all, as only test sites are used by the Storyblok preview editor. Not currently possible due to env var limitations within build/deploy workflow; var used in logic may need tweaking and will need adding to configs etc.
// if (process.env.HOSTNAME === "www.nice.org.uk") {
// 	commonHeaders.push(
// 		{
// 			key: "X-Frame-Options",
// 			value: "DENY",
// 		},
// 		{
// 			key: "Content-Security-Policy",
// 			value: "frame-ancestors 'none'",
// 		}
// 	);
// }

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
					"/:productRoot(indicators|guidance)/:statusSlug(indevelopment|discontinued|awaiting-development|prioritisation)/:path*",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/technology-appraisal-and-highly-specialised-technologies-appeals/past-appeals-and-decisions",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-and-highly-specialised-technologies-appeals/past-appeals-and-decisions",
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
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/participation-in-clinical-trials-and-subsequent-access-to-drugs-appraised-by-nice-a-statement-on-the-applicability-of-about-technology-appraisal-guidance",
				destination: "/corporate/ecd17/chapter/position-statement",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/data/appraisal-recommendations",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-data-appraisal-recommendations",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/process/mta-timeline",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/technology-appraisal-processes-and-timelines/multiple-technology-appraisal-process-timeline",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/charging/procedure-tahst",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/fees-for-technology-appraisals-and-highly-specialised-technologies/charging-procedure",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/charging/procedure-hst",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/charging-for-technology-appraisals-and-highly-specialised-technologies/charging-procedure-technology-appraisal-and-highly-specialised-technologies-evaluations ",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/charging/timelines-hst",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/charging-for-technology-appraisals-and-highly-specialised-technologies/charging-procedure-technology-appraisal-and-highly-specialised-technologies-evaluations ",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/charging/procedure-ta",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/charging-for-technology-appraisals-and-highly-specialised-technologies/charging-procedure-technology-appraisal-and-highly-specialised-technologies-evaluations ",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/charging/timelines-ta",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/charging-for-technology-appraisals-and-highly-specialised-technologies/charging-procedure-technology-appraisal-and-highly-specialised-technologies-evaluations ",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/process/sta-timeline",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/technology-appraisal-processes-and-timelines/single-technology-appraisal-timeline",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/process/sta-timeline",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/technology-appraisal-processes-and-timelines/single-technology-appraisal-timeline",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/consultation-on-changes-to-technology-appraisals-and-highly-specialised-technologies",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/methods-and-processes-used-before-2022/methods-and-processes-used-before-2022",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/biosimilar-technologies-nice-position-statement-information-for-the-public",
				destination: "/corporate/ecd14/informationforpublic",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/costs--charging-for-technology-appraisals-and-highly-specialised-technologies/",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/fees-for-technology-appraisals-and-highly-specialised-technologies",
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
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/biosimilar-technologies-nice-position-statement-information-for-the-public",
				destination: "/corporate/ecd14/informationforpublic",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-highly-specialised-technologies-guidance/proposed-highly-specialised-technology-evaluations",
				destination: "/guidance/proposed?type=hst",
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
				destination: "/corporate/ecd15/chapter/position-statement",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/cancer-drugs-fund-new-process-proposal-consultation-2015",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/abbreviated-technology-appraisal-process-consultation",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/chemotherapy-dose-standardisation-nice-position-statement",
				destination: "/corporate/ecd15/chapter/position-statement",
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
					"/about/what-we-do/life-sciences/scientific-advice/models-for-the-evaluation-and-purchase-of-antimicrobials/ceftazidime-with-avibactam",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/models-for-the-evaluation-and-purchase-of-antimicrobials",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/biosimilar-technologies-nice-position-statement",
				destination: "/corporate/ecd14/chapter/position-statement",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-:about(about-)?technology-appraisal-guidance/changes-to-health-technology-evaluation",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-:about(about-)?technology-appraisal-guidance/achieving-and-demonstrating-compliance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/compliance-with-nice-approved-medicine-or-treatment",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/methods-of-technology-appraisal-consultation",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/public-involvement-programme/patient-public-involvement-policy",
				destination:
					"/get-involved/people-and-communities/patient-and-public-involvement-policy",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/biosimilar-technologies-nice-position-statement",
				destination: "/corporate/ecd14/chapter/position-statement",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/achieving-and-demonstrating-compliance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/compliance-with-nice-approved-medicine-or-treatment",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/models-for-the-evaluation-and-purchase-of-antimicrobials/cefiderocol",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/models-for-the-evaluation-and-purchase-of-antimicrobials",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/medical-technologies-guidance/medical-technologies-guidance-static-list",
				destination: "/what-nice-does",
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
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/uk-licensing-and-technology-appraisals",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/uk-licensing-and-technology-appraisals",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/technology-appraisal-static-list",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
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
					"/about/what-we-do/life-sciences/scientific-advice/scientific-advice-education-and-training-/speaking-engagements",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service/educational-webinars-and-masterclasses",
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
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest",
				destination:
					"/what-nice-does/our-guidance/about-interventional-procedures-guidance/interventional-procedures-register-an-interest",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-notification-form",
				destination: "/get-involved/interventional-procedures-notification",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-diagnostics-guidance/diagnostics-guidance-static-list",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/types-of-recommendation",
				destination:
					"/what-nice-does/our-guidance/types-of-recommendation-nice-can-make",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/scientific-advice-education-and-training-/site-visits",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service/educational-webinars-and-masterclasses",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/using-nice-guidelines-to-make-decisions",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/making-decisions-using-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/summary-of-decisions",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-diagnostics-guidance/dt-stakeholder-registration",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration-diagnostic-technologies",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/scientific-advice-education-and-training-/seminars",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service/educational-webinars-and-masterclasses",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/cancer-drugs-fund",
				destination:
					"/what-nice-does/patient-access-schemes-and-pricing-agreements/managed-access",
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
					"/about/what-we-do/our-programmes/nice-guidance/interventional-procedures-guidance/recommendations",
				destination:
					"/what-nice-does/our-guidance/types-of-recommendation-nice-can-make",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/interventional-procedures-guidance/timeline",
				destination: "/process/pmg28/chapter/introduction",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/nice-medicines-practice-guidelines",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/how-we-develop-nice-guidelines",
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
					"/what-nice-does/our-guidance/about-medical-technologies-guidance",
				destination: "/what-nice-does/our-guidance/about-healthtech-guidance",
				permanent: true,
			},
			{
				source:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/get-involved-with-medical-technologies-guidance",
				destination:
					"/what-nice-does/our-guidance/about-healthtech-guidance/get-involved-with-healthtech-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-medical-technologies-guidance/get-involved",
				destination:
					"/what-nice-does/our-guidance/about-healthtech-guidance/get-involved-with-healthtech-guidance",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/nice-public-health-guidelines",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/how-we-develop-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/nice-safe-staffing-guidelines",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/how-we-develop-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/eq-5d-5l",
				destination: "/corporate/ecd16/chapter/introduction",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/nice-social-care-guidelines",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/how-we-develop-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/what-nice-does/our-guidance/about-diagnostics-guidance/diagnostics-assessment-programme-process-timeline",
				destination:
					"/what-nice-does/our-guidance/about-healthtech-guidance/process-timeline-for-healthtech-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-diagnostics-guidance/process-timeline",
				destination:
					"/what-nice-does/our-guidance/about-healthtech-guidance/process-timeline-for-healthtech-guidance",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/nice-clinical-guidelines",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/how-we-develop-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/data",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
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
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/types-of-guideline",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/how-we-develop-nice-guidelines",
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
					"/about/nice-communities/social-care/quick-guides/developing-a-positive-working-culture-for-supporting-disabled-children-and-young-people-with-severe-complex-needs",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
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
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/organisations-eligible-to-use-the-framework",
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
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/purchasing-steps--further-competition",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-further-competition",
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
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books-journals-and-databases/purchasing-steps--direct-awards",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-direct-awards",
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
					"/get-involved/our-committees/what-lay-members-do/lay-member-payments-and-expenses/how-lay-member-payments-affect-benefits",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/european-health-technology-assessment-and-regulatory-concurrent-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/reviewing-our-process-for-health-technology-evaluation--consultation",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
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
					"/about/what-we-do/evidence-and-best-practice-resources/evidence-search/evidence-search-service-closure-information",
				destination: "/library-and-knowledge-services",
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
					"/about/nice-communities/nice-and-the-public/public-involvement/getting-involved-as-someone-with-lived-experience",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-someone-with-lived-experience",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/nice-advice-service/models-for-the-evaluation-and-purchase-of-antimicrobials",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/a-new-model-for-evaluating-and-purchasing-antimicrobials-in-the-uk",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/office-for-market-access/identify-the-most-appropriate-routes-to-nhs-access",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service/nice-advice-working-on-your-objectives",
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
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/office-for-market-access/changing-healthcare-landscape-and-your-technology",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
					"/about/nice-communities/social-care/quick-guides/promoting-positive-mental-wellbeing-for-older-people",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
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
					"/about/nice-communities/social-care/quick-guides/what-to-expect-during-assessment-and-care-planning",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-advice/evidence-summaries-medicines-and-prescribing-briefings",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
					"/about/who-we-are/board/public-board-meetings/public-board-meeting-agenda-and-papers--january-2022",
				destination: "/about-us/our-board/public-board-meetings/2022",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/commissioning-support-programme/how-we-support-policy-development",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-advice/evidence-summaries-unlicensed-or-off-label-medicines",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
					"/about/what-we-do/nice-international/about-nice-international/nice-international-advisory-group",
				destination: "/what-nice-does/nice-international",
				permanent: true,
			},
			{
				source:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/how-we-develop-medical-technologies-guidance",
				destination:
					"/what-nice-does/our-guidance/about-healthtech-guidance/how-we-develop-healthtech-guidance",
				permanent: true,
			},
			{
				source:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/get-a-medical-technology-evaluated",
				destination:
					"/what-nice-does/our-guidance/about-healthtech-guidance/get-a-healthtech-evaluated",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-medical-technologies-evaluation-programme",
				destination:
					"/what-nice-does/our-guidance/about-healthtech-guidance/get-a-healthtech-evaluated",
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
					"/about/what-we-do/life-sciences/scientific-advice/european-early-dialogues-scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/public-involvement-programme",
				destination: "/get-involved/people-and-communities",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/nice-international/about-nice-international/nice-international-associates",
				destination: "/what-nice-does/nice-international",
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
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/office-for-market-access/exploring-your-value-proposition",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/office-for-market-access/safe-harbour-engagement-meetings",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-about-medical-technologies-guidance",
				destination: "/what-nice-does/our-guidance/about-healthtech-guidance",
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
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-interventional-procedures-guidance",
				destination:
					"/what-nice-does/our-guidance/about-interventional-procedures-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/commissioning-support-programme/policy-working-groups",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
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
					"/about/what-we-do/into-practice/measuring-the-impact-of-nice-guidance/uptake-reports",
				destination:
					"/implementing-nice-guidance/measuring-the-use-of-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/nice-advice-service/early-access-to-medicines-scheme",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/early-access-to-medicines-scheme-eams",
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
					"/about/what-we-do/our-programmes/nice-guidance/antimicrobial-prescribing-guidelines",
				destination:
					"/guidance/health-protection/communicable-diseases/antimicrobial-stewardship",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/hdas-closure-information",
				destination: "/library-and-knowledge-services",
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
					"/about/what-we-do/into-practice/measuring-the-uptake-of-nice-guidance/uptake-data",
				destination:
					"/implementing-nice-guidance/measuring-the-use-of-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/local-practice-collection/shared-learning-awards",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-medical-technologies-guidance",
				destination: "/what-nice-does/our-guidance/about-healthtech-guidance",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-technology-appraisal-guidance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
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
					"/about/what-we-do/into-practice/nice-resource-impact-assessments/learning-events",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/assessing-the-resource-impact-of-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/commissioning-support-programme/working-with-us",
				destination: "/what-nice-does",
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
					"/about/what-we-do/life-sciences/scientific-advice/set-scientific-advice-process",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/nice-cadth-scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/commissioning-support-programme/our-documents",
				destination: "/what-nice-does",
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
					"/about/what-we-do/life-sciences/scientific-advice/nice-mhra-scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-advice/evidence-summaries-new-medicines",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
					"/about/what-we-do/life-sciences/scientific-advice/frequently-asked-questions",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
					"/about/what-we-do/evidence-services/evidence-search/evidence-search-content",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/express-scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
					"/about/what-we-do/life-sciences/scientific-advice/devices-and-diagnostics",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/light-scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/pharmaceutical-products",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/commissioning-support-programme/our-work",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/what-nice-does/our-guidance/about-diagnostics-guidance",
				destination: "/what-nice-does/our-guidance/about-healthtech-guidance",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-diagnostics-guidance",
				destination: "/what-nice-does/our-guidance/about-healthtech-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/education-and-training",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/chte-methods-consultation",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
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
					"/about/what-we-do/evidence-services/journals-and-databases/OpenAthens",
				destination: "/library-and-knowledge-services/openathens",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/return-on-investment-tools/feedback",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/assessing-the-resource-impact-of-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-Advice/Key-therapeutic-topics",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/evidence-search/how-to-search",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/medtech-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
					"/about/what-we-do/life-sciences/scientific-advice/case-studies",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/scientific-advice/prima",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/health-technology-evaluation-at-nice--what-happens-after-the-transition-period",
				destination:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics",
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
					"/get-involved/meetings-in-public/quality-standards-advisory-committee/quality-standards-advisory-committee-members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/quality-standards-advisory-committee/quality-standards-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/patient-access-schemes-liaison-unit/list-of-technologies-with-approved-patient-access-schemes",
				destination: "/what-nice-does/commercial-liaison-team",
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
			// NOTE this is commented out until research recs go live
			// {
			// 	source:
			// 		"/about/what-we-do/research-and-development/research-recommendations/:slug*",
			// 	destination:
			// 		"/about/what-we-do/science-policy-research/research-recommendations",
			// 	permanent: true,
			// },
			{
				source:
					"/about/what-we-do/digital-health/multi-agency-advisory-service-for-ai-and-data-driven-technologies",
				destination:
					"/what-nice-does/digital-health/artificial-intelligence-ai-and-digital-regulations-service",
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
					"/about/what-we-do/our-research-work/use-of-ai-in-evidence-generation--nice-position-statement",
				destination: "/corporate/ecd11",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/office-for-market-access/identify-the-most-appropriate-routes-to-nhs-access",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
					"/about/what-we-do/office-for-market-access/changing-healthcare-landscape-and-your-technology",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
					"/about/what-we-do/evidence-services/evidence-search-process-and-methods-manual-consultation",
				destination: "/what-nice-does/",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/resources-for-administrators",
				destination: "https://library.hee.nhs.uk/resources/openathens",
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
					"/Get-Involved/Meetings-in-public/Interventional-Procedures-Advisory-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/interventional-procedures-advisory-committee/interventional-procedures-advisory-committee-members",
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
					"/about/what-we-do/nice-syndication-api/syndication-case-study-elseviers-clinical-key",
				destination: "/reusing-our-content/nice-syndication-api",
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
					"/get-involved/meetings-in-public/quality-standards-advisory-committee/qsac2-members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/quality-standards-advisory-committee/quality-standards-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/quality-standards-advisory-committee/qsac3-members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/quality-standards-advisory-committee/quality-standards-advisory-committee-members",
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
				destination: "/get-involved/our-committees",
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
					"/about/nice-communities/social-care/using-nice-guidance-principal-social-workers",
				destination:
					"/implementing-nice-guidance/social-care/using-nice-guidance-in-social-work-scenarios/families-and-relationships-settings/developing-relationships-with-parents",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/public-involvement/patient-and-public-involvement-policy",
				destination:
					"/get-involved/people-and-communities/patient-and-public-involvement-policy",
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
					"/about/nice-communities/library-and-knowledge-services-staff/training-materials",
				destination: "https://library.hee.nhs.uk/resources/openathens",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/join-a-committee/how-to-apply-to-join-a-committee",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/scientific-advice/european-early-dialogues-scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
					"/about/nice-communities/nice-and-the-public/making-decisions-about-your-care",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/about-shared-decision-making",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/making-decisions-about-your-care/Information-for-the-public-on-medicines",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/about-shared-decision-making",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/making-decisions-about-your-care/patient-decision-aids",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/about-shared-decision-making",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/office-for-market-access/early-access-to-medicines-scheme",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/office-for-market-access/exploring-your-value-proposition",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/office-for-market-access/safe-harbour-engagement-meetings",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
					"/about/who-we-are/corporate-publications/trade-union-facility-time-report",
				destination:
					"/about-us/policies-procedures-and-reports/trade-union-facility-time-report",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/public-involvement/putting-guidance-into-practice",
				destination: "/get-involved/people-and-communities",
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
					"/about/nice-communities/public-involvement/public-involvement-programme",
				destination: "/get-involved/people-and-communities",
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
					"/about/what-we-do/into-practice/health-technologies-adoption-programme",
				destination:
					"/implementing-nice-guidance/implementation-help-and-advice/adoption-and-implementation-support",
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
					"/about/what-we-do/into-practice/measuring-the-impact-of-nice-guidance",
				destination:
					"/implementing-nice-guidance/measuring-the-use-of-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/savings-and-productivity-collection",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/resource-planner",
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
					"/about/what-we-do/into-practice/health-technologies-adoption-team",
				destination:
					"/implementing-nice-guidance/implementation-help-and-advice/adoption-and-implementation-support",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/nice-syndication-api/apply-for-nice-syndication",
				destination: "/reusing-our-content/nice-syndication-api",
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
					"/about/nice-communities/public-involvement/develop-nice-guidance",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-a-voluntary-and-community-sector-organisation/how-voluntary-and-community-sector-organisations-can-help-us-develop-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/accreditation/whats-happening-in-accreditation",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/commissioning-support-programme",
				destination: "/implementing-nice-guidance",
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
					"/about/what-we-do/scientific-advice/nice-mhra-scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
					"/about/what-we-do/scientific-advice/frequently-asked-questions",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
				source: "/about/what-we-do/into-practice/help-implement-nice-guidance",
				destination: "/get-involved/help-implement-nice-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international/nice-international-team",
				destination: "/what-nice-does/nice-international",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/shared-learning-case-studies",
				destination: "/implementing-nice-guidance",
				permanent: true,
			},
			{
				source: "/About/What-we-do/International-services/knowledge-transfer",
				destination: "/what-nice-does/nice-international",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/local-practice-case-studies",
				destination: "/implementing-nice-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/scientific-advice/light-scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/implementing-nice-guidance",
				destination: "/implementing-nice-guidance",
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
				source: "/about/what-we-do/our-programmes/local-practice-collection",
				destination: "/what-nice-does",
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
				source: "/about/who-we-are/executive-team/executive-team-meetings",
				destination: "/about-us/executive-team/executive-team",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/office-for-market-access",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/nice-communities/generalpractice/reference-panel",
				destination:
					"/implementing-nice-guidance/subscribe-to-our-gp-reference-panel",
				permanent: true,
			},
			{
				source: "/about/what-we-do/accreditation/accreditation-decisions",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/commissioning-support",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/assessing-the-resource-impact-of-nice-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/hta-lab-projects",
				destination:
					"/what-nice-does/our-research-work/hta-lab/hta-lab-projects",
				permanent: true,
			},
			{
				source: "/about/nice-communities/public-involvement/your-care",
				destination: "/what-nice-does",
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
				source: "/about/what-we-do/evidence-services/evidence-search",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/into-practice-guide",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/about/what-we-do/commercial-liaison-team/services",
				destination:
					"/what-nice-does/patient-access-schemes-and-pricing-agreements/services",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
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
				source: "/about/what-we-do/our-programmes/topic-selection",
				destination: "/guidance/prioritisation",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/get-in-touch",
				destination: "/what-nice-does/our-research-work",
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
				source: "/about/what-we-do/into-practice/forward-planner",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/resource-planner",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/contact-us-form",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service/nice-advice-contact-us",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/nice-guidance",
				destination: "/what-nice-does/our-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-syndication-api/content",
				destination: "/reusing-our-content/nice-syndication-api",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/adoption-team",
				destination:
					"/implementing-nice-guidance/implementation-help-and-advice/adoption-and-implementation-support",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/nice-advice",
				destination: "/guidance/published?ndt=NICE+advice",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/hta-lab",
				destination: "/what-nice-does/our-research-work/hta-lab",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/endorsement",
				destination: "/implementing-nice-guidance",
				permanent: true,
			},
			{
				source: "/about/who-we-are/board/interests-register",
				destination:
					"/about-us/board/board-executive-team-and-senior-leaders-interests-register",
				permanent: true,
			},
			{
				source: "/about/who-we-are/board/board-committees",
				destination: "/about-us/our-board/board-committees",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-dementia-with-the-contact-details-of-a-named-carer-on-their-record",
				destination: "/indicators/IND114-dementia-named-carer",
				permanent: true,
			},
			{
				source: "/About/Who-we-are/Board/Board-expenses",
				destination: "/about-us/our-board/board-expenses",
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
				source: "/standards-and-indicators/developing-nice-quality-standards",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/how-we-develop-ccg-ois",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/how-we-develop-qof",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/quality-standard-consultation",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/support-a-quality-standard",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/topic-engagement",
				destination: "/what-nice-does/standards-and-indicators",
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
					"/Get-Involved/Meetings-in-public/Highly-Specialised-Technologies-Evaluation-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/highly-specialised-technologies-evaluation-committee",
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
					"/Get-Involved/Meetings-in-public/Interventional-Procedures-Advisory-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/interventional-procedures-advisory-committee",
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
					"/about/what-we-do/patient-access-schemes-liaison-unit#list-of-arrangements",
				destination:
					"/what-nice-does/patient-access-schemes-and-pricing-agreements",
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
					"/Get-Involved/Meetings-in-public/Medical-Technologies-Advisory-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/medical-technologies-advisory-committee",
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
					"/get-involved/stakeholder-registration/tobacco-industry-organisations",
				destination: "/corporate/ecd13/chapter/position-statement",
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
					"/get-involved/jobs/our-benefits--rewards-and-work-life-balance",
				destination: "/careers/our-benefits-rewards-and-work-life-balance",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/how-gps-help-develop-our-guidance",
				destination: "/get-involved/our-committees",
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
				source: "/about/what-we-do/bringing-our-guidance-together-by-topic",
				destination:
					"/what-nice-does/our-guidance/bringing-our-guidance-together-by-topic",
				permanent: true,
			},
			{
				source: "/get-involved/our-committees/what-professional-members-do",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source: "/Get-Involved/Meetings-in-public/Appeal-panel-membership",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-and-highly-specialised-technologies-appeals/appeal-panel-membership",
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
				source: "/about/what-we-do/patient-access-schemes-liaison-unit",
				destination: "/what-nice-does/accreditation",
				permanent: true,
			},
			{
				source: "/about/what-we-do/forward-view---our-priority-topics",
				destination:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics/forward-view-our-priority-topics",
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
				source: "/get-involved/our-committees/what-lay-members-do",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source: "/about/what-we-do/real-world-evidence-framework",
				destination: "/corporate/ecd9/chapter/overview",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-and-health-inequalities",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities",
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
				source: "/about/nice-communities/general-practitioners",
				destination:
					"/implementing-nice-guidance/general-practice-keep-your-practice-up-to-date",
				permanent: true,
			},
			{
				source: "/get-involved/our-committees/join-a-committee",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source: "/get-involved/fellows-and-scholars/scholars",
				destination: "/get-involved",
				permanent: true,
			},
			{
				source: "/about/nice-communities/nice-and-the-public",
				destination: "/get-involved/people-and-communities",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/diversity-and-inclusion",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/we-care-about-our-staff",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/about/nice-communities/public-involvement",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/about/what-we-do/office-for-market-access",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/research-and-development",
				destination: "/what-nice-does/our-research-work",
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
				source: "/about/what-we-do/science-policy-research",
				destination: "/what-nice-does/our-research-work",
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
				source: "/about/what-we-do/international-services",
				destination: "/what-nice-does/nice-international",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/executive-recruitment",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/about/nice-communities/generalpractice",
				destination:
					"/implementing-nice-guidance/general-practice-keep-your-practice-up-to-date",
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
				source: "/about/what-we-do/scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/evidence-services",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/about/who-we-are/history-of-nice",
				destination: "/about-us/history-of-nice",
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
				source: "/about/what-we-do/our-programmes",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice",
				destination: "/implementing-nice-guidance",
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
				source: "/about/who-we-are/nice-connect",
				destination: "/about-us/corporate-publications",
				permanent: true,
			},
			{
				source: "/about/who-we-are/our-charter",
				destination: "/about-us/corporate-publications/our-charter",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/eq-5d-5l",
				destination: "/corporate/ecd16/chapter/introduction",
				permanent: true,
			},
			{
				source: "/about/who-we-are/our-vision",
				destination: "/about-us",
				permanent: true,
			},
			{
				source: "/about/who-we-are/board",
				destination: "/about-us/our-board/board-members",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/quality-standard-consultations",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/gpqualityimprovements/:path*",
				destination: "/indicators/published",
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
					"/get-involved/study-nice-and-lse-s-executive-msc-healthcare-decision-making",
				destination:
					"/get-involved/nice-training-and-development-opportunities/study-nice-and-lse-s-executive-msc-healthcare-decision-making",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/:path*",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source:
					"/aac/identifying-high-potential-products-and-accelerating-access-to-market",
				destination: "https://www.england.nhs.uk/aac/about-us/who-we-are/",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/qofindicators/:path*",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source:
					"/forms/subscribe-to-medicines-and-prescribing-important-new-evidence",
				destination: "/nice-newsletters-and-alerts",
				permanent: true,
			},
			{
				source: "/forms/subscribe-to-medicine-and-prescribing-alerts",
				destination: "/nice-newsletters-and-alerts",
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
				source: "/standards-and-indicators/quality-standards-topic-library",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards/selecting-and-prioritising-quality-standard-topics",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/how-to-use-quality-standards",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards/how-to-use-quality-standards",
				permanent: true,
			},
			{
				source: "/terms-and-conditions/cks-end-user-licence-agreement",
				destination: "/cks-end-user-licence-agreement",
				permanent: true,
			},
			{
				source: "/re-using-our-content/content-assurance-service",
				destination: "/reusing-our-content/content-assurance-service",
				permanent: true,
			},
			{
				source: "/re-using-our-content/uk-open-content-licence",
				destination: "/reusing-our-content/use-of-nice-content-in-the-uk",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/quality-standards",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards",
				permanent: true,
			},
			{
				source: "/Get-Involved/stakeholder-registration",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/get-involved",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/indicators",
				destination: "/what-nice-does/standards-and-indicators/indicators",
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
				source: "/forms/life-sciences-contact-us",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service/nice-advice-contact-us",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/index",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/get-involved/citizens-council",
				destination: "/get-involved",
				permanent: true,
			},
			{
				source: "/Get-Involved/join-a-committee",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source: "/about/what-we-do/evidence-services",
				destination: "/library-and-knowledge-services",
				permanent: true,
			},
			{
				source: "/get-involved/nice-listens",
				destination: "/what-nice-does/our-research-work/nice-listens",
				permanent: true,
			},
			{
				source: "/get-involved/contact-us",
				destination: "/contact-us",
				permanent: true,
			},
			{
				source: "/get-involved/scholars",
				destination: "/get-involved",
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
				source: "/get-involved/fellows",
				destination: "/get-involved",
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
				source: "/about/who-we-are",
				destination: "/about-us",
				permanent: true,
			},
			{
				source: "/news/events",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/aac/about",
				destination: "https://www.england.nhs.uk/aac/about-us/who-we-are/",
				permanent: true,
			},
			{
				source: "/terms-and-conditions#notice-of-rights",
				destination: "/terms-and-conditions",
				permanent: true,
			},
			{
				source: "/standards-and-indicators",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/re-using-our-content",
				destination: "/reusing-our-content",
				permanent: true,
			},
			{
				source: "/leave-feedback",
				destination: "/website-feedback",
				permanent: true,
			},
			{
				source: "/cks-uk-only",
				destination: "/cks-is-only-available-in-the-uk",
				permanent: true,
			},
			{
				source: "/covid-19",
				destination:
					"/guidance/conditions-and-diseases/respiratory-conditions/covid19",
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
					"/position-statements/use-of-ai-in-evidence-generation-nice-position-statement",
				destination: "/corporate/ecd11",
				permanent: true,
			},
			{
				source:
					"/position-statements/position-statement-on-engagement-with-tobacco-industry-organisations",
				destination: "/corporate/ecd13/chapter/position-statement",
				permanent: true,
			},
			{
				source:
					"/position-statements/biosimilar-technologies-nice-position-statement",
				destination: "/corporate/ecd14/chapter/position-statement",
				permanent: true,
			},
			{
				source:
					"/position-statements/biosimilar-technologies-nice-position-statement-information-for-the-public",
				destination: "/corporate/ecd14/informationforpublic",
				permanent: true,
			},
			{
				source:
					"/position-statements/chemotherapy-dose-standardisation-nice-position-statement",
				destination: "/corporate/ecd15/chapter/position-statement",
				permanent: true,
			},
			{
				source:
					"/position-statements/position-statement-on-use-of-the-eq-5d-5l-value-set-for-england-updated-october-2019",
				destination: "/corporate/ecd16/chapter/introduction",
				permanent: true,
			},
			{
				source:
					"/position-statements/participation-in-clinical-trials-and-subsequent-access-to-drugs-appraised-by-nice-a-statement-on-the-applicability-of-technology-appraisal-guidance",
				destination: "/corporate/ecd17/chapter/position-statement",
				permanent: true,
			},
			{
				source: "/forms/candidates-for-modular-updates",
				destination:
					"/what-nice-does/our-guidance/candidates-for-modular-updates",
				permanent: true,
			},
			{
				source: "/forms/help-implement-nice-guidance",
				destination:
					"/get-involved/adoption-and-impact-reference-panel-membership",
				permanent: true,
			},
			{
				source: "/forms/interventional-procedures-notification",
				destination: "/get-involved/interventional-procedures-notification",
				permanent: true,
			},
			{
				source: "/forms/interventional-procedures-register-an-interest",
				destination:
					"/what-nice-does/our-guidance/about-interventional-procedures-guidance/interventional-procedures-register-an-interest",
				permanent: true,
			},
			{
				source: "/forms/leave-feedback",
				destination: "/website-feedback",
				permanent: true,
			},
			{
				source: "/forms/nice-advice-contact-us",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service/nice-advice-contact-us",
				permanent: true,
			},
			{
				source: "/forms/nice-content-assurance-service",
				destination: "/reusing-our-content/nice-content-assurance-service",
				permanent: true,
			},
			{
				source:
					"/forms/nice-health-technology-assessment-training-registration",
				destination:
					"/get-involved/nice-training-and-development-opportunities/nice-health-technology-assessment-training-registration",
				permanent: true,
			},
			{
				source: "/forms/nice-international-enquiry-form",
				destination:
					"/what-nice-does/nice-international/nice-international-enquiry",
				permanent: true,
			},
			{
				source:
					"/forms/permission-request-form-for-international-use-of-nice-content",
				destination:
					"/reusing-our-content/permission-request-for-international-use-of-nice-content",
				permanent: true,
			},
			{
				source:
					"/forms/permission-to-use-nice-content-for-artificial-intelligence-ai-purposes",
				destination:
					"/reusing-our-content/use-of-our-content-for-ai-purposes/permission-to-use-nice-content-for-ai-purposes",
				permanent: true,
			},
			{
				source: "/forms/public-involvement-programme-expert-panel-application",
				destination:
					"/get-involved/people-and-communities/people-and-communities-network-application",
				permanent: true,
			},
			{
				source: "/forms/request-a-speaker",
				destination: "/events/speaker-request",
				permanent: true,
			},
			{
				source: "/forms/request-for-prioritisation-clarification",
				destination:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/request-for-prioritisation-clarification",
				permanent: true,
			},
			{
				source: "/forms/subscribe-to-nice-news-for-health-and-social-care",
				destination:
					"/nice-newsletters-and-alerts/subscribe-to-nice-news-for-health-and-social-care",
				permanent: true,
			},
			{
				source: "/forms/subscribe-to-nice-news-for-life-sciences",
				destination:
					"/nice-newsletters-and-alerts/subscribe-to-nice-news-for-life-sciences",
				permanent: true,
			},
			{
				source: "/forms/subscribe-to-nice-news-international",
				destination:
					"/nice-newsletters-and-alerts/subscribe-to-nice-news-international",
				permanent: true,
			},
			{
				source: "/forms/subscribe-to-our-gp-reference-panel",
				destination:
					"/implementing-nice-guidance/subscribe-to-our-gp-reference-panel",
				permanent: true,
			},
			{
				source: "/forms/subscribe-to-update-for-primary-care",
				destination:
					"/nice-newsletters-and-alerts/subscribe-to-update-for-primary-care",
				permanent: true,
			},
			{
				source: "/forms/syndication-service-application-form",
				destination: "/reusing-our-content/syndication-service-application",
				permanent: true,
			},
			{
				source: "/forms/topic-suggestion",
				destination:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics/topic-suggestion",
				permanent: true,
			},
			{
				source: "/forms/use-of-nice-content-in-the-uk",
				destination: "/reusing-our-content/use-of-nice-content-in-the-uk",
				permanent: true,
			},
			// Health Inequalities restructure 01/26
			{
				source:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/:slug(what-are-health-inequalites|approaches-to-addressing-health-inequalities|nice-and-core20plus5-children-and-young-people(?:/.*)?|nice-and-core20plus5-adults(?:/.*)?|nice-and-the-adapted-labonte-model(?:/.*)?|nice-and-the-marmot-review(?:/.*)?)",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/health-inequalities-the-wider-picture",
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
