# DHARITRI - Proposed Solution

## 1. Solution Overview

We propose a **National Land Acquisition & Management Platform** that works as a common digital layer connecting projects, land parcels, acquisition workflows, documents, GIS information, compensation, R&R, possession, external government systems and decision-making dashboards.

The platform is designed around one simple principle:

> **Every important event in a land-acquisition case should be traceable, connected to the correct project and parcel, and verified from an authoritative source wherever possible.**

The system should not simply be a website where officers manually enter everything.

Instead, it should combine:

- Digital workflows
- GIS
- Land-parcel tracking
- Secure documents
- Financial/payment integration
- Field verification
- Role-based access
- Dashboards
- Alerts
- MIS reports
- Analytics
- Predictive risk analysis
- API-based interoperability

---

## 2. The Proposed System in Simple Terms

Imagine that the government is acquiring land for a highway.

The system creates a digital project.

The project is connected to:

> the land parcels → affected people/families → documents → acquisition stages → compensation → payment confirmation → R&R → possession.

At the same time, the same information is available at different levels:

```text
National
  ↓
State
  ↓
District
  ↓
Project
  ↓
Acquisition Case
  ↓
Land Parcel
```

Each level sees only what the user's role allows.

---

## 3. Core Workflow

The platform should support a configurable end-to-end workflow.

A simplified example is:

```text
Project Proposal
      ↓
Land Requirement
      ↓
Parcel Identification
      ↓
Land/Record Verification
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

The actual workflow should be configurable because legal and administrative processes can differ.

---

## 4. Project Registration

A Project Implementing Agency or authorized department creates a project.

Example:

- Project name
- Project type
- Department
- State
- District
- Villages
- Estimated land requirement
- Project start/end dates
- Acquisition target dates
- Project documents
- Geographic alignment/boundary

After submission, the system routes the proposal to the appropriate authority according to configured rules.

---

## 5. GIS and Land Parcel Module

GIS is one of the most important parts of the proposed solution.

The system should show project areas and land parcels on an interactive map.

For example:

```text
Project Boundary
        +
Cadastral/Parcel Data
        +
Acquisition Status
```

A user can click a parcel and see its authorized information.

Example:

```text
Parcel ID: P1024
Village: ABC
District: XYZ
Area: 2.4 hectares

Acquisition Status:
Compensation

Possession:
Pending

R&R:
Applicable

Documents:
8

Last Updated:
02 Sep 2026
```

### Parcel status visualization

A map can use different visual states such as:

- Acquired
- Under process
- Verification pending
- Compensation pending
- Possession pending
- Delayed
- Issue/dispute requiring attention

The exact colors and status definitions should be configurable.

---

## 6. Parcel-Level Tracking

The project is the high-level unit, but the parcel is where many real problems become visible.

Suppose:

```text
Project requirement = 1,000 hectares
Parcels = 2,340
```

The system should know the status of each parcel.

For example:

```text
1,950 — Completed acquisition
180   — Compensation processing
95    — Ownership verification
65    — Field verification
50    — Other pending cases
```

The system can then aggregate these numbers to the project, district, state and national levels.

---

## 7. Land Records Integration

The platform should not pretend to be the source of every land record.

Where authorized APIs or integration mechanisms exist, the platform should connect to relevant land-record systems.

The system can use external information for purposes such as:

- Parcel identification
- Land-record lookup
- Ownership information
- Record verification
- Parcel identifiers
- Other permitted land information

The platform should maintain a record of:

> Which source supplied the information, when it was retrieved, and what version/date of information was used.

This improves trust and auditability.

---

## 8. ULPIN and Existing Parcel Identifiers

Where a Unique Land Parcel Identification Number (ULPIN) or another authoritative parcel identifier is available, the platform should use it as an important reference rather than creating unnecessary duplicate identities.

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

This makes it easier to connect land information with acquisition information.

---

## 9. Digital Scrutiny and Approval

When a proposal is submitted, the authorized officer gets a digital case.

The officer can see:

- Project details
- Required land
- Parcels
- Available land information
- Maps
- Documents
- Previous actions
- Pending requirements
- Applicable workflow stage

The officer can then take an authorized action such as:

- Approve
- Reject
- Return for correction
- Request clarification

Every action should be recorded with:

- User
- Role
- Timestamp
- Action
- Previous status
- New status
- Comments/reason where required

---

## 10. Secure Document Management

Every project/acquisition case can have a secure digital document folder.

Possible documents include:

- Project proposal
- Maps
- Survey documents
- Notifications
- Awards
- Compensation records
- R&R records
- Possession documents
- Field evidence
- Other legally relevant documents

### Version control

If a document is replaced or updated, the previous version should not simply disappear.

The system should preserve:

```text
Version 1
Version 2
Version 3
```

with metadata such as:

- Uploaded by
- Date/time
- Version
- Document type
- Relevant case/parcel

---

## 11. Compensation Management

Compensation should be separated into different stages.

A recommended status model is:

```text
Assessment
   ↓
