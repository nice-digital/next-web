# **Nice Website Forms**

**Overview**

All forms from the Orchard platform on the Nice website have been  migrated to the JotForms platform. This move includes redirections using the Rewrite Rules feature in Orchard to handle old URLs.

**Redirecting Old URLs**

In Orchard's admin panel (accessible via https://www.nice.org.uk/admin), Rewrite Rules are employed to redirect old URLs to their corresponding new locations on the '/forms' path. Example rule:

```apacheCopy code

RewriteRule ^/about/what-we-do/life-sciences/contact-us-form$ /forms/life-sciences-contact-us [L,R=301,NC]

```

**Note:** Exercise caution when editing Orchard rewrites and check no-one is editing at the same time to avoid conflicts with simultaneous edits. Always back up the entire rewrites text field before making any changes, just in case.

For stubbornly cached items, consider using the 'Output Cache' feature in Orchard. If caching issues persist, waiting for the cache to naturally expire overnight is an alternative to see updated content.

**JotForms Integration**

**Platform and Access**

JotForms are served via JotForm Enterprise Edition at nice.jotform.com. To manage and edit forms, developers need a user account with sufficient privileges and must be assigned to the 'Web team and DIT' group. Access the list of forms through the 'Web team and DIT' menu item.

**JotForms Interface**

