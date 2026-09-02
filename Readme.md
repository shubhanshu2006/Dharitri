# DHARITRI

## Digital Hub for Acquisition, Rehabilitation, Integrated Tracking, Records & Intelligence

> **A national digital platform for end-to-end land acquisition monitoring, GIS-based parcel management, verified compensation tracking, Rehabilitation & Resettlement (R&R), possession monitoring, and data-driven decision support.**

---

## Table of Contents

- [1. Overview](#1-overview)
- [2. Problem Statement](#2-problem-statement)
- [3. Our Vision](#3-our-vision)
- [4. What DHARITRI Solves](#4-what-dharitri-solves)
- [5. Core Idea](#5-core-idea)
- [6. End-to-End Lifecycle](#6-end-to-end-lifecycle)
- [7. Key Concepts](#7-key-concepts)
- [8. Major Modules](#8-major-modules)
- [9. GIS and Land Parcel Management](#9-gis-and-land-parcel-management)
- [10. Compensation and Payment Verification](#10-compensation-and-payment-verification)
- [11. Rehabilitation & Resettlement](#11-rehabilitation--resettlement)
- [12. Digital Workflow and Approvals](#12-digital-workflow-and-approvals)
- [13. Document Management](#13-document-management)
- [14. Field Verification](#14-field-verification)
- [15. Dashboards and Monitoring](#15-dashboards-and-monitoring)
- [16. Alerts and Escalation](#16-alerts-and-escalation)
- [17. Analytics and Predictive Decision Support](#17-analytics-and-predictive-decision-support)
- [18. Role-Based Access Control](#18-role-based-access-control)
- [19. System Architecture](#19-system-architecture)
- [20. Data Model](#20-data-model)
- [21. Technology Stack](#21-technology-stack)
- [22. Integration Strategy](#22-integration-strategy)
- [23. Security and Privacy](#23-security-and-privacy)
- [24. Interoperability](#24-interoperability)
- [25. Prototype vs Production](#25-prototype-vs-production)
- [26. Example Use Case](#26-example-use-case)
- [27. Example Dashboard](#27-example-dashboard)
- [28. Key Benefits](#28-key-benefits)
- [29. Future Scope](#29-future-scope)
- [30. Project Structure](#30-project-structure)
- [31. Getting Started](#31-getting-started)
- [32. Development Principles](#32-development-principles)
- [33. Research and References](#33-research-and-references)
- [34. Disclaimer](#34-disclaimer)
- [35. Team Vision](#35-team-vision)

---

# 1. Overview

**DHARITRI** is a proposed national digital platform for managing and monitoring the complete land acquisition lifecycle.

The platform is designed around a simple idea:

> **Connect every project, land parcel, affected family, document, compensation event, R&R activity and possession event into one traceable digital lifecycle.**

Land acquisition is not a single activity. It involves multiple stages and multiple stakeholders.

A project may begin with a proposal for land and eventually require:

- Land identification
- Parcel mapping
- Land-record verification
- Scrutiny
- Approvals
- Notifications
- Compensation assessment
- Award
- Payment
- Rehabilitation & Resettlement
- Possession
- Project handover

DHARITRI brings these activities into one connected system while integrating with authoritative external government systems wherever possible.

---

# 2. Problem Statement

Land is required for many infrastructure and public-development projects such as:

- Highways
- Railways
- Industrial corridors
- Irrigation projects
- Urban development
- Renewable energy projects
- Public utilities
- Other strategic infrastructure

The land acquisition process involves multiple stakeholders, including:

- Central Ministries
- State Governments
- District Authorities
- Land Acquisition Authorities
- Project Implementing Agencies
- Field Officers
- Land-record authorities
- Financial/payment systems
- Affected and displaced families

At present, acquisition information may be spread across:

```text
District Offices
      +
State Systems
      +
Project Agencies
      +
Land Records
      +
GIS/Cadastral Systems
      +
Financial Systems
      +
Documents
      +
Spreadsheets
      +
Emails
```

This creates several problems:

### Fragmented information

There may be no single view of the current status of a project.

### Manual reporting

Officers may spend significant time collecting and consolidating information.

### Lack of parcel-level visibility

A project may be reported as "mostly complete" while a relatively small number of unresolved parcels are actually blocking possession.

### Difficult delay identification

A dashboard may show that a project is delayed without clearly explaining why.

### Compensation tracking gaps

Payment initiation and actual beneficiary credit are different events. Treating both as simply "Paid" can produce misleading information.

### R&R visibility

Rehabilitation and Resettlement activities may require separate tracking at the affected-family level.

### Document management problems

Finding the latest document and reconstructing the history of changes can be difficult.

### Inter-agency coordination

Different departments may have different systems, workflows and data formats.

---

# 3. Our Vision

## "One connected view of every land acquisition."

DHARITRI aims to create a national platform where an authorized user can move from:

```text
India
  ↓
State
  ↓
District
  ↓
Project
  ↓
Village
  ↓
Acquisition Case
  ↓
Land Parcel
```

and understand the current status at every level.

The platform should help answer:

- What land is required?
- Where is it?
- Which parcels are involved?
- What stage is each parcel in?
- What documents support the case?
- What compensation has been assessed?
- Has payment been initiated?
- Has the financial system confirmed credit?
- What R&R actions are applicable?
- Has possession been completed?
- What is delaying the project?
- What action is required next?

---

# 4. What DHARITRI Solves

DHARITRI addresses the problem through five connected capabilities.

## 4.1 Digital Workflow

Converts the acquisition process from disconnected manual steps into a traceable digital workflow.

## 4.2 GIS-Based Parcel Intelligence

Connects acquisition cases to actual geographic land parcels.

## 4.3 Verified Financial Tracking

Separates compensation assessment, award, payment initiation and confirmed credit.

## 4.4 National Monitoring

Provides dashboards from parcel level to national level.

## 4.5 Decision Support

Uses analytics, alerts and risk scoring to identify bottlenecks and potential delays.

---

# 5. Core Idea

DHARITRI is not intended to replace every existing government system.

Instead, it acts as an **interoperable acquisition-management and decision-support layer**.

```text
Existing Government Systems
        |
        | Authorized APIs / Data Exchange
        ↓
+-----------------------------+
|          DHARITRI           |
|                             |
| Project + Parcel + Workflow |
| Compensation + R&R          |
| Documents + Possession      |
| Dashboards + Analytics      |
+-----------------------------+
        |
        ↓
Better Monitoring & Decisions
```

This distinction is important.

For example:

- A land-record system can provide authorized land information.
- A cadastral/GIS system can provide parcel geometry.
- A financial system can provide payment status.
- DHARITRI connects those facts to the acquisition case and project.

---

# 6. End-to-End Lifecycle

A simplified DHARITRI lifecycle is:

```text
Project Proposal
       ↓
Land Requirement
       ↓
Parcel Identification
       ↓
Land / Record Verification
       ↓
Digital Scrutiny
       ↓
Approval
       ↓
Notification
       ↓
Affected Family Identification
       ↓
Compensation Assessment
       ↓
Award
       ↓
Payment Initiation
       ↓
Financial Verification
       ↓
R&R Processing
       ↓
Possession
       ↓
Project Handover
```

The actual workflow should be configurable because legal and administrative processes may vary by project, authority and applicable rules.

---

# 7. Key Concepts

## 7.1 Project

A project that requires land for infrastructure or public development.

Example:

```text
Project: National Highway XYZ
Type: Highway
State: Uttar Pradesh
District: Varanasi
Required Land: 1,000 hectares
```

---

## 7.2 Land Parcel

A parcel is one identifiable piece or plot of land.

For example:

```text
Parcel P001 → 2 acres
Parcel P002 → 1.5 acres
Parcel P003 → 3 acres
```

A single project may involve thousands of parcels.

Each parcel can be linked to:

- Geographic boundary
- Land-record information
- Acquisition status
- Affected persons/families where applicable
- Compensation
- R&R
- Documents
- Possession
- Audit history

---

## 7.3 Acquisition Case

An acquisition case represents the administrative acquisition process related to land required for a project.

A project can contain many acquisition cases, and each case can be associated with one or more parcels depending on the workflow and data model.

---

## 7.4 Compensation

Compensation represents the monetary amount determined under the applicable acquisition process.

DHARITRI separates:

```text
Assessed
   ↓
Awarded/Approved
   ↓
Payment Initiated
   ↓
Processing
   ↓
Credited
```

Possible exception states:

```text
Failed
Returned
Rejected
Correction Required
```

---

## 7.5 Rehabilitation & Resettlement (R&R)

R&R refers to rehabilitation and resettlement measures and entitlements applicable to affected or displaced families under the relevant legal and administrative framework.

R&R is separate from compensation.

The platform can track:

```text
Affected
Displaced
R&R Applicable
Applicable Entitlements
Approved
Provided
Verified
```

The exact entitlements should be configurable according to the applicable framework.

---

## 7.6 Possession

Possession represents the stage at which the acquired land is taken into possession through the applicable process.

Possession should be tracked separately from:

- Acquisition
- Compensation
- R&R

For example:

```text
Acquisition: Completed
Compensation: Credited
R&R: Completed
Possession: Pending
```

---

# 8. Major Modules

DHARITRI is divided into the following major modules.

```text
1. Authentication & User Management
2. Project Management
3. Land Parcel Management
4. GIS
5. Acquisition Workflow
6. Document Management
7. Compensation
8. Financial Integration
9. R&R
10. Possession
11. Field Verification
12. Notifications & Alerts
13. Dashboards
14. MIS Reporting
15. Analytics
16. Predictive Risk
17. Integration Layer
18. Audit & Compliance
```

---

# 9. GIS and Land Parcel Management

GIS is one of the core components of DHARITRI.

Instead of showing only a list of land records, the system should show land spatially.

A simplified representation:

```text
+---------+---------+---------+
| P001    | P002    | P003    |
| Acquired| Pending | Acquired|
+---------+---------+---------+
| P004    | P005    | P006    |
| Verified| Delayed | Acquired|
+---------+---------+---------+
```

A user can select a parcel and view its associated information.

Example:

```text
Parcel ID: P1024

Village: ABC
District: XYZ
Area: 2.4 hectares

Acquisition:
Under Process

Compensation:
Credited

R&R:
Applicable - In Progress

Possession:
Pending

Documents:
8

Last Updated:
02 Sep 2026
```

---

## 9.1 Project and Parcel Overlay

The system should be able to visualize:

```text
Project Boundary
       +
Cadastral/Parcel Boundary
       +
Acquisition Status
```

This helps answer:

> Which exact parcels are affected by this project?

---

## 9.2 Spatial Queries

With a spatial database, DHARITRI can support queries such as:

- Which parcels intersect a project corridor?
- Which pending parcels are near a particular project section?
- Which parcels have been acquired?
- Where are unresolved cases concentrated?
- What area is covered by selected parcels?

---

## 9.3 Parcel Identifiers

Where an authoritative parcel identifier such as ULPIN is available, DHARITRI should support it.

Conceptually:

```text
ULPIN / Authoritative Parcel ID
             ↓
        Land Parcel
             ↓
      Acquisition Case
             ↓
           Project
```

---

# 10. Compensation and Payment Verification

Compensation is one of the most important parts of the system.

DHARITRI should not use a simplistic:

```text
Officer clicks → PAID
```

model.

Instead:

```text
Compensation Assessment
          ↓
Award
          ↓
Payment Initiated
          ↓
Authorized Financial System
          ↓
Payment Processing
          ↓
Banking/Payment Network
          ↓
Credit Confirmation
          ↓
DHARITRI
```

The final status should preferably be based on the response of an authorized financial/payment system.

---

## 10.1 Compensation Status Model

```text
ASSESSED
    ↓
AWARDED
    ↓
PAYMENT_INITIATED
    ↓
PROCESSING
    ↓
CREDITED
```

Exception paths:

```text
PROCESSING
    ├──→ CREDITED
    ├──→ FAILED
    └──→ RETURNED
```

---

## 10.2 Why This Matters

There is an important difference between:

> "The government initiated the payment."

and:

> "The beneficiary's payment was successfully credited."

DHARITRI should preserve this distinction.

---

## 10.3 Financial Data Minimization

DHARITRI should not require unrestricted access to beneficiary bank accounts.

Instead, the platform should receive the minimum required information through an authorized integration, such as:

- Transaction reference
- Amount
- Date
- Status
- Permitted failure/return information

Sensitive banking details should be masked or excluded unless explicitly required and authorized.

---

# 11. Rehabilitation & Resettlement

R&R is tracked separately from compensation.

For each relevant affected family, the system can record:

```text
Affected: Yes
Displaced: Yes
R&R Applicable: Yes
```

Then:

```text
Applicable Entitlements
       ↓
Eligibility
       ↓
Approval
       ↓
Provision
       ↓
Verification
```

Example:

```text
Family F001

Affected: Yes
Displaced: Yes

R&R:
Approved
  ↓
Entitlement A: Provided
Entitlement B: Pending
Entitlement C: Verified
```

This provides much better visibility than a single "R&R Completed = Yes/No" field.

---

# 12. Digital Workflow and Approvals

DHARITRI provides a digital case workflow.

An authorized user receives a case in their work queue.

They can see:

- Project
- Parcel
- Land information
- Documents
- Previous actions
- Current stage
- Pending requirements
- Deadlines

Possible actions:

```text
Approve
Reject
Return for Correction
Request Clarification
Forward
```

Every action is recorded.

Example:

```text
Officer A
14:32
Status: Pending → Verified

Officer B
15:10
Status: Verified → Approved
```

---

# 13. Document Management

Every acquisition case can have a secure document repository.

Possible document categories:

- Project proposal
- Survey records
- Maps
- Notifications
- Awards
- Compensation documents
- R&R documents
- Possession records
- Field evidence
- Other supporting records

---

## 13.1 Version Control

Documents should not simply be overwritten.

Example:

```text
Survey.pdf
   ↓
Version 1
   ↓
Version 2
   ↓
Version 3
```

Metadata can include:

- Uploaded by
- Date/time
- Version
- Document type
- Case/parcel
- Verification status

---

## 13.2 Audit History

The system should preserve an audit trail of important actions.

Example:

```text
10 Aug
Officer A uploaded Survey.pdf

12 Aug
Officer B uploaded revised Survey.pdf

14 Aug
District Officer verified document
```

---

# 14. Field Verification

DHARITRI should provide a mobile-responsive field interface.

A field officer can:

1. Open an assigned parcel.
2. View its location.
3. Capture GPS information.
4. Capture photographs where required.
5. Upload evidence.
6. Enter observations.
7. Submit verification.

Example:

```text
Parcel P1024

[Open Map]

GPS: Captured
Photo: 3 uploaded

Boundary:
[Verified]

Field Observation:
____________________

[Submit Verification]
```

The platform records:

- User
- Date/time
- Location/evidence where applicable
- Submitted information
- Verification status

---

# 15. Dashboards and Monitoring

DHARITRI provides dashboards at multiple levels.

```text
National
   ↓
State
   ↓
District
   ↓
Project
   ↓
Village
   ↓
Parcel
```

---

## 15.1 National Dashboard

Example:

```text
NATIONAL LAND ACQUISITION

Projects                 2,450

Land Proposed            8.2 M ha
Land Notified            6.9 M ha
Land Acquired            5.8 M ha
Land in Possession       5.1 M ha

Compensation Assessed    ₹XX,XXX Cr
Compensation Credited    ₹XX,XXX Cr

Affected Families        8.4 Lakh
Displaced Families       2.1 Lakh

R&R Progress             76%

Projects At Risk         128
Projects Delayed          94
```

These values are illustrative.

---

## 15.2 Project Dashboard

Example:

```text
PROJECT: NH-999

Land Required:           1,000 ha
Land Acquired:             930 ha
Possession:                870 ha

Compensation:
Assessed:                 ₹500 Cr
Credited:                 ₹470 Cr

Affected Families:        4,000
R&R Completed:             88%

Overall Acquisition:       93%

Risk:                       HIGH
```

---

# 16. Alerts and Escalation

DHARITRI should automatically identify situations requiring attention.

Examples:

### Upcoming deadline

> Compensation milestone is due in 5 days.

### Delayed milestone

> Possession milestone is delayed by 18 days.

### Payment failure

> Compensation payment failed and requires correction.

### R&R delay

> R&R progress is below the configured target.

### Workflow backlog

> Proposal has remained at the current stage beyond the configured threshold.

---

## 16.1 Escalation

An issue can move through an escalation hierarchy.

```text
Field/Case Level
      ↓
District Authority
      ↓
State Authority
      ↓
Central Monitoring
```

The exact escalation rules should be configurable.

---

# 17. Analytics and Predictive Decision Support

DHARITRI should not only answer:

> "What has happened?"

It should also help answer:

> "What is likely to happen and where should attention be focused?"

---

## 17.1 Bottleneck Analysis

Suppose:

```text
2,400 parcels pending

Ownership/Record Issues     480
Compensation                 720
R&R                           310
Field Verification            270
Documentation                 190
Other                         430
```

The system can identify:

> Compensation is currently the largest bottleneck.

---

## 17.2 Delay Risk

The system can calculate a risk score using factors such as:

- Pending parcel percentage
- Milestone delays
- Compensation backlog
- Payment failures
- R&R backlog
- Unresolved cases
- Historical processing time
- Remaining time before deadline

Example:

```text
Project: NH-999

Risk: HIGH

Major factors:
1. 35 unresolved parcels
2. Compensation pending for 20 parcels
3. R&R below target
4. Possession deadline approaching
```

---

## 17.3 Explainable Risk

The risk engine should not simply output:

> HIGH RISK

It should explain why.

This is important because government officers should be able to understand and evaluate the basis of an alert.

---

## 17.4 Prototype Approach

For the SIH prototype, a transparent rule-based model can be used.

Example:

```text
+20 → Major milestone overdue
+15 → High pending parcel ratio
+15 → Compensation backlog
+10 → R&R below target
+10 → Repeated workflow delay
```

The total score can map to:

```text
0–20    LOW
21–40   MEDIUM
41–60   HIGH
61+     CRITICAL
```

These thresholds are prototype examples and should be calibrated using real historical data in a production system.

---

# 18. Role-Based Access Control

DHARITRI is a multi-stakeholder platform.

Different users should have different access.

## Central Ministry

Can monitor national/state/project performance according to authorization.

## State Authority

Can monitor relevant state projects and districts.

## District Authority

Can manage district-level acquisition cases.

## Project Implementing Agency

Can manage its projects and submit required information.

## Field Officer

Can access assigned field cases.

## R&R Officer

Can access relevant R&R information.

## Finance/Payment Role

Can access authorized compensation/payment information.

## System Administrator

Manages users, configuration and system operations.

---

## 18.1 Principle of Least Privilege

Users should receive only the access required for their responsibilities.

For example:

```text
Field Officer
      ↓
Assigned Parcels
      ↓
Field Verification
```

They should not automatically receive access to national financial information.

---

# 19. System Architecture

The proposed architecture is modular and API-first.

```text
                         USERS
                           |
          +----------------+----------------+
          |                |                |
        Web App         Mobile Web        Admin
          |                |                |
          +----------------+----------------+
                           |
                      API Gateway
                           |
       +-------------------+-------------------+
       |                   |                   |
 Authentication       Workflow Engine      Project Service
       |                   |                   |
       +-------------------+-------------------+
                           |
                 Land Acquisition Layer
                           |
      +---------+----------+----------+---------+
      |         |                     |         |
     GIS    Documents           Compensation   R&R
      |         |                     |         |
      +---------+----------+----------+---------+
                           |
                   PostgreSQL + PostGIS
                           |
              +------------+------------+
              |            |            |
         Object Store    Redis     Integration APIs
                                       |
                         +-------------+-------------+
                         |             |             |
                    Land Records     GIS/Maps      Finance/
                                                   Payment
```

---

# 20. Data Model

A simplified conceptual data model is:

```text
PROJECT
   |
   +---- MILESTONE
   |
   +---- ACQUISITION CASE
             |
             +---- LAND PARCEL
             |        |
             |        +---- GIS GEOMETRY
             |        |
             |        +---- LAND RECORD REFERENCE
             |
             +---- AFFECTED PERSON/FAMILY
             |        |
             |        +---- COMPENSATION
             |        |       |
             |        |       +---- PAYMENT TRANSACTION
             |        |
             |        +---- R&R ENTITLEMENTS
             |
             +---- NOTIFICATION
             |
             +---- AWARD
             |
             +---- DOCUMENT
             |
             +---- POSSESSION
             |
             +---- AUDIT EVENTS
```

---

## 20.1 Important Entities

### Project

Stores project-level information.

### Parcel

Stores the acquisition-related identity and spatial information of land.

### Acquisition Case

Stores the administrative process.

### Person/Family

Stores relevant affected/displaced-party information according to authorization and applicable rules.

### Compensation

Stores assessment/award information.

### Payment Transaction

Stores relevant payment integration status.

### R&R Entitlement

Stores applicable R&R items and their progress.

### Notification

Stores relevant notification information.

### Award

Stores acquisition award information.

### Possession

Stores possession events and supporting information.

### Document

Stores document metadata and links to secure storage.

### Audit Event

Stores important system/user actions.

### Milestone

Stores planned and actual dates.

---

# 21. Technology Stack

The following stack is recommended for the prototype.

| Layer | Technology |
|---|---|
| Frontend | Next.js / React |
| Language | TypeScript |
| UI | Tailwind CSS + accessible component library |
| Backend | Node.js + NestJS |
| API | REST + OpenAPI |
| Database | PostgreSQL |
| Spatial Database | PostGIS |
| Maps | MapLibre / OpenLayers |
| Spatial Processing | GDAL / GeoPandas |
| Authentication | OAuth2/OIDC + MFA |
| Authorization | RBAC + policy-based access |
| File Storage | S3-compatible object storage |
| Cache | Redis |
| Background Jobs | BullMQ / Redis |
| Search | PostgreSQL search / OpenSearch when needed |
| Analytics | Python + Pandas |
| ML | Scikit-learn / XGBoost |
| Monitoring | Prometheus + Grafana |
| Logging | Centralized structured logging |
| Containers | Docker |
| CI/CD | GitHub Actions or equivalent |

The technology stack can be changed based on deployment requirements.

---

# 22. Integration Strategy

The platform should use an integration layer.

```text
                   DHARITRI
                       |
                Integration Layer
                       |
       +---------------+---------------+
       |               |               |
 Land Records        GIS          Financial System
       |               |               |
 State Systems    Cadastral Data    Payment Status
```

---

## 22.1 Land Records

Where authorized APIs are available, DHARITRI can obtain relevant land-record information.

The system should record:

- Source
- Retrieval time/date
- Relevant identifier
- Data version/reference where available

---

## 22.2 GIS/Cadastral Systems

Authorized cadastral and spatial information can be used to:

- Display parcel boundaries
- Identify affected parcels
- Calculate spatial relationships
- Visualize acquisition progress

---

## 22.3 Financial Systems

An authorized financial/payment system can provide:

- Transaction reference
- Amount
- Date
- Status
- Permitted failure/return information

The platform should use this to determine whether compensation was successfully credited.

---

## 22.4 Existing Government Portals

Where existing government systems already provide a specific function, DHARITRI should prefer integration over unnecessary duplication.

---

# 23. Security and Privacy

DHARITRI may handle sensitive information.

Security must therefore be a core part of the architecture.

## Authentication

- Strong authentication
- MFA where appropriate
- Secure sessions

## Authorization

- RBAC
- Department-based restrictions
- Geographic restrictions
- Assignment-level access

## Data Security

- TLS for data in transit
- Encryption at rest
- Secure object storage
- Secrets management

## Audit

- User activity logs
- Status changes
- Document history
- Administrative actions

## API Security

- Authentication
- Authorization
- Rate limiting
- Input validation
- Monitoring

---

## 23.1 Privacy by Design

The platform should follow data minimization.

For example, an executive dashboard does not need to expose a beneficiary's complete bank details.

It can show:

```text
Beneficiary ID: B1024
Amount: ₹8,50,000
Status: Credited
Transaction Reference: Masked
```

The exact information visible depends on role and authorization.

---

# 24. Interoperability

India already has important digital land and acquisition systems.

DHARITRI should be designed to work with that ecosystem.

The architecture should support:

- Common data models
- API adapters
- Standard data formats
- Data validation
- Source tracking
- Identifier mapping
- Versioning
- Reconciliation

The system should not assume that every state has identical technology.

---

## 24.1 Common Data Model

Different systems may represent the same information differently.

For example:

```text
System A → Parcel_ID
System B → Plot_Number
System C → ULPIN
```

The integration layer can map these into a common internal model while preserving the original identifier.

---

# 25. Prototype vs Production

A major principle of the project is:

> **Demonstrate the architecture honestly.**

During SIH, the team may not have access to restricted government APIs or real financial systems.

Therefore, the prototype can use:

```text
Mock Land Record API
Mock Payment API
Sample GIS Dataset
Sample Documents
Sample Project Data
```

For example:

```text
Prototype:

DHARITRI
   ↓
Mock Payment API
   ↓
CREDITED
```

Production:

```text
DHARITRI
   ↓
Authorized Government/Financial Integration
   ↓
Actual Transaction Status
```

The prototype should never claim that a mock API is a live government integration.

---

# 26. Example Use Case

## Highway Project

Suppose a highway project requires:

**1,000 hectares**

The proposed alignment crosses several villages.

The project authority creates:

```text
Project: NH-999
Required Land: 1,000 ha
```

---

## Step 1 — Parcel Identification

GIS identifies:

```text
2,340 affected parcels
```

---

## Step 2 — Land Verification

The system retrieves authorized land information where available.

Field officers verify selected information in the field.

---

## Step 3 — Acquisition Workflow

The proposal moves through the configured stages.

```text
Proposal
   ↓
Scrutiny
   ↓
Approval
   ↓
Notification
   ↓
Award
```

---

## Step 4 — Compensation

Suppose compensation for one case is:

```text
₹8,50,000
```

The award is approved.

The payment is initiated.

The financial integration initially reports:

```text
PROCESSING
```

Later it reports:

```text
CREDITED
```

DHARITRI automatically reflects:

> Compensation: Credited

No officer needs to manually claim that the beneficiary received the money.

---

## Step 5 — R&R

For an applicable displaced family:

```text
R&R Applicable: Yes

Entitlement A: Approved
Entitlement B: Provided
Entitlement C: Pending
```

---

## Step 6 — Possession

After the required process is completed:

```text
Possession:
Completed
```

---

## Step 7 — Dashboard

The project dashboard updates automatically.

```text
Land Required:       1,000 ha
Land Acquired:         930 ha
Possession:            870 ha

Compensation:
Assessed:              ₹500 Cr
Credited:              ₹470 Cr

R&R Completed:          88%

Risk:                   HIGH
```

---

# 27. Example Dashboard

A complete project dashboard could contain:

```text
+------------------------------------------------+
|                 NH-999 PROJECT                 |
+------------------------------------------------+

Land
Required       1,000 ha
Notified         970 ha
Acquired         930 ha
Possession       870 ha

Compensation
Assessed        ₹500 Cr
Awarded         ₹490 Cr
Initiated       ₹480 Cr
Credited        ₹470 Cr
Failed/Returned  ₹5 Cr

Families
Affected        4,000
Displaced       1,000
R&R Completed     88%

Timeline
Overall Status       AT RISK
Days Delayed         18

Top Bottlenecks
1. 35 parcels unresolved
2. 20 compensation cases pending
3. R&R below target

Risk
HIGH
```

---

# 28. Key Benefits

## 28.1 Transparency

Provides a clear view of acquisition progress to authorized stakeholders.

## 28.2 Accountability

Maintains an audit history of important actions.

## 28.3 Faster Monitoring

Reduces the need for repeated manual status collection.

## 28.4 Better Coordination

Creates a shared view across participating departments.

## 28.5 Verified Compensation Tracking

Distinguishes payment initiation from successful beneficiary credit.

## 28.6 Parcel-Level Visibility

Makes it possible to identify exactly which parcels are causing delays.

## 28.7 Better R&R Monitoring

Tracks affected/displaced families and applicable R&R progress separately.

## 28.8 Better Field Operations

Allows mobile-based verification and geo-tagged evidence.

## 28.9 Better Decision Making

Converts raw information into bottlenecks, alerts and risk indicators.

## 28.10 National-Level Monitoring

Allows project information to be aggregated from parcel level to national level.

---

# 29. Future Scope

The initial SIH prototype can be expanded significantly.

## 29.1 More Government Integrations

Connect additional:

- Land-record systems
- Registration systems
- GIS systems
- Financial systems
- Government portals

subject to authorization and availability.

---

## 29.2 Advanced Machine Learning

With sufficient historical data:

- Predict acquisition completion dates
- Predict payment delays
- Predict R&R delays
- Identify high-risk projects
- Estimate likely bottlenecks

---

## 29.3 Multilingual Interface

Support Indian languages for field users and potentially citizen-facing interfaces.

---

## 29.4 Offline Field Mode

Allow field officers to:

- Download assigned work
- Collect information offline
- Capture GPS/photos
- Synchronize when connectivity returns

This can be valuable in areas with weak network connectivity.

---

## 29.5 Citizen Information Portal

A controlled public-facing portal could allow affected people to access relevant non-sensitive information.

Possible features:

- Case status
- Notification information
- Compensation stage
- R&R status
- Grievance status
- Relevant public documents

Privacy restrictions must always be enforced.

---

## 29.6 Advanced Spatial Analysis

Future versions could support:

- Project corridor optimization
- Parcel clustering
- Spatial bottleneck analysis
- Historical acquisition heatmaps
- Infrastructure planning insights

---

## 29.7 Digital Grievance Management

A future module could allow:

```text
Grievance
   ↓
Submission
   ↓
Assignment
   ↓
Investigation
   ↓
Response
   ↓
Resolution
```

---

# 30. Project Structure

A possible project structure is:

```text
dharitri/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   └── types/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── projects/
│   │   ├── parcels/
│   │   ├── gis/
│   │   ├── acquisition/
│   │   ├── compensation/
│   │   ├── rr/
│   │   ├── possession/
│   │   ├── documents/
│   │   ├── notifications/
│   │   ├── analytics/
│   │   ├── integrations/
│   │   └── audit/
│   └── tests/
│
├── services/
│   ├── analytics/
│   └── integrations/
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schemas/
│
├── gis/
│   ├── sample-data/
│   └── processing/
│
├── docs/
│
├── docker/
│
├── .env.example
├── docker-compose.yml
└── README.md
```

The exact structure can change according to the team's implementation approach.

---

# 31. Getting Started

## Prerequisites

Depending on the implementation:

- Node.js
- npm/pnpm
- PostgreSQL
- PostGIS
- Redis
- Docker
- Git

---

## Clone the Repository

```bash
git clone <repository-url>
cd dharitri
```

---

## Install Dependencies

Example:

```bash
npm install
```

If the project uses separate frontend and backend applications:

```bash
cd frontend
npm install

cd ../backend
npm install
```

---

## Environment Variables

Create environment files from the provided examples.

For example:

```bash
cp .env.example .env
```

Typical configuration may include:

```env
DATABASE_URL=
REDIS_URL=
AUTH_SECRET=
OBJECT_STORAGE_ENDPOINT=
OBJECT_STORAGE_BUCKET=
PAYMENT_API_URL=
LAND_RECORD_API_URL=
GIS_API_URL=
```

Actual variables depend on implementation.

---

## Start Development Environment

If Docker Compose is provided:

```bash
docker compose up
```

Otherwise, start the frontend and backend separately according to the project scripts.

---

# 32. Development Principles

## Principle 1 — Authoritative Source First

If an authoritative system can provide a fact, prefer integration over duplicate manual entry.

Example:

```text
Payment Status

Bad:
Officer → Paid

Better:
Financial System → Credited
```

---

## Principle 2 — Never Mix Different Statuses

Keep these separate:

```text
Acquisition Status
Compensation Status
R&R Status
Possession Status
```

They represent different things.

---

## Principle 3 — Every Important Action Should Be Traceable

Record:

```text
Who
What
When
Old Value
New Value
Reason/Comment where required
```

---

## Principle 4 — Explain Risk Scores

Do not show:

```text
Risk = HIGH
```

without explaining:

```text
Why?
```

---

## Principle 5 — Design for Interoperability

Do not assume that DHARITRI will own all data.

It should be capable of consuming data from authorized external systems.

---

## Principle 6 — Minimize Sensitive Data

Store and expose only what is required for the user's role and the system's purpose.

---

## Principle 7 — Build Mobile-First Field Workflows

Field officers should be able to complete essential tasks from a phone.

---

## Principle 8 — Keep Legal Decisions With Authorized Authorities

The system can:

- Track
- Validate
- Alert
- Analyze
- Recommend

But it should not independently make legally binding acquisition decisions.

---

# 33. Research and References

DHARITRI is designed in the context of the existing Government of India land-information ecosystem.

## Smart India Hackathon 2026 — PS16

**Problem ID:** SIH26016

Problem:

> Real-Time National Land Acquisition & Management System for End-to-End Digital Monitoring and Decision Support

Primary reference:

https://sih2026.vuce.in/en/ps/SIH26016

---

## Department of Land Resources

Official website:

https://dolr.gov.in/

Relevant for:

- Land records
- Land-resource programmes
- DILRMP
- Official guidelines and documents

---

## Digital India Land Records Modernization Programme (DILRMP)

Official reference:

https://dolr.gov.in/en/programmes-schemes/dilrmp-2/

Relevant areas:

- Record of Rights
- Cadastral map digitization
- Integration of textual and spatial land information
- Registration-related integration
- Survey/resurvey
- Modern land-record infrastructure

---

## DILRMP 3.0

Operational guidelines for 2026–2031:

https://dolr.gov.in/en/document/digital-india-land-records-modernization-programmedilrmp-3-0-operational-guidelines-2026-2031/

This is particularly relevant because DHARITRI is being designed in 2026.

---

## DILRMP Portal

https://dilrmp.gov.in/

Relevant for understanding national land-record modernization monitoring and ULPIN-related information.

---

## ULPIN / Bhu-Aadhaar

ULPIN means:

> Unique Land Parcel Identification Number

It is relevant to DHARITRI because a unique parcel identifier can help connect:

```text
Land Record
   +
GIS Parcel
   +
Acquisition Case
   +
Project
```

---

## Bhoomi Rashi

Official portal:

https://bhoomirashi.gov.in/

Bhoomi Rashi is an important existing example of digital land-acquisition-related infrastructure in the National Highway context.

DHARITRI should not claim to replace such systems.

Instead, the proposed architecture is:

```text
Existing Systems
      ↓
Authorized Integration
      ↓
DHARITRI
      ↓
National Monitoring + Decision Support
```

---

## GIS and Spatial Technology

Potential implementation technologies:

- PostgreSQL
- PostGIS
- MapLibre
- OpenLayers
- GeoJSON
- GDAL
- GeoPandas

These are technology choices for the prototype. Production deployment should use approved government infrastructure, datasets and GIS services where applicable.

---

# 34. Disclaimer

DHARITRI is a proposed solution developed in response to **Smart India Hackathon 2026 PS16**.

The prototype may use:

- Mock APIs
- Sample land records
- Sample cadastral/GIS data
- Simulated financial transactions
- Synthetic project/family data

These should not be interpreted as live access to Government of India databases, banking systems or restricted information.

Actual production deployment would require:

- Government authorization
- Data-sharing agreements
- Official APIs
- Security assessment
- Applicable legal and policy compliance
- Integration with approved infrastructure
- Validation of workflows against the applicable rules

The system is intended to support authorized government decision-making, not replace legal or administrative authority.

---

# 35. Team Vision

DHARITRI is built around a simple belief:

> **Land acquisition should be visible as a complete journey, not as a collection of disconnected files and status reports.**

A project should not be represented only by a percentage.

A project should be understood through:

```text
Project
   ↓
Land
   ↓
Parcel
   ↓
Affected Family
   ↓
Acquisition Stage
   ↓
Compensation
   ↓
Verified Payment
   ↓
R&R
   ↓
Possession
   ↓
Project Progress
```

And at every level, decision-makers should be able to ask:

> **What is happening?**

> **Why is it happening?**

> **What is delayed?**

> **Who needs to act?**

> **What should happen next?**

That is the purpose of DHARITRI.

---

## DHARITRI

### Digital Hub for Acquisition, Rehabilitation, Integrated Tracking, Records & Intelligence

**Connecting Land, People and Development through Digital Governance.**