Award Approved
   ↓
Payment Initiated
   ↓
Processing
   ↓
Credited
```

There should also be exception states:

```text
Failed
Returned
Rejected
Correction Required
```

### Why?

Because:

> Payment initiated ≠ Money credited.

An officer initiating a payment does not necessarily mean the beneficiary received it.

---

## 12. Financial/Payment Integration

The proposed platform should integrate with an authorized government payment or financial system.

A simplified flow:

```text
Compensation Award
       ↓
Payment Instruction
       ↓
Authorized Financial System
       ↓
Banking/Payment Network
       ↓
Transaction Result
       ↓
Your Platform
```

The platform receives the relevant status, such as:

```text
Transaction ID
Amount
Date
Status
Failure/return information where available
```

The system should store only the information required for land-acquisition monitoring and should not require unrestricted access to a beneficiary's bank account.

### Final status

The dashboard should preferably use:

> **Credited**

when the authorized financial source confirms successful credit.

This is stronger than allowing an officer to manually select "Paid."

---

## 13. R&R Module

The R&R module should track affected and displaced families and the applicable rehabilitation/resettlement process.

For each family, where legally and operationally applicable, the system can track:

```text
Affected: Yes/No
Displaced: Yes/No
R&R Applicable: Yes/No
Applicable Entitlements
Approval
Provision
Verification
```

Each entitlement can move through a workflow:

```text
Eligible
  ↓
Approved
  ↓
Provided
  ↓
Verified
```

The platform should allow different entitlement categories because R&R requirements are not identical for every case.

---

## 14. Field Verification

A mobile-responsive interface allows field officers to work from the field.

A field officer can:

1. Open assigned parcel.
2. View the location on the map.
3. Capture GPS/location information.
4. Capture photographs where required.
5. Upload supporting documents/evidence.
6. Enter field observations.
7. Submit verification.
8. Record the date/time and user identity.

The system can then update the relevant workflow.

### Example

```text
Parcel P1024
      ↓
Assigned to Field Officer
      ↓
Visit location
      ↓
Capture GPS + Photo
      ↓
Verify boundary/details
      ↓
Submit
      ↓
District officer receives verified case
```

---

## 15. Possession Tracking

Possession should be tracked separately from acquisition and compensation.

A project may have:

- Acquisition completed
- Compensation credited
- But possession still pending

Therefore the system should clearly distinguish:

```text
Acquisition Status
Compensation Status
R&R Status
Possession Status
```

For example:

```text
Parcel P100

Acquisition: Completed
Compensation: Credited
R&R: Completed
Possession: Pending
```

This prevents different stages from being incorrectly treated as the same thing.

---

## 16. Timeline and Milestone Management

Each project can have milestones.

Example:

```text
Proposal             15 Jan
Verification         30 Jan
Notification         20 Feb
Award                30 Apr
Compensation         30 May
R&R                  15 Jun
Possession           30 Jun
```

The system compares:

> Planned date vs actual date.

Possible status:

- On track
- At risk
- Delayed
- Completed

The system should automatically calculate the number of days ahead/behind schedule.

---

## 17. Automated Alerts

The system should notify relevant users when action is required.

Examples:

### Upcoming deadline

> Compensation milestone is due in 5 days.

### Overdue milestone

> Possession milestone is delayed by 18 days.

### Payment failure

> Payment for beneficiary/case X failed and requires correction.

### R&R delay

> R&R milestone has not progressed within the expected period.

### Workflow waiting

> Proposal has remained with the current authority for longer than the configured threshold.

Alerts should follow the user's role and escalation rules.

---

## 18. National Dashboard

The national dashboard is the executive view.

It should display metrics such as:

- Number of projects
- Land proposed
- Land notified
- Land acquired
- Land in possession
- Compensation assessed
- Compensation awarded
- Compensation initiated
- Compensation successfully credited
- Affected families
- Displaced families
- R&R progress
- Delayed projects
- Projects at risk

Example:

```text
NATIONAL LAND ACQUISITION STATUS