Forms are managed through the JotForms interface. Visit the edit page of a form of interest, e.g., [https://nice.jotform.com/build/220684821482963](https://nice.jotform.com/build/220684821482963). The interface has three tabs: 'Build,' 'Settings,' and 'Publish.'

- **Build:** Standard form editing features; typically, developers need to intervene only in case of specific issues as comms/publishing generate the forms themselves.
- **Settings:** Some forms are connected to mailchimp using something called an 'Integration'. You will need mailchimp admin privileges to connect a jotform to mailchimp via the mailchimp integration. Check Integrations > Mailchimp integration for required fields and dropdown options. The values and required status must match the mailchimp equivalent exactly, or the submissions won't make it into the relevant mailchimp audience, failing silently.
- **Publish:** Contrary to the name, there is no traditional publish or deployment step. This tab provides options to copy the live form link from JotForms.

**Important Considerations**

- **Global Settings:** The paint roller icon on the right contains default global settings for the look and feel of forms. Avoid changing these on a per-form basis to simplify maintenance.
- **Instant Updates:** Changes made to live forms are instantly reflected on the website. No additional publish or deployment steps are required.
- **Template Content:** Developers should remove template text content from JotForms where possible, relocating it to the relevant Next Web page props under '/web/src/pages/forms/.' Note that for multipage forms or forms where content is interspersed with form sections, this may not be feasible as the form is served via an iframe on next-web.
- **Orchard Template Content:** Some template content still resides in Orchard and requires collaboration with comms/publishing for editing and maintenance, especially in relation to calls to action and direct links to forms from information pages.

#
# Theme Editing

**Overview**

The NICE 'look and feel' on JotForms is applied through a catch-all theme, 'NICE theme', to match the NICE Design System as closely as possible. Please note that the JotForms interface sometimes changes unexpectedly as we are not in control of release/patch/deployment of JotForms enterprise edition, so the provided URLs and features are subject to change.

**Accessing Theme Editing**

- **Access url:** The theme editing page is accessed via [https://nice.jotform.com/mythemes/](https://nice.jotform.com/mythemes/), which redirects to [https://nice.jotform.com/theme-store/mythemes/](https://nice.jotform.com/theme-store/mythemes/). There is currently no UI method of reaching the themes and be aware that the URL structure may change with new enterprise versions / patches that are automatically applied by JotForms outside our control.
- **Edit page:** To edit themes, JotForms user admin privileges are required. Click on the 'NICE theme' thumbnail (broken at the time of writing) to reveal an 'Admin actions' vertical tab. The 'Edit' button provides meta-data editing, while the actual CSS editing is accessed by clicking the 'See original' icon, above the edit pencil. If you encounter difficulties locating these options, contact JotForms support via the link in the top right of the JotForms home page, as they may have been moved since the previous version.
- **Theme Editing Page direct link:** This leads to the 'NICE theme' editing page, currently [https://nice.jotform.com/themes/#edit/6216a3d8129c6f2b731b0dc1](https://nice.jotform.com/themes/#edit/6216a3d8129c6f2b731b0dc1) (note this hash will likely change on the next theme edit).

**Theme Editing Tabs**

1. **Design Tab:**
    - Can generally be left untouched as we don't change from the defaults.
2. **CSS Tab:**
    - Contains all overrides to control look and feel.
    - Always copy the current live theme CSS before making changes due to the unreliable save mechanism. No easy recovery method exists so accidental deletion will probably need JotForms support, assuming recovery is even possible.
    - For a better developer experience, consider using local overrides in Chrome DevTools (outlined in the next point). Edit your CSS locally, observe changes in the browser, and then copy the finished CSS to the 'CSS' tab in the JotForms theme editor.
    - [Chrome DevTools Overrides Guide](https://developer.chrome.com/docs/devtools/overrides)
3. **Theme Tab:**
    - Can be used to release live or alpha theme changes to the 'theme store' (e.g., 'NICE theme', 'NICE alpha 0.1') Click 'Next' and follow the instructions after editing a theme.

**Saving Changes and Publishing**

1. **Save CSS Changes:**
    - After pasting edited CSS, click the 'floppy disk' icon on the left menu to save the CSS.
    - Refresh the browser to view changes, as the save mechanism may be unreliable.
2. **Publishing:**
    - Follow the steps in the 'Theme' tab. It's not always clear if this step is necessary for editing an existing theme, but you can follow the steps and execute it anyway.

As we don't control the markup generated by JotForms, compromise is sometimes necessary when trying to match NICE Design System components. If you encounter any accessibility issues with JotForms generated markup, contact JotForms support to highlight this.

**Important Considerations**

- **CSS location and version control:** JotForms lacks version control for the theme CSS. Also, their boilerplate CSS is injected before the 'NICE theme' CSS. This prevents us from managing the theme CSS under our version control (e.g. via an import we host). Therefore, we are constrained to using the JotForms theme editor and manual version control for the foreseeable future.

#
# JotForms on Next Web

**Generating a New Form Page**

To create a new form page:

1. Copy and paste an existing page and associated snapshot test file.
2. Rename it to match the desired final path under '/forms/'.
3. Modify necessary items in the page component (e.g., formID, title, etc.).
4. Modify the necessary items in the page test - update the id, title and url only. The rest of the attributes can be safely left as is (e.g. height, status, date of submission etc), unless you have specific testing requirements. 
5. Update the snapshot and check it matches the desired form.

Example: **leave-feedback.page.tsx, leave-feedback.page.test.tsx**

The **Page** component accepts the following properties:

- **formName** : string;
- **parentPages** : { title: string; path?: string }[];
- **lead** : string;
- **informationPanel?: JSX.Element** ;
- **formHeader?: JSX.Element** ;
- **formFooter?: JSX.Element** ;
- **InformationPanel?** : Renders HTML content in a panel to the right of the form, adjusting column widths accordingly.
- **FormHeader?: JSX.Element** : Renders HTML content before the form.
- **FormFooter?: JSX.Element** : Renders HTML content after the form.

**Template Content Placement**

Whenever possible, template content should be hosted on Next Web rather than JotForms for ease of eventual transition to the Storyblok CMS. In cases of multipage forms or content interspersed with form sections, due to iframe limitations, this content will remain on JotForms.

**Debugging and Direct Form Submission**

JotForms on Next Web are embedded via iframe from [nice.jotform.com](https://nice.jotform.com/), with the unique form ID completing the path, for example: [https://nice.jotform.com/220684821482963](https://nice.jotform.com/220684821482963). When debugging, it can help to submit a form directly from JotForm which can help to eliminate Next Web as a factor in failed mailchimp submissions for example.


# Next Web reusable components for form pages

Any form page created in '/forms' should utilise the two reusable components 'JotFormPage' and 'JotFormEmbed'
#
**JotFormPage Component**

The JotFormPage component accepts the following properties:

- **height** : The height of the form.
- **formID** : The ID of the JotForm form to be displayed.
- **formName** : The name of the form.
- **parentPages** : An array of parent pages, each with a title and an optional path to populate the page breadcrumbs.
- **lead** : A lead text for the page.
- **informationPanel** : An optional JSX element to be displayed as an information panel (adjusts grid columns as necessary).
- **formHeader** : An optional JSX element to be displayed as a header for the form.
- **formFooter** : An optional JSX element to be displayed as a footer for the form.

**Component Output**

This component outputs a page that includes a NextSeo component for SEO optimization, breadcrumbs, a grid layout, a page header, a JotFormEmbed component, and an optional information panel. The content of the page is determined by the props passed to the component.

**SEO Metadata**

The **NextSeo** component from the **next-seo** package to set SEO metadata for the page. The title is set to the form name and the titles of the parent pages, joined with " | ". The description is set to the lead text.

**Breadcrumb Navigation**

The component employs the **Breadcrumbs** and **Breadcrumb** components from the **@nice-digital/nds-breadcrumbs** package to display breadcrumb navigation. The breadcrumbs include a link to the home page, links to the parent pages in reverse order, and the form name.

**Page Layout**

For layout, the component uses the **Grid** and **GridItem** components from the **@nice-digital/nds-grid** package. The grid has a loose gutter and contains two grid items if the **informationPanel** prop is provided, or one grid item otherwise. The first grid item includes the page header, the form header if provided, the **JotFormEmbed** component to display the form, and the form footer if provided. The second grid item, if present, contains the information panel.

**Page Header**

The **PageHeader** component from the **@nice-digital/nds-page-header** package is used to display the page header, with the heading set to the form name and the lead set to the lead text.



#
**JotFormEmbed Component**

The **JotFormEmbed** component embeds the JotForm form into the page. The form ID, form name, and height are passed as props to the **JotFormEmbed** component.

The **JotFormEmbed** component accepts the following properties:

- **jotFormID** : The unique ID of the JotForm form you wish to embed.
- **title** : The title of the form.
- **height** : Optional property to set the initial height of the form.
- **onSubmit** : Optional callback function executed upon form submission.

**Hooks Usage**

- **useRef** : Creates a reference to the iframe containing the embedded form.
- **useState** : Manages the **styleOverrides** state variable for storing CSS styles for the iframe.
- **useCallback** : Creates a memoized callback function, **handleIFrameMessage** , for handling messages from the iframe.
- **useEffect** : Adds and removes event listeners for iframe messages, setting initial CSS styles for the iframe.

**Message Handling**

The **handleIFrameMessage** function interprets various messages from the iframe. If the message signifies the completion of form submission, it triggers an event on **window.dataLayer** and calls the **onSubmit** callback if provided. String messages are parsed, and corresponding actions are taken, including scrolling the iframe into view, adjusting the height or minimum height, reloading the page, collapsing the error page, exiting fullscreen, or loading a script.

**Component Output**

The component returns an iframe element with attributes and styles configured accordingly. The **src** attribute of the iframe points to the URL of the JotForm form to embed, and the **style** attribute is set to the **styleOverrides** state variable. Additional attributes such as **id** , **data-jotform-id** , and **title** are included. The iframe allows fullscreen and holds permissions for geolocation, microphone, and camera. The **scrolling** attribute is set to "no" to prevent flickering of the iframe scrollbar during validation. The scrolling attribure is deprecated but is currently the only way to prevent brief display flicker when the iframe resizes in the browser.