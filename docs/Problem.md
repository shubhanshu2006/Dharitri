# DHARITRI

## Real-Time National Land Acquisition & Management System for End-to-End Digital Monitoring and Decision Support

## 1. Introduction

Land is required for many important development projects in India. Highways, railways, industrial corridors, irrigation projects, urban development projects, renewable-energy projects and other public infrastructure often need large areas of land.

Acquiring that land is not a single activity. It is a long process involving many people and departments. A typical case may involve a project implementing agency, land-acquiring authority, district administration, state government, central ministry, field officers, land-record authorities, finance/payment systems and people whose land is affected.

The main problem is not simply that land acquisition takes time. The larger problem is that information about the process is often spread across different offices, systems, documents and levels of government. This makes it difficult to get one reliable, current picture of what is happening.

PS16 asks for a national web-based system that can digitally monitor the land-acquisition lifecycle from project proposal to final possession, while also providing maps, documents, dashboards, alerts, reports and decision support.

---

## 2. Land Acquisition in Simple Terms

Suppose a government agency wants to construct a new highway.

The planned highway passes through several villages. The agency may need land from hundreds or thousands of individual plots.

The process broadly involves:

1. Identifying the project and the land required.
2. Identifying the affected land parcels.
3. Checking land records and ownership information.
4. Processing the acquisition proposal.
5. Carrying out the required scrutiny and approvals.
6. Issuing the required notifications.
7. Identifying affected people and families.
8. Assessing compensation.
9. Declaring the award.
10. Processing and verifying compensation payments.
11. Providing applicable Rehabilitation and Resettlement (R&R) entitlements.
12. Taking possession of the land.
13. Handing the acquired land over for the project.

The exact legal procedure can vary depending on the applicable law, project and authority. Therefore, a national software platform should support configurable workflows rather than assuming that every acquisition follows one identical sequence.

---

## 3. What Is a Land Parcel?

A land parcel is simply one identifiable piece or plot of land.

For example, a village may contain thousands of individual plots:

- Parcel P001 — 2 acres
- Parcel P002 — 1.5 acres
- Parcel P003 — 3 acres
- Parcel P004 — 0.8 acres

A large project may need land from many such parcels.

A parcel record can contain information such as:

- Parcel identification number
- Village
- Tehsil/sub-district
- District
- Area
- Land-use/type information where available
- Ownership information from an authorized land-record source
- Geographic boundary/location
- Acquisition status
- Compensation information
- R&R information where applicable
- Possession status
- Related documents and audit history

Tracking parcels is important because a project may be mostly complete while a small number of individual parcels are still delaying the project.

---

## 4. What Is Rehabilitation and Resettlement (R&R)?

R&R means Rehabilitation and Resettlement.

It should not be treated as another name for compensation.

Compensation is related to the monetary amount payable for the acquisition of land/property under the applicable rules.

R&R deals with rehabilitation and resettlement measures and entitlements applicable to affected or displaced families under the relevant framework.

For example, if an acquisition results in displacement, the system may need to track:

- Whether the family is affected
- Whether the family is displaced
- Whether R&R is applicable
- Which entitlements apply
- Whether those entitlements have been approved
- Whether they have been provided
- Whether provision has been verified

The exact entitlement should come from the applicable legal and administrative rules. The software should therefore support configurable R&R categories instead of assuming one fixed benefit for every family.

---

## 5. The Existing Problem

### 5.1 Fragmented Information

Land acquisition information can exist in multiple places:

- District offices
- State departments
- Project authorities
- Land-record systems
- GIS/cadastral systems
- Financial/payment systems
- Physical files
- Spreadsheets
- Emails
- State-specific applications

As a result, there may be no single place where an authorized decision-maker can see the complete and latest status of an acquisition.

### 5.2 Manual Documentation

Important records may be handled through documents and files at different stages.

This creates problems such as:

- Difficulty finding the latest document
- Duplicate documents
- Missing documents
- Repeated data entry
- Slow movement of files
- Difficulty checking who changed something
- Difficulty reconstructing the history of a case

### 5.3 Different Processes and Data Formats

Different states and departments may use different systems, terminology, workflows and data formats.

A national platform therefore needs a common framework while still allowing authorized configuration for state/department-specific processes.

### 5.4 Lack of Real-Time Visibility

Senior officers may need answers to questions such as:

