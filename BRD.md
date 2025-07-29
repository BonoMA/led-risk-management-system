Functional Requirements Specification for LED Module
1. Introduction
1.1. Purpose
This Business Requirements Document (BRD) outlines the functional and non-functional requirements for an Operational Risk Management System, encompassing a Loss Event Database (LED) module. The system aims to standardize the reporting, recording, and monitoring of operational risk incidents and ensure timely action on identified incidents through seamless integration with an Issue & Action Management module.
1.2. Scope
The scope of this document covers the functionalities required for:
Incident reporting and data capture (LED).
Incident review and approval workflow.
Management of issues and action plans linked to open incidents (IAM).
Monitoring and reporting capabilities for various stakeholders.
User role-based access control.
1.3. Goals and Objectives
The primary goals of LED and IAM System is to enhance the organization's risk management capabilities by providing a centralized, efficient, and transparent platform.
Key Objectives:
Centralized Incident Reporting: Provide a centralized and structured platform for recording operational risk incidents..
Facilitate Review and Approval: Establish a clear workflow for the review and approval of incident inputs and associated action plans.
Integrate Risk Response: Automatically escalate open incidents into actionable items within an Issue & Action Management module.
Improve Accountability: Assign clear responsibilities (PIC) for action plans and track their progress.
Enhance Visibility: Improve visibility and transparency of operational risk exposures across the organization to monitor incidents and mitigation efforts.
Ensure Timely Communication: Implement notification mechanisms for open incidents and pending action plans(e.g., pending approvals,exceeded date for action plans).
Decision Making: Support data-driven decision-making for risk mitigation and loss prevention.
Minimize Losses: Minimize financial and non-financial losses due to operational incidents.
2. Current State (Implicit)
Currently, there is a need for a more structured and automated approach to managing operational risk incidents. Manual processes may lead to inconsistent data, delayed approvals, and inefficient tracking of corrective actions, potentially resulting in recurring losses.
3. Module Overview
Loss Event Database (LED): This module will serve as the central repository for reporting and recording operational risk incidents. It will capture detailed information about each incident, including its nature, impact, and discovery details.
Issue & Action Management (IAM): This module will be tightly integrated with the LED module. It will be activated specifically for "Open" incidents reported in the LED, allowing for the definition of issues, root causes, action plans, target dates, and responsible parties to address the underlying problems.
4. User Roles and Access
The system shall support the following user roles with defined access levels:
4.1. Inputter
LED Access:
Create new operational risk incidents.
Edit and delete only the incidents they have created.
View all incidents they have created.
Change the reviewStatus of any incident.
Monitoring/Reporting: View reports/dashboards for incidents they created.
4.2. Approver
LED Access:
View all operational risk incidents their unit has created.
Change the reviewStatus of incidents their unit has created from "Pending Approval L1" to "Approved" or "Rejected".
Create, edit, or delete LED incidents.
Monitoring/Reporting: View all reports/dashboards for incidents their unit has created.
4.3. Administrator 
LED Access:
Has full administrative control over the LED module.
Can create, edit, and delete all operational risk incidents.
Can change the reviewStatus of any incident from "Pending Approval L2" to "Approved" or "Rejected".
Monitoring/Reporting: Has full access to all reports and dashboards.
Configuration: Can access and modify administrator settings for form customization, workflow configuration, and LED field parameters.
5. LED Modules
The Module provides an overview of LED activities and results, with views tailored to the active user role.
5.1 Module Filters
User Filter:
Administrator: Can select "All Departments" or a specific department from a dropdown to filter the displayed data.
Inputter & Approver: This filter will automatically show their own department and is disabled, preventing them from viewing other departments' data.
Year Filter: All users can select a specific year (e.g., 2023, 2024, 2025) from a dropdown to filter incident inputs and progress graphics for that year.
5.2 Inputter View
When an Inputter is logged in, the Module displays:
"Incident Input" Form : 
Requirements:  as mentioned in FR-LED-001
"Save Incident" Button: Saves the current form data as a "Draft" or updates an existing entry.
"Cancel" Button: Hides the form without saving changes.
“Send for Approval” Button: Submits the incident entry to the “Approver” for review. Change the Review status to “Pending Approval L1”
"List Of Submitted Incidents" Table: Displays a list of incident entries for the logged-in department for the selected year.
Columns: No., Incident Name, Incident Date, Discovery Date, Actual Loss, Cause of Accident, Status (Open, Closed, Draft), Review Status (-, Pending Approval L1, Pending Approval L2, Approved, Rejected), Actions.
Actions Column:
For "Draft"  entries, an "Edit" button is provided to re-open the form with the entry's data for modification and a “Delete” button is provided to erase the entry’s data.
For "Draft" or "Rejected" entries, an "Edit" button is provided to re-open the form with the entry's data for modification.
For “Open” entries, a “Manage IAM” button is provided to direct the inputter to the IAM Module.
For other statuses, "No Action" is displayed.
5.3. Approver View
When an Approver User is logged in, the Module displays:
"Summary Of Submitted Incidents" Table: Displays a list of incident entries for the logged-in department for the selected year.
Columns: No., Incident Name, Incident Date, Discovery Date, Actual Loss, Cause of Accident, Status (Open, Closed), Review Status (Pending Approval L1, Pending Approval L2, Approved, Rejected), Actions.
Actions Column:
For "Pending Approval 1"  entries, a “Review” button is provided to open the form with the data for review, clicking this button opens the “Incident Details” view
For “Open” entries, a “View IAM” button is provided to direct the inputter to the IAM Module.
For other statuses, "No Action" is displayed.
"Incident Details" View:
Displays the  "Incident Input" Form in preview format. 
"Approve" button: 
Reveals the "Approve Incident Details?" confirmation message with “yes” or “no” button option
If “Yes”,  Changes the review status to "Pending Approval L2". A notification email will be sent to the administrator for pending approval.
If “No”, back to “Incident Details” view
"Reject" button:
Prompts for a reason for rejection.
Changes the review status of the associated incident entries from "Pending Approval L2" to "Rejected."
Notifies the Inputter and Approver for revisions. 
"Back to Summary" Button: Returns to the "Summary of Submitted Incidents" view.
"Generate Final LED Summary Report" Button:
Aggregates all incident entries currently "Approved" for the working unit and prepares a consolidated summary.
6.4. Administrator View
When an Administrator is logged in, the Module displays:
"Summary Of Submitted Incidents" Table: Displays a list of incident entries for all departments for the selected year.
Columns: No., Incident Name, Incident Date, Discovery Date, Actual Loss, Cause of Accident, Status (Open, Closed), Review Status (Pending Approval L1, Pending Approval L2, Approved, Rejected), Actions.
Actions Column:
For "Pending Approval 2"  entries, a “Review” button is provided to open the form with the data for review, clicking this button opens the “Incident Details” view
For “Open” entries, a “View IAM” button is provided to direct the inputter to the IAM Module.
For other statuses, "No Action" is displayed.
"Incident Details" View:
Displays the  "Incident Input" Form in preview format. 
"Approve" button: 
Reveals the "Approve Incident Details?" confirmation message with “yes” or “no” button option
If “Yes”,  Changes the review status to "Approved"
If “No”, back to “Incident Details” view
"Reject" button:
Prompts for a reason for rejection.
Changes the status of the associated incident entries from "Pending Approval L2" to "Rejected."
Notifies the Inputter and Approver for revisions. 
"Back to Summary" Button: Returns to the "Summary of Submitted Incidents" view.
6. Functional Requirements
6.1 Navigation
The primary navigation is handled via a left-hand sidebar.
LED Module: The main entry point to the LED functionalities.
Clicking "LED" expands/collapses its sub-menus.
Sub-menus under LED:
Dashboard: Displays LED results and progress.
New Incident: Displays the “Incident Input Form”.
6.2. Functional Requirements
6.2.1. Loss Event Database (LED) Module 
FR-LED-001: Incident Input Form: The system shall provide a user-friendly form/template for inputting operational risk incident details.
FR-LED-001.1: Data Fields: The form shall include, but not be limited to, the following fields:
Incident Name (Mandatory, Minimum 5 characters)
Incident Date (Mandatory, Date format)
Discovery Date (Mandatory, Date format)
Key Process (Mandatory, Free Text)
Incident Description (Mandatory, Minimum 10 characters, Free text)
Root Cause (Mandatory, Free Text)
Potential Loss (Optional, Numeric, Minimum 0, Currency IDR)
Recovery (Optional, Numeric, Minimum 0, Currency IDR)
Recovery Source (Optional, Free Text)
Actual Loss (System-generated: Potential Loss - Recovery, Currency IDR)
Cause of Accident (Mandatory: Dropdown, People, Process, System, External Factors)
Cause of Accident Description (Mandatory, Free Text)
Involved Parties (Mandatory, Dropdown: Internal, External, Both)
Risk Mitigation (Mandatory, Free Text)
Attachment (Optional, Attach Column Box)
Action Plan (Mandatory, Free Text)
Status (Mandatory, Dropdown: Open, Closed)
Business Unit (Mandatory, Dropdown: Anti Fraud; APU PPT; Business Offline; Collection; Customer Complaint; Customer Protection; Credit; Compliance; Finance, Accounting & Tax; Funding & Treasury;General Affair; Human Resource; Internal Audit; Internal Control; IT Gov&Sec; IT Product & Delivery; IT & Digital; Legal; Marketing & BD; Procurement; Productive Loan; Policy & Procedure; Risk Management; Remedial & Litigation; Strategic Communication; Others)
Review Status (System-generated: Pending Approval L1, Pending Approval L2, Approved, Rejected)
Created By (System-generated: Name, Employee ID, Position) 
FR-LED-001.2: Form Validation: The system shall perform real-time validation on input data.
FR-LED-001.2.1: Parameter Compliance: Validate input against defined data types (e.g., date format, numeric).
FR-LED-001.2.2: Minimum Character Length: Enforce minimum character lengths for free text fields (e.g., Incident Name, Description, Business Unit).
FR-LED-001.2.3: Mandatory Fields: Ensure all mandatory fields are populated.
FR-LED-001.2.4: Field Relationship Validation: "Incident Date" shall not be later than "Discovery Date."
FR-LED-001.2.5: Error Notification: Display clear notifications to the user if validation fails for any field, preventing submission until errors are corrected.
FR-LED-001.3: Data Upload (Future Enhancement): The system should support data entry via an upload template.
FR-LED-001.3.1: Upload Validation: The system shall validate uploaded data against the same rules as the form input.
FR-LED-001.3.2: Atomic Upload: If any field in the uploaded template contains an error, the entire upload shall fail, and an appropriate notification shall be provided.
FR-LED-001.4: Form Customization (Administrator): The system shall allow the "Risk Management Team" (via an Administrator menu) to customize forms, including:
Adding/removing fields.
Changing field types (e.g., text, dropdown, date).
Modifying field labels.
Setting fields as mandatory/non-mandatory.
Configuring field-specific validations.
FR-LED-001.5: New Form Creation (Administrator): The system shall allow the "Risk Management Team" to create new forms for recording other activities beyond operational incidents.
6.2.2. Review and Approval Workflow
FR-WF-001: Review and Approval Process: Every incident input/upload shall undergo a review and approval process by the designated superior(s) and Risk Management Team.
FR-WF-002: Flexible Workflow Configuration (Administrator): The system shall allow the “Administrator” (via an Administrator menu) to flexibly configure the workflow, including:
Defining and changing approvers.
Setting the number of approval layers.
FR-WF-003: Review Status Update: The "Approver" and “Administrator” shall be able to change the ReviewStatus of an incident to "Approved" or "Rejected". If “Rejected”, the “Approver” and “Administrator” needs to submit a reason why they reject the incident details.
6.2.3. Monitoring and Reporting
FR-MON-001: Incident Monitoring: The system shall provide monitoring capabilities for:
"Risk Management Team" (all incidents).
Related Working Units (all incidents relevant to their scope).
FR-REP-001: Reporting Feature: The system shall provide a reporting feature for all input incidents.
FR-REP-001.1: Raw Data Export: Ability to export raw data (e.g., Excel format).
FR-REP-001.2: Summary/Dashboard: Provide summary reports or a dashboard view of incident data.
6.2.4. Notifications
FR-NOT-001: Email Notification: The system shall provide Email notifications to the superior(s) upon data input by a user. (Note: This is a backend integration requirement and is simulated in the client-side demo).
6.2.5. Navigation
The primary navigation is handled via a left-hand sidebar.
LED Module: The main entry point to the LED functionalities.
Clicking "LED" expands/collapses its sub-menus.
Sub-menus under LED:
Dashboard: Displays LED results and progress.
Action Plans: Manages and tracks risk mitigation action plans.
7. Workflow (Simplified)
Incident Creation: An "Inputter" creates a new incident in the LED module. The reviewStatus is automatically set to "Pending Approval L1".
Notification (Future): An email notification is sent to the designated "Approver".
Review and Approval: An "Approver" reviews the incident.
If approved, the reviewStatus is set to "Pending Approval L2".
If rejected, the reviewStatus is set to "Rejected". “Approver” need to state why they reject the incident. The "Inputter" is notified by email notification to revise the incident.
Review and Approval: An “Administrator” reviews the incident.
If approved, the reviewStatus is set to "Approved".
If rejected, the reviewStatus is set to "Rejected". “Administrator” need to state why they reject the incident. The "Inputter" and “Approver” are notified by email notification to revise the incident.
IAM Activation: If the incident's status is "Open" (regardless of reviewStatus), the IAM module becomes active for that incident.
Issue & Action Management: An "Inputter" (for their own incidents) or "Administrator" can define issues, root causes, action plans, target dates, and PICs in the IAM module.
Monitoring and Reporting: 
“Inputter” and “Approver” can monitor incidents and generate reports based on their own unit’s incident(s)
“Administrator” can monitor all incidents and generate reports.
