# Gemini Agent Setup Documentation

This document provides a comprehensive overview of the custom configurations and capabilities of the Gemini agent setup, focusing on components beyond standard Gemini functionalities.

## Table of Integrations

| Component       | Description                                                                                             |
| :-------------- | :------------------------------------------------------------------------------------------------------ |
| **MCP Servers** | Atlassian (Jira), GitHub, Miro, PostgreSQL, Playwright, Context7                                                                          |
| **Custom Skills** | None configured                                                                                           |
| **Available Tools** | File System, Shell, Memory/Context, Web/Browser, GitHub, Miro, PostgreSQL, Agent Delegation, Documentation Query |
| **Sub-Agents**  | UI/UX Analyst (analyse_ui, debug_ui), UI/UX Designer (redesign_ui), Senior SE (request_feature, update_ui), Senior QA (test_ui_updates), Codebase Investigator |

## MCP Servers

This Gemini agent setup is integrated with the following Managed Control Plane (MCP) servers, enabling specialized interactions with external services:

*   **Atlassian MCP (Jira):** Provides capabilities for issue management, including creating, updating, and querying Jira tickets. Utilized by sub-agents for tracking and managing tasks within the Software Development Lifecycle (SDLC).
*   **GitHub MCP:** Enables comprehensive interaction with GitHub repositories, including branch management, pull request operations, file manipulation, and code search. Crucial for development and release workflows.
*   **Miro MCP:** Facilitates diagramming and visual collaboration on Miro boards. Used by sub-agents for generating and updating UI/UX design artifacts and flowcharts.
*   **PostgreSQL MCP:** Provides interaction capabilities with PostgreSQL databases, enabling SQL query execution and database management tasks.
*   **Playwright MCP:** Used for browser automation and end-to-end testing of web applications, specifically for UI validation and ensuring functionality across different browsers.
*   **Context7:** A platform for retrieving and querying up-to-date documentation and code examples for various programming libraries and frameworks, supporting development and troubleshooting.

## Custom Skills

No custom skills are currently configured in this Gemini agent setup.

## Available Tools

The Gemini agent is equipped with a diverse set of tools, categorized by their primary function:

### File System Operations

*   `list_directory`: Lists contents of a directory.
*   `read_file`: Reads the content of a specified file.
*   `write_file`: Writes content to a specified file.
*   `replace`: Replaces text within a file.
*   `glob`: Finds files matching specific glob patterns.
*   `search_file_content`: Performs optimized content search within files using `ripgrep`.

### Shell Command Execution

*   `run_shell_command`: Executes arbitrary shell commands.

### Memory/Context Management

*   `save_memory`: Saves specific facts or information for long-term recall.
*   `write_todos`: Manages and updates a list of subtasks.

### Web/Browser Interaction

*   `web_fetch`: Processes content from URLs.
*   `google_web_search`: Performs web searches using Google.
*   `browser_close`: Closes the browser page.
*   `browser_resize`: Resizes the browser window.
*   `browser_console_messages`: Returns browser console messages.
*   `browser_handle_dialog`: Handles browser dialogs (alerts, prompts, confirms).
*   `browser_evaluate`: Evaluates JavaScript on the page.
*   `browser_file_upload`: Uploads files to a browser input.
*   `browser_fill_form`: Fills multiple form fields.
*   `browser_install`: Installs the specified browser.
*   `browser_press_key`: Presses a keyboard key.
*   `browser_type`: Types text into an editable element.
*   `browser_navigate`: Navigates to a URL.
*   `browser_navigate_back`: Navigates back to the previous page.
*   `browser_network_requests`: Returns network requests.
*   `browser_run_code`: Runs Playwright code snippets.
*   `browser_take_screenshot`: Takes a screenshot of the page.
*   `browser_snapshot`: Captures an accessibility snapshot.
*   `browser_click`: Performs a click on a web element.
*   `browser_drag`: Performs drag and drop.
*   `browser_hover`: Hovers over a web element.
*   `browser_select_option`: Selects options in a dropdown.
*   `browser_tabs`: Manages browser tabs.
*   `browser_wait_for`: Waits for text, text to disappear, or a specified time.

### GitHub Integration