- How much land has been proposed?
- How much has been notified?
- How much has actually been acquired?
- How much land is in possession?
- How much compensation has been assessed?
- How much compensation has actually reached beneficiaries?
- How many families are affected?
- How many families are displaced?
- How far has R&R progressed?
- Which projects are delayed?
- Why are they delayed?

If answering these questions requires collecting information manually from several offices, decision-making becomes slow.

### 5.5 Difficulty Identifying the Cause of Delay

A simple progress percentage does not explain the problem.

For example:

> Project progress: 87%

This does not tell an officer why the remaining 13% is pending.

The remaining parcels could be pending because of:

- Ownership verification
- Documentation
- Compensation
- Payment failure
- R&R
- Field verification
- Legal/dispute-related reasons
- Other workflow issues

A useful system must show both the status and the reason behind the status.

### 5.6 Payment Status Should Be Trustworthy

A particularly important issue is compensation.

An officer should not be able to simply click "Paid" and make the dashboard report that money has reached the beneficiary.

The system should distinguish between:

- Compensation assessed
- Award approved
- Payment initiated
- Payment processing
- Successfully credited
- Failed
- Returned/rejected

Where an authorized government/financial integration is available, the final credit status should be obtained from that authoritative payment system.

The platform should not require unrestricted access to a person's bank account. Instead, it should consume the minimum necessary payment/transaction status through an authorized integration.

This creates a difference between:

> "Payment was initiated"

and:

> "The beneficiary's payment was successfully credited."

That distinction is essential for trustworthy monitoring.

---

## 6. Why a National Platform Is Needed

The goal is not to replace every existing government system.

Instead, the proposed platform should work as a connected national layer that brings together:

- Project information
- Land parcels
- Authorized land records
- GIS information
- Acquisition workflow
- Documents
- Compensation
- Payment status
- R&R
- Possession
- Timelines
- Analytics

The idea is:

> One connected view of the land-acquisition lifecycle.

---

## 7. The Core Questions the System Should Answer

For every project, the system should help an authorized user answer:

### What?
What land is required?

### Where?
Where are the affected parcels?

### Who?
Which people/families are affected and which authority is responsible for the current action?

### How much?
How much land is involved and what compensation has been assessed/awarded?

### What stage?
What stage is each parcel and each acquisition case currently in?

### Why delayed?
Why has a parcel, case or project not progressed?

### Who changed it?
Who performed an action and when?

### When?
What was the planned date and what actually happened?

### What next?
What requires attention now?

These questions capture the real purpose of PS16.

---

## 8. Scope of the Problem

| Area | Problem to Be Addressed |
|---|---|
| Project Management | Projects and land requirements need centralized tracking |
| Land Parcels | Individual affected parcels need identification and status tracking |
| Land Records | Authorized land-record information needs to be connected |
| GIS | Land and project information needs spatial visualization |
| Workflow | Acquisition stages need digital routing and tracking |
| Documents | Documents need secure storage, search, versioning and history |
| Notifications | Important notifications and milestones need tracking |
| Compensation | Assessment, award, payment initiation and verified credit status need tracking |
| R&R | Affected/displaced families and applicable R&R progress need monitoring |
| Possession | Parcel-wise and project-wise possession needs tracking |
| Field Work | Field verification needs mobile support and geo-tagged evidence |
| Dashboards | Officers need national, state, district and project-level views |
| Reporting | MIS reports need to be generated without repeated manual consolidation |
| Alerts | Delays and upcoming deadlines need automated alerts |
| Analytics | Bottlenecks and trends need to be identified |
| Prediction | Projects at risk of delay should be identified early |
| Security | Sensitive information must be protected using controlled access and auditing |
| Integration | Existing government systems should be connected through authorized APIs |

---

## 9. The Problem in One Sentence

The central problem is:

> India needs a reliable, secure and interoperable national platform that can connect the entire land-acquisition lifecycle, provide parcel-level visibility, verify important events through authoritative systems where possible, and turn fragmented data into timely information for decision-makers.

---

## 10. What Success Would Look Like

A successful system would allow an authorized officer to open a project and immediately understand:

- The land required
- The parcels involved
- The current acquisition stage
- Documents associated with the case
- Compensation assessed and awarded
- Actual payment/credit status where integrated
- R&R progress
- Possession status
- Delayed milestones
- Reasons for delay
- Responsible authority
- Overall project risk

The platform should reduce the need to manually collect information from multiple offices simply to understand the current status of a project.