Projects                  2,450

Land Proposed             8.2 M ha
Land Notified             6.9 M ha
Land Acquired             5.8 M ha
Land in Possession        5.1 M ha

Compensation Assessed     ₹XX,XXX Cr
Compensation Credited     ₹XX,XXX Cr

Affected Families         8.4 Lakh
Displaced Families        2.1 Lakh

R&R Progress              76%

Projects At Risk          128
Projects Delayed          94
```

The numbers above are illustrative only.

---

## 19. Drill-Down

The dashboard should not stop at national numbers.

A user should be able to drill down:

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
Parcel
```

This makes the system useful for both policy-level decisions and operational work.

---

## 20. Bottleneck Analysis

A strong feature is identifying why land acquisition is slow.

Example:

```text
Pending Parcels = 2,400

Ownership/Record Issues     480
Compensation                 720
R&R                           310
Field Verification            270
Documentation                 190
Other                         430
```

Now an officer can see:

> Compensation is currently the largest bottleneck.

This is more useful than simply showing "2,400 parcels pending."

---

## 21. Predictive Analytics

The system can calculate a project delay-risk score.

Potential inputs include:

- Number of pending parcels
- Percentage of acquisition completed
- Number of unresolved cases
- Compensation pending
- Payment failures
- R&R progress
- Milestone delays
- Historical processing times
- Current workflow backlog

Example:

```text
Project NH-999

Risk: HIGH

Reasons:
1. 35 unresolved parcels
2. Compensation pending for 20 parcels
3. R&R below target
4. Possession milestone already delayed
```

The first version can use transparent rule-based scoring.

For example:

```text
+20 points → Major milestone overdue
+15 points → High pending parcel ratio
+15 points → Compensation backlog
+10 points → R&R below target
+10 points → Repeated workflow delay
```

Later, historical data can be used to train a machine-learning model.

The important principle is:

> Prediction should help an officer understand where attention is needed, not replace official decision-making.

---

## 22. Role-Based Access

Different users should see different information.

### Central Ministry

National and state-level monitoring.

### State Authority

State projects and relevant district information.

### District Authority

District-level acquisition cases.

### Project Implementing Agency

Its own projects and required actions.

### Field Officer

Assigned field cases.

### R&R Officer

Relevant R&R cases.

### Finance/Payment Role

Authorized compensation/payment information.

### Administrator

System configuration and user management.

Access should be based on role, department, geography and assigned responsibilities.

---

## 23. Audit Trail

Every important action should be recorded.

Example:

```text
14:32 — Officer A
Parcel P123
Status:
Pending → Verified

15:10 — Officer B
Compensation:
₹8,50,000 → ₹9,20,000

16:05 — Payment Integration
Transaction:
Processing → Credited
```

This helps answer:

> Who did what, when, and what changed?

---

## 24. Proposed Technical Architecture

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
       +-------------------+--------------------+
       |                   |                    |
 Authentication       Workflow Engine      Project Service
       |                   |                    |
       +-------------------+--------------------+
                           |
              Land Acquisition Services
                           |
       +-----------+-------+--------+-----------+
       |           |                |           |
      GIS       Documents     Compensation     R&R
       |           |                |           |
       +-----------+-------+--------+-----------+
                           |
                    PostgreSQL/PostGIS
                           |
             +-------------+-------------+
             |             |             |
         Object Store    Redis      Integration APIs
                                       |
                         +-------------+-------------+
                         |             |             |
                    Land Records     GIS/Maps     Finance/
                                                   Payment
