
/**
 * TODO: Fix Netlify's bundling, which fails on redirected JS
 */

/**
 * @readonly
 */
 var DCT_LANG = {
    /**
     * Format a localized language value by its key.
     * @param {"SEARCH_PAGE_TITLE"|"HEADER_NAV_TOGGLE_BUTTON_OPEN_LABEL"|"HEADER_NAV_TOGGLE_BUTTON_CLOSE_LABEL"|"HEADER_SEARCH_FORM_BUTTON_LABEL"|"HEADER_SEARCH_FORM_SEARCH_INPUT_LABEL"|"HEADER_NAV_LINKS_DONATE_LABEL"|"HEADER_NAV_LINKS_DISCORD_LABEL"|"HEADER_NAV_LINKS_CODEHS_LABEL"|"HEADER_NAV_LINKS_HOME_LABEL"|"HEADER_LOGO_ALT_TEXT"|"CODE_PAGE_ANNOTATION_AUTHOR_ATTRIBUTION"|"CODE_PAGE_ANNOTATION_PREVIEW_INVALID_MARKUP_ERROR_MESSAGE"|"CODE_PAGE_TOP_NAVIGATION_PREVIOUS_LABEL"|"CODE_PAGE_TOP_NAVIGATION_NEXT_LABEL"|"CODE_PAGE_TOOLS_NAME_MANAGER_TAB_LABEL"|"CODE_PAGE_TOOLS_NAME_MANAGER_TITLE"|"CODE_PAGE_TOOLS_NAME_MANAGER_SHORT_DESCRIPTION"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_TAB_LABEL"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SAVE_APPLY_CHANGES_BUTTON_LABEL"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_BRACKET_STYLE_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_BRACKET_STYLE_OPTION_JAVA_STYLE_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_BRACKET_STYLE_OPTION_C_STYLE_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_INDENTATION_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_INDENTATION_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_CODE_SPACING_OUT_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_CODE_SPACING_OUT_OPTION_LOOSE_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_CODE_SPACING_OUT_OPTION_DEFAULT_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_CODE_SPACING_OUT_OPTION_MINIFY_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_EXPRESSION_SPACING_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_EXPRESSION_SPACING_OPTION_ADD_SPACES_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_EXPRESSION_SPACING_OPTION_DEFAULT_TO_CODE_SPACING_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_COMMENTS_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_COMMENTS_OPTION_KEEP_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_COMMENTS_OPTION_REMOVE_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_RICH_FORMATTING_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_RICH_FORMATTING_OPTION_PARSE_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_RICH_FORMATTING_OPTION_DONT_PARSE_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_PAIRED_CHARACTERS_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_PAIRED_CHARACTERS_OPTION_HIGHLIGHT_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_PAIRED_CHARACTERS_OPTION_DONT_HIGHLIGHT_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_EXPLAIN_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_EXPLAIN_OPTION_SHOW_TOOLTIPS_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_EXPLAIN_OPTION_HIDE_TOOLTIPS_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_REGISTER_VARIABLE_SCOPES_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_REGISTER_VARIABLE_SCOPES_OPTION_DONT_REGISTER_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_REGISTER_VARIABLE_SCOPES_OPTION_REGISTER_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_IF_ELSE_FORMAT_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_IF_ELSE_FORMAT_OPTION_NEXT_LINE_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_IF_ELSE_FORMAT_OPTION_SAME_LINE_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_SINGLE_STATEMENT_BLOCKS_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_SINGLE_STATEMENT_BLOCKS_OPTION_ALWAYS_NEWLINE_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_SINGLE_STATEMENT_BLOCKS_OPTION_NEVER_NEWLINE_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_SINGLE_STATEMENT_BLOCKS_OPTION_DEFAULT_NEWLINE_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_LINE_WRAP_TITLE"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_LINE_WRAP_OPTION_WRAP_SUMMARY"|"CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_LINE_WRAP_OPTION_SCROLL_SIDEWAYS_SUMMARY"|"HELPFULNESS_FORM_TITLE"|"HELPFULNESS_FORM_BUTTON_YES_LABEL"|"HELPFULNESS_FORM_BUTTON_NO_LABEL"|"HELPFULNESS_FORM_FINISH_MESSAGE"|"FOOTER_TITLE"|"FOOTER_SOCIAL_BUTTONS_GITHUB_LABEL"|"FOOTER_SOCIAL_BUTTONS_DISCORD_LABEL"|"FOOTER_SOCIAL_BUTTONS_EMAIL_LABEL"|"FOOTER_CATEGORY_CONTENT_TITLE"|"FOOTER_CATEGORY_CONTENT_ITEM_CODEHS_LABEL"|"FOOTER_CATEGORY_CONTENT_ITEM_CLASSWORK_LABEL"|"FOOTER_CATEGORY_CONTENT_ITEM_ERROR_ALMANAC_LABEL"|"FOOTER_CATEGORY_SITE_TITLE"|"FOOTER_CATEGORY_SITE_ITEM_HOMEPAGE_LABEL"|"FOOTER_CATEGORY_SITE_ITEM_ABOUT_US_LABEL"|"FOOTER_CATEGORY_SITE_ITEM_REPORT_BUG_LABEL"|"FOOTER_CATEGORY_LEGAL_TITLE"|"FOOTER_CATEGORY_LEGAL_ITEM_TERMS_AND_CONDITIONS_LABEL"|"FOOTER_CATEGORY_LEGAL_ITEM_OPEN_SOURCE_SOFTWARE_LICENSES_LABEL"|"FOOTER_CATEGORY_LEGAL_ITEM_LICENSE_LABEL"|"FOOTER_CATEGORY_LEGAL_ITEM_FAIR_USE_STATEMENT_LABEL"|"FOOTER_CATEGORY_LEGAL_ITEM_PRIVACY_POLICY_LABEL"|"HOMEPAGE_HERO_TITLE"|"HOMEPAGE_HERO_SUBTITLE"|"HOMEPAGE_HERO_BUTTON_CODEHS_LABEL"|"HOMEPAGE_HERO_BUTTON_CLASSWORK_LABEL"|"HOMEPAGE_HERO_BUTTON_ERRORS_LABEL"|"HOMEPAGE_SOCIAL_PROOF_CARDS_DISCORD_MEMBERS_LABEL"|"HOMEPAGE_SOCIAL_PROOF_CARDS_DISCORD_MEMBERS_TOOLTIP"|"HOMEPAGE_SOCIAL_PROOF_CARDS_CODEHS_LESSON_COUNT_LABEL"|"HOMEPAGE_SOCIAL_PROOF_CARDS_AVERAGE_USER_SCORE_LABEL"|"HOMEPAGE_WHY_MAKE_THIS_SITE_TITLE"|"HOMEPAGE_WHY_MAKE_THIS_SITE_CODEHS_HAS_GAPS_TITLE"|"HOMEPAGE_WHY_MAKE_THIS_SITE_CODEHS_HAS_GAPS_CONTENT"|"HOMEPAGE_WHY_MAKE_THIS_SITE_HARD_TO_UNDERSTAND_TITLE"|"HOMEPAGE_WHY_MAKE_THIS_SITE_HARD_TO_UNDERSTAND_CONTENT"|"HOMEPAGE_WHY_MAKE_THIS_SITE_THEYRE_NOT_BAD_TITLE"|"HOMEPAGE_WHY_MAKE_THIS_SITE_THEYRE_NOT_BAD_CONTENT"|"HOMEPAGE_WHY_MAKE_THIS_SITE_BUT_THIS_CAN_FOCUS_TITLE"|"HOMEPAGE_WHY_MAKE_THIS_SITE_BUT_THIS_CAN_FOCUS_CONTENT"|"HOMEPAGE_WHY_MAKE_THIS_SITE_AND_HELP_STUDENTS_TITLE"|"HOMEPAGE_WHY_MAKE_THIS_SITE_AND_HELP_STUDENTS_CONTENT"|"CODEHS_INDEX_COMING_SOON_LABEL"|"CODEHS_INDEX_TITLE"|"CODEHS_LANGUAGE_INDEX_TITLE"|"CODEHS_LANGUAGE_INDEX_SUMMARY"|"ERROR_ALMANAC_INDEX_TITLE"|"ERROR_ALMANAC_INDEX_SUMMARY"|"REPORT_BUG_TITLE"|"REPORT_BUG_SUMMARY"|"REPORT_BUG_TIME_DISCLAIMER"|"FOOTER_CATEGORY_SITE_ITEM_DONATE_LABEL"} key Key to access.
     * @param {...*} var_args Some keys have placeholder values. By adding extra arguments, you can fill these.
     * @returns {string} Formatted result
     */
    format: function (key) {
        var key = arguments[0];
        var value = DCT_LANG.kvs[key];
        if(value == undefined || value + "" == "undefined") return "Much to our shame, this text wasn't translated properly. Please report this error.";
        
        for(var i = 1; i < arguments.length; i++) {
            //use ASCII to get letters in order. Starts at A (65) and goes through the uppercase alphabet
            var letter = String.fromCharCode(64 + i);
            value = value.replace("${" + letter + "}", arguments[i]);
        }

        return value;
    },
    kvs: {
        "CODE_PAGE_ANNOTATION_AUTHOR_ATTRIBUTION": "By ${A}",
        "CODE_PAGE_ANNOTATION_PREVIEW_INVALID_MARKUP_ERROR_MESSAGE": "ANNOTATION FAILED RCSMPC BY USING ${A}. THIS INDICATES A MALICIOUS USE OF THE ANNOTATION TOOLS. PLEASE REPORT THIS IMMEDIATELY",
        "CODE_PAGE_TOP_NAVIGATION_PREVIOUS_LABEL": "Previous: ${A}",
        "CODE_PAGE_TOP_NAVIGATION_NEXT_LABEL": "Next: ${A}",
        "CODE_PAGE_TOOLS_NAME_MANAGER_TAB_LABEL": "Name Manager",
        "CODE_PAGE_TOOLS_NAME_MANAGER_TITLE": "Name Manager",
        "CODE_PAGE_TOOLS_NAME_MANAGER_SHORT_DESCRIPTION": "Name Manager",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_TAB_LABEL": "Format Settings",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_TITLE": "Code Formatting Settings",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SAVE_APPLY_CHANGES_BUTTON_LABEL": "Save & Apply Changes",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_BRACKET_STYLE_TITLE": "Bracket Style",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_BRACKET_STYLE_OPTION_JAVA_STYLE_SUMMARY": "Use <em>Java-style</em> brackets, on the same line as their block start.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_BRACKET_STYLE_OPTION_C_STYLE_SUMMARY": "Use <em>C-style</em> brackets, which are on a new line from their block start.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_INDENTATION_TITLE": "Indentation",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_INDENTATION_SUMMARY": "How far to indent each block of code (e.g. function, while-loop body).",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_CODE_SPACING_OUT_TITLE": "Code Spacing Out",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_CODE_SPACING_OUT_OPTION_LOOSE_SUMMARY": "<em>Loosely</em> space the code. Includes spaces added after for and if statements.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_CODE_SPACING_OUT_OPTION_DEFAULT_SUMMARY": "Space the code out the <em>default</em> amount. This option will still indent code and make newlines, but won't include extra spacing inside parentheses or spaces after for and if statements.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_CODE_SPACING_OUT_OPTION_MINIFY_SUMMARY": "<em>Minify</em> the code. This will pack all of your code onto one line and try to make it as small as possible. It also removes all comments. This will not work fully in some languages, such as Python.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_EXPRESSION_SPACING_TITLE": "Expression Spacing",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_EXPRESSION_SPACING_OPTION_ADD_SPACES_SUMMARY": "<em>Add spaces</em> inside expressions and between arguments.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_EXPRESSION_SPACING_OPTION_DEFAULT_TO_CODE_SPACING_SUMMARY": "<em>Default to using Code Spacing configuration</em> inside expressions and between arguments.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_COMMENTS_TITLE": "Comments",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_COMMENTS_OPTION_KEEP_SUMMARY": "<em>Keep</em> comments in the code",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_COMMENTS_OPTION_REMOVE_SUMMARY": "<em>Remove</em> comments from the code completely",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_RICH_FORMATTING_TITLE": "Rich Formatting",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_RICH_FORMATTING_OPTION_PARSE_SUMMARY": "<em>Parse, analyze, and color</em> the code. This allows features like explainations and automatic refactoring.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_RICH_FORMATTING_OPTION_DONT_PARSE_SUMMARY": "<em>Don't tokenize and color</em> the code. This will speed up loading times and make the code viewer more performant, but removes features like explainations. This will override most other options.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_PAIRED_CHARACTERS_TITLE": "Highlight Paired Characters",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_PAIRED_CHARACTERS_OPTION_HIGHLIGHT_SUMMARY": "<em>Highlight</em> the counterpart of paired characters (like (, [, or {) when you hover over them.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_PAIRED_CHARACTERS_OPTION_DONT_HIGHLIGHT_SUMMARY": "<em>Don't highlight</em> the counterpart of paired characters (like (, [, or {) when you hover over them.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_EXPLAIN_TITLE": "Automatic Hover Explanations",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_EXPLAIN_OPTION_SHOW_TOOLTIPS_SUMMARY": "<em>Show</em> explanation tooltips",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_EXPLAIN_OPTION_HIDE_TOOLTIPS_SUMMARY": "<em>Hide</em> explanation tooltips",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_REGISTER_VARIABLE_SCOPES_TITLE": "Register Variable Scopes",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_REGISTER_VARIABLE_SCOPES_OPTION_DONT_REGISTER_SUMMARY": "<em>Don't register variables.</em> This can save memory and make the code viewer faster, but removes features like variable definition finding and some refactoring features.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_REGISTER_VARIABLE_SCOPES_OPTION_REGISTER_SUMMARY": "<em>Register variables.</em> This option will use an internal object to record variables used in the program and link variable usages to their definitions.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_IF_ELSE_FORMAT_TITLE": "If/Else Format",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_IF_ELSE_FORMAT_OPTION_NEXT_LINE_SUMMARY": "The <code>else</code> should be on a <em>new line</em> from its <code>if</code>'s ending bracket.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_IF_ELSE_FORMAT_OPTION_SAME_LINE_SUMMARY": "The <code>else</code> should be on the <em>same line</em> as its <code>if</code>'s ending bracket.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_SINGLE_STATEMENT_BLOCKS_TITLE": "Single-Statement Blocks",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_SINGLE_STATEMENT_BLOCKS_OPTION_ALWAYS_NEWLINE_SUMMARY": "Single-statement blocks should <em>always</em> have curly brackets.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_SINGLE_STATEMENT_BLOCKS_OPTION_NEVER_NEWLINE_SUMMARY": "Single-statement blocks should <em>never</em> have curly brackets.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_SINGLE_STATEMENT_BLOCKS_OPTION_DEFAULT_NEWLINE_SUMMARY": "Just leave it however the example code was written.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_LINE_WRAP_TITLE": "Line Wrap",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_LINE_WRAP_OPTION_WRAP_SUMMARY": "Wrap long lines to keep the display narrower. This only affects how code is displayed-- if you copy it, your clipboard copy won't have the wrap.",
        "CODE_PAGE_TOOLS_FORMAT_SETTINGS_SETTING_LINE_WRAP_OPTION_SCROLL_SIDEWAYS_SUMMARY": "Scroll sideways instead of wrapping lines",
        "HELPFULNESS_FORM_TITLE": "Was this helpful?",
        "HELPFULNESS_FORM_BUTTON_YES_LABEL": "Yes",
        "HELPFULNESS_FORM_BUTTON_NO_LABEL": "No",
        "HELPFULNESS_FORM_FINISH_MESSAGE": "Thanks!",
        "FOOTER_TITLE": "Dinner Coding Time",
        "FOOTER_SOCIAL_BUTTONS_GITHUB_LABEL": "GitHub",
        "FOOTER_SOCIAL_BUTTONS_DISCORD_LABEL": "Discord",
        "FOOTER_SOCIAL_BUTTONS_EMAIL_LABEL": "Email",
        "FOOTER_CATEGORY_CONTENT_TITLE": "Content",
        "FOOTER_CATEGORY_CONTENT_ITEM_CODEHS_LABEL": "CodeHS",
        "FOOTER_CATEGORY_CONTENT_ITEM_CLASSWORK_LABEL": "Classwork",
        "FOOTER_CATEGORY_CONTENT_ITEM_ERROR_ALMANAC_LABEL": "Error Almanac",
        "FOOTER_CATEGORY_SITE_TITLE": "Site",
        "FOOTER_CATEGORY_SITE_ITEM_HOMEPAGE_LABEL": "Homepage",
        "FOOTER_CATEGORY_SITE_ITEM_ABOUT_US_LABEL": "About Us",
        "FOOTER_CATEGORY_SITE_ITEM_REPORT_BUG_LABEL": "Report Bug",
        "FOOTER_CATEGORY_SITE_ITEM_DONATE_LABEL": "Donate",
        "FOOTER_CATEGORY_LEGAL_TITLE": "Legal",
        "FOOTER_CATEGORY_LEGAL_ITEM_TERMS_AND_CONDITIONS_LABEL": "Terms & Conditions",
        "FOOTER_CATEGORY_LEGAL_ITEM_OPEN_SOURCE_SOFTWARE_LICENSES_LABEL": "OSS Licenses",
        "FOOTER_CATEGORY_LEGAL_ITEM_LICENSE_LABEL": "License",
        "FOOTER_CATEGORY_LEGAL_ITEM_FAIR_USE_STATEMENT_LABEL": "Fair Use Statement",
        "FOOTER_CATEGORY_LEGAL_ITEM_PRIVACY_POLICY_LABEL": "Privacy Policy",
        "HOMEPAGE_HERO_TITLE": "Dinner Coding Time",
        "HOMEPAGE_HERO_SUBTITLE": "Easy help on AP Computer Science",
        "HOMEPAGE_HERO_BUTTON_CODEHS_LABEL": "CodeHS",
        "HOMEPAGE_HERO_BUTTON_CLASSWORK_LABEL": "Classwork",
        "HOMEPAGE_HERO_BUTTON_ERRORS_LABEL": "Errors",
        "HOMEPAGE_SOCIAL_PROOF_CARDS_DISCORD_MEMBERS_LABEL": "Discord Members Online Now",
        "HOMEPAGE_SOCIAL_PROOF_CARDS_DISCORD_MEMBERS_TOOLTIP": "Last updated at ${A}",
        "HOMEPAGE_SOCIAL_PROOF_CARDS_CODEHS_LESSON_COUNT_LABEL": "CodeHS Lessons w/ Explanation",
        "HOMEPAGE_SOCIAL_PROOF_CARDS_AVERAGE_USER_SCORE_LABEL": " Average User AP CS Score",
        "HOMEPAGE_WHY_MAKE_THIS_SITE_TITLE": "Why make this site?",
        "HOMEPAGE_WHY_MAKE_THIS_SITE_CODEHS_HAS_GAPS_TITLE": "CodeHS has gaps.",
        "HOMEPAGE_WHY_MAKE_THIS_SITE_CODEHS_HAS_GAPS_CONTENT": "For students who naturally understand computer science, CodeHS is great! Not all of us are like that, though.",
        "HOMEPAGE_WHY_MAKE_THIS_SITE_HARD_TO_UNDERSTAND_TITLE": "It's hard to understand.",
        "HOMEPAGE_WHY_MAKE_THIS_SITE_HARD_TO_UNDERSTAND_CONTENT": "If you don't get the right solution on the first time, it is hard to ever arrive at the right solution. Auto-graders offer generic tips that almost never work. At the same time, autograders require exactly the correct output in order to pass the task.",
        "HOMEPAGE_WHY_MAKE_THIS_SITE_THEYRE_NOT_BAD_TITLE": "They're not \"bad\"",
        "HOMEPAGE_WHY_MAKE_THIS_SITE_THEYRE_NOT_BAD_CONTENT": "CodeHS is definitely 'better' than this site, because they're also more general. They've tutorials on 9 - 14 languages (depending on how you define a 'language'), at all levels. We get frusturated sometimes, but CodeHS is incredible, to be honest!",
        "HOMEPAGE_WHY_MAKE_THIS_SITE_BUT_THIS_CAN_FOCUS_TITLE": "but this can be more focused",
        "HOMEPAGE_WHY_MAKE_THIS_SITE_BUT_THIS_CAN_FOCUS_CONTENT": "This is <em>not</em> a competitor to CodeHS. It's a companion & a helper site, designed to help you out on confusing assignments. In addition, this site has explanations for how to do the challenges. It helps CodeHS to not be such a just-test-until-you-pass environment by working for <em>the students</em>, not just the teachers.",
        "HOMEPAGE_WHY_MAKE_THIS_SITE_AND_HELP_STUDENTS_TITLE": "and help students directly.",
        "HOMEPAGE_WHY_MAKE_THIS_SITE_AND_HELP_STUDENTS_CONTENT": "We take pride in being able to help students with every question, because we're students ourselves. If you have a question or something you're confused about, feel free to ask on our Discord or over email!",
        "CODEHS_INDEX_COMING_SOON_LABEL": "Coming Soon",
        "CODEHS_INDEX_TITLE": "CodeHS Courses",
        "CODEHS_LANGUAGE_INDEX_TITLE": "CodeHS: ${A}",
        "CODEHS_LANGUAGE_INDEX_SUMMARY": "Below are all ${A} CodeHS lessons on this site. Only <b>exercises</b> are included, so you won't see any videos, examples, or tests-- if you are confused by an example, feel free to ask in <a href=\"https://discord.gg/m2Zub6EYyp\" target=\"_blank\" rel=\"noopener\">the Discord</a>!",
        "ERROR_ALMANAC_INDEX_TITLE": "Error Almanac",
        "ERROR_ALMANAC_INDEX_SUMMARY": "Some common errors on CodeHS are hard to pin down and fix. To aid with those, here are some easy solutions.",
        "REPORT_BUG_TITLE": "Report a Bug",
        "REPORT_BUG_SUMMARY": "You can report bugs through <a target=\"_blank\" rel=\"noopener\" href=\"https://forms.gle/evEpBGSUTyY1mijJ7\">this Google Form</a>, email at <a href=\"mailto:bug-report@dinnercodingtime.com\">bug-report@dinnercodingtime.com</a>, or through <a target=\"_blank\" rel=\"noopener\" href=\"https://discord.gg/m2Zub6EYyp\">the Discord</a> in the #cs channel",
        "REPORT_BUG_TIME_DISCLAIMER": "Everyone working on this is an AP student too, so we might take a bit to respond to bug reports. Don't worry, though, we'll be sure to get to them!",
        "HEADER_LOGO_ALT_TEXT": "The Dinner Coding Time logo, a very stylized letter D",
        "HEADER_NAV_LINKS_HOME_LABEL": "Home",
        "HEADER_NAV_LINKS_CODEHS_LABEL": "CodeHS",
        "HEADER_NAV_LINKS_DISCORD_LABEL": "Join Discord",
        "HEADER_NAV_LINKS_DONATE_LABEL": "Donate",
        "HEADER_SEARCH_FORM_SEARCH_INPUT_LABEL": "Search keywords",
        "HEADER_SEARCH_FORM_BUTTON_LABEL": "Search",
        "HEADER_NAV_TOGGLE_BUTTON_OPEN_LABEL": "Open Navigation Menu",
        "HEADER_NAV_TOGGLE_BUTTON_CLOSE_LABEL": "Close Navigation Menu",
        "SEARCH_PAGE_TITLE": "Search Results"
    }
};

(function() {
    var localizable = document.querySelectorAll("[localization-string]");
    for(var i = 0; i < localizable.length; i++) {
        var key = localizable[i].getAttribute("localization-string");
        var value = DCT_LANG.kvs[key];
        if(localizable[i].hasAttribute("localization-attribute")) {
            localizable[i].setAttribute(localizable[i].getAttribute("localization-attribute"), value);
        } else {
            //try to avoid CLS
            if(localizable[i].innerHTML != value) localizable[i].innerHTML = value;
        }
    }
})();