*   `add_comment_to_pending_review`: Adds review comments to a pending PR review.
*   `add_issue_comment`: Adds a comment to an issue or pull request.
*   `assign_copilot_to_issue`: Assigns Copilot to a GitHub issue.
*   `create_branch`: Creates a new branch.
*   `create_or_update_file`: Creates or updates a file.
*   `create_pull_request`: Creates a new pull request.
*   `create_repository`: Creates a new repository.
*   `delete_file`: Deletes a file.
*   `fork_repository`: Forks a repository.
*   `get_commit`: Gets commit details.
*   `get_file_contents`: Gets file or directory contents.
*   `get_label`: Gets a specific label.
*   `get_latest_release`: Gets the latest release.
*   `get_me`: Gets details of the authenticated GitHub user.
*   `get_release_by_tag`: Gets a release by tag.
*   `get_tag`: Gets a Git tag.
*   `get_team_members`: Gets team member usernames.
*   `get_teams`: Gets user's teams.
*   `issue_read`: Reads issue information (details, comments, labels).
*   `issue_write`: Creates or updates an issue.
*   `list_branches`: Lists repository branches.
*   `list_commits`: Lists commits of a branch.
*   `list_issue_types`: Lists supported issue types.
*   `list_issues`: Lists issues.
*   `list_pull_requests`: Lists pull requests.
*   `list_releases`: Lists releases.
*   `list_tags`: Lists Git tags.
*   `merge_pull_request`: Merges a pull request.
*   `pull_request_read`: Reads pull request information (details, diff, files, reviews).
*   `pull_request_review_write`: Creates, submits, or deletes a PR review.
*   `push_files`: Pushes multiple files in a single commit.
*   `request_copilot_review`: Requests a Copilot code review.
*   `search_code`: Searches code across GitHub.
*   `search_issues`: Searches issues.
*   `search_pull_requests`: Searches pull requests.
*   `search_repositories`: Searches repositories.
*   `search_users`: Searches users.
*   `sub_issue_write`: Adds, removes, or reprioritizes sub-issues.
*   `update_pull_request`: Updates a pull request.
*   `update_pull_request_branch`: Updates a PR branch with base changes.

### Miro Integration

*   `board_get_items`: Lists items on a Miro board.
*   `board_get_image_download_url`: Gets download URL for image data.
*   `board_get_image_data`: Gets image data.
*   `context_get_board_docs`: Gets text representation of board items for context.
*   `draft_diagram_new`: Generates and adds diagrams to a Miro board.

### PostgreSQL Interaction

*   `postgres__execute_sql`: Executes SQL queries on a PostgreSQL database.

### Agent Delegation

*   `delegate_to_agent`: Delegates tasks to specialized sub-agents.
    *   `codebase_investigator`: A sub-agent specialized in codebase analysis, architectural mapping, and understanding system-wide dependencies.

### Documentation Query

*   `resolve_library_id`: Resolves package names to Context7-compatible library IDs.
*   `query_docs`: Retrieves and queries up-to-date documentation from Context7.

## Sub-Agents

This Gemini agent setup utilizes several specialized sub-agents, each designed to handle specific phases and tasks within the software development and UI/UX workflows. These sub-agents are configured via `.toml` files located in `.gemini/commands/ui/`.

### UI/UX Analyst and Product Manager (`analyse_ui`)

*   **Name & Primary Function:** "Analyses the existing UI, identifies improvement opportunities, and prepares Jira tickets after user approval."
*   **Role & SDLC Phase:** UI/UX Analyst and Product Manager, operating in the **Analysis** phase.
*   **Key Responsibilities/Tasks:**
    *   Analyze existing frontend codebase and running UI.
    *   Evaluate UI/UX across usability, visual hierarchy, color usage, and feedback states.
    *   Identify and categorize potential UI improvements using MoSCoW (Must, Should, Could) prioritization.
    *   Propose feature lists for user refinement and approval.
    *   Create Jira tickets based on user-approved items using Atlassian MCP.
*   **Rules & Constraints:** Strictly limited to analysis and planning; must not design, implement, or modify UI. Uses MoSCoW. Must obtain user approval before creating Jira tickets and proceeding.

### UI/UX Analyst and Product Manager (`debug_ui`)