```

---

## 25. Suggested Technology

| Component | Suggested Technology |
|---|---|
| Frontend | Next.js / React + TypeScript |
| UI | Tailwind CSS + accessible component library |
| Backend | Node.js with NestJS |
| API | REST + OpenAPI |
| Database | PostgreSQL |
| Spatial Database | PostGIS |
| Maps | MapLibre / OpenLayers / authorized GIS services |
| Spatial Processing | GDAL / GeoPandas where needed |
| Authentication | OAuth2/OIDC + MFA |
| Authorization | RBAC + policy-based access |
| File Storage | S3-compatible object storage |
| Cache | Redis |
| Background Jobs | BullMQ/Redis or equivalent |
| Search | PostgreSQL search / OpenSearch where scale requires it |
| Analytics | Python + Pandas |
| Predictive Analytics | Scikit-learn/XGBoost initially |
| Monitoring | Prometheus + Grafana |
| Logging | Centralized structured logging |
| Deployment | Docker; cloud/Kubernetes-ready |
| CI/CD | GitHub Actions or equivalent |

Technology choices can change during implementation. The important requirement is interoperability, security, scalability and maintainability.

---

## 26. Security Design

The platform may handle sensitive land, personal, administrative and financial information.

Important controls include:

- Strong authentication
- Role-based access
- Least-privilege access
- Encryption in transit
- Encryption at rest
- Secure document access
- Audit logs
- Session/security controls
- API authentication
- Input validation
- Rate limiting
- Backup and disaster recovery
- Secure secrets management
- Data retention policies
- Monitoring and incident logging

Personal and financial information should be minimized. Users should only see information necessary for their work.

---

## 27. Interoperability Strategy

The platform should be API-first.

Instead of trying to replace existing systems:

```text
Existing Government Systems
          ↓
Authorized APIs / Integration Layer
          ↓
National Land Acquisition Platform
```

Potential integration areas include:

- Land records
- Cadastral maps
- Parcel identifiers
- Registration-related systems
- Payment/financial systems
- Other relevant government portals

During the SIH prototype, where real government APIs are unavailable, mock APIs or sample datasets can demonstrate the architecture.

The prototype should clearly label these as mock/sandbox integrations rather than claiming production government access.

---

## 28. Suggested MVP

For the hackathon, the strongest minimum viable product should demonstrate:

### 1. Login and roles
Central, State, District, Project Agency and Field Officer.

### 2. Project creation
Create project and define land requirement.

### 3. GIS map
Show project boundary and sample parcels.

### 4. Parcel details
Show parcel, acquisition, compensation, R&R and possession status.

### 5. Workflow
Demonstrate proposal → verification → approval → notification → award → compensation → R&R → possession.

### 6. Field verification
Mobile-responsive GPS/photo/evidence workflow.

### 7. Compensation integration
Demonstrate payment initiated → processing → credited/failed using a mock financial API.

### 8. Document management
Upload, version and audit documents.

### 9. Dashboard
National/state/district/project metrics.

### 10. Alerts
Show delayed milestones and payment failures.

### 11. Risk analysis
Show a transparent project delay-risk score.

---

## 29. Example End-to-End Demonstration

Suppose a highway project needs 1,000 hectares.

The system identifies 2,340 affected parcels.

A field officer verifies Parcel P1024 using a phone.

The land record is obtained from an authorized source.

The acquisition moves through the configured workflow.

Compensation is assessed at ₹8,50,000.

The award is approved.

A payment instruction is sent through the authorized financial integration.

The financial system reports:

> Credited.

The platform automatically changes the compensation status to:

> **Credited**

The officer does not manually mark the money as paid.

The R&R module tracks the applicable entitlement for the affected family.

Once the required possession process is completed, the parcel's possession status changes.

The project dashboard then automatically reflects the new totals.

At the national level, the same underlying information contributes to aggregated project/state/national metrics.

---

## 30. The Main Value Proposition

The solution can be summarized as:

> **Connect every project, parcel, person/family, document, payment, R&R activity and possession event into one traceable digital lifecycle, while integrating with authoritative government systems and converting the resulting information into real-time dashboards, alerts and decision support.**

The system should move government monitoring from:

> "Where is the file and what does the latest spreadsheet say?"

to:

> "What is the current verified status, what is causing the delay, and what action is needed next?"