*   **Name & Primary Function:** "Identifies and resolves UI bugs based on Jira tickets or user-reported issues, performing necessary code modifications and verification."
*   **Role & SDLC Phase:** UI/UX Analyst and Product Manager, operating in the **Analysis/Implementation** (implied debugging) phase.
*   **Key Responsibilities/Tasks:**
    *   Analyzes existing frontend codebase and running UI to understand reported bugs.
    *   If accessible, reviews the running UI at http://localhost:5173 to reproduce bugs.
    *   Diagnoses UI issues, identifies root causes, and proposes solutions.
    *   Implements code modifications to fix identified bugs.
    *   Verifies fixes through testing (e.g., unit, integration, E2E) and visual inspection.
    *   Updates relevant Jira tickets with resolution details.
*   **Rules & Constraints:** Focuses strictly on bug identification and resolution. Must confirm bug reproduction and fix verification. All code changes must be isolated to a new branch, and must not introduce breaking changes or unintended side effects.

### UI/UX Designer and Product Manager (`redesign_ui`)

*   **Name & Primary Function:** "Reads approved Jira tickets and produces UI design proposals and Miro diagrams for new and existing UI workflows."
*   **Role & SDLC Phase:** UI/UX Designer and Product Manager, operating in the **Design** phase.
*   **Key Responsibilities/Tasks:**
    *   Analyzes existing frontend codebase for UI structure and flows.
    *   Retrieves approved Jira tickets using Atlassian MCP tools.
    *   Proposes updated UI structure, user activity flows, and low-fidelity mockups.
    *   Creates or updates Miro diagrams (user activity flows, low-level mockups) using Miro MCP (`draft_diagram_new`) after user approval.
*   **Rules & Constraints:** Design phase ONLY; must not implement or modify code. Design decisions must be based on approved Jira tickets, existing UI, and user feedback. Must obtain user approval before diagram creation.

### Senior Software Engineer (`request_feature`)

*   **Name & Primary Function:** "Implements a single user-requested UI feature on a new branch after explicit approval."
*   **Role & SDLC Phase:** Senior Software Engineer, operating in an **Ad-hoc UI Implementation mode**.
*   **Key Responsibilities/Tasks:**
    *   Analyzes user-requested features and identifies affected UI components and required changes (frontend/backend).
    *   Prepares a concise implementation proposal.
    *   Creates a new branch using GitHub MCP tools and switches to it (after user permission).
    *   Implements only the approved UI feature, stages, commits, and pushes changes to the new branch.
*   **Rules & Constraints:** Must not modify the main branch. All changes on a separate branch. Implements ONLY ONE UI feature per execution. Must not introduce breaking changes, refactor unrelated code, add speculative features, or perform testing. Requires explicit user permission for branch creation.

### Senior QA Engineer and Release Manager (`test_ui_updates`)

*   **Name & Primary Function:** "Reviews, tests, compares, and merges UI update branches into main after user approval."
*   **Role & SDLC Phase:** Senior QA Engineer and Release Manager, operating in the **Testing & Review phase**.
*   **Key Responsibilities/Tasks:**
    *   Retrieves all remote branches using GitHub MCP and identifies UI update branches.
    *   Fetches, checks out, and compares branches against `main` (using `git diff`).
    *   Performs non-destructive validation (builds, backend startup).
    *   Executes Playwright E2E test suite (if available and approved).
    *   Presents test results and recommendations.
    *   Merges approved branches into `main` using GitHub MCP.
*   **Rules & Constraints:** Must NOT merge without explicit user approval. Must NOT modify code. Always compares against `main`. Prioritizes safety. Playwright failures block merge by default.

### Senior Software Engineer (`update_ui`)

*   **Name & Primary Function:** "Performs ad-hoc updates to the UI, including bug fixes or minor enhancements on a new branch."
*   **Role & SDLC Phase:** Senior Software Engineer, operating in an **Ad-hoc UI Modification mode**.
*   **Key Responsibilities/Tasks:**
    *   Analyzes the requested update and identifies affected components.
    *   Proposes an implementation plan for the update.
    *   Creates and switches to a new branch (with user permission).
    *   Implements the approved UI update (bug fix or minor enhancement).
    *   Stages, commits, and pushes changes to the new branch.
*   **Rules & Constraints:** Similar to `request_feature`, but focused on existing UI modifications. Must not modify `main`. All changes on a separate branch. Must not introduce breaking changes, refactor unrelated code, or add speculative features. Requires explicit user permission for branch creation.