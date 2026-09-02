# DHARITRI — Research and References

## 1. Purpose of This Document

This document explains the existing government ecosystem relevant to PS16 and the ideas that should influence the proposed solution.

A strong SIH solution should not assume that India currently has no digital land systems.

There are already important national and sector-specific initiatives.

Therefore, the proposed platform should be presented as:

> **An interoperable national land-acquisition monitoring and decision-support layer that connects with existing land-record, GIS, acquisition and financial systems.**

This is more realistic than claiming that one new application will replace all existing government platforms.

---

## 2. Official SIH 2026 Problem Statement

### Problem

**Real-Time National Land Acquisition & Management System for End-to-End Digital Monitoring and Decision Support**

### Problem ID

**SIH26016**

### Ministry

**Ministry of Rural Development**

### Department

**Department of Land Resources (DoLR)**

### Type

**Software**

The problem asks for a web-based national system covering the land-acquisition lifecycle from project proposal to final possession.

Important requirements include:

- End-to-end digital workflow
- Online proposal submission
- Verification and approval
- GIS-enabled geo-tagging
- National dashboard
- Land proposed/acquired
- Notifications
- Awards
- Compensation assessed/disbursed
- Affected/displaced families
- R&R progress
- Possession
- Timeline monitoring
- API-based integration
- Mobile field collection
- Secure documents
- MIS reports
- Executive dashboards
- Predictive analytics

The official published problem statement should be treated as the primary reference for the SIH-specific requirements.

---

## 3. Department of Land Resources (DoLR)

The Department of Land Resources is under the Ministry of Rural Development.

Its work includes important areas related to:

- Land records
- Land-record modernization
- Land administration
- Digital land information
- Related national programmes

Official reference:

https://dolr.gov.in/

For this project, DoLR is important because PS16 is not an isolated software problem. It sits within a larger national land-information ecosystem.

---

# 4. Digital India Land Records Modernization Programme (DILRMP)

## What is DILRMP?

DILRMP stands for:

**Digital India Land Records Modernization Programme.**

It is a Government of India programme focused on modernizing land-record management.

It includes areas such as:

- Computerization of Record of Rights (RoR)
- Digitization of cadastral maps
- Integration of textual and spatial land records
- Registration-related integration
- Survey/resurvey
- Modern record rooms
- Revenue court-related integration

Official reference:

https://dolr.gov.in/en/programmes-schemes/dilrmp-2/

---

## 5. Why DILRMP Matters to PS16

PS16 needs information about land parcels and their location.

DILRMP is relevant because it provides a national framework for modernizing land records and cadastral information.

The proposed PS16 platform should therefore not unnecessarily recreate the land-record system.

Instead:

```text
DILRMP / State Land Records
            ↓
     Authorized Integration
            ↓
PS16 Land Acquisition Platform
            ↓
Acquisition Monitoring
```

This separation is important.

### Land-record system

Primarily answers:

> What is the official land record?

### Land-acquisition system

Primarily answers:

> What is happening to this land because it is being acquired for a project?

The two systems complement each other.

---

# 6. DILRMP 3.0

The Department of Land Resources has published DILRMP 3.0 operational guidelines for the period **2026–2031**.

This is particularly relevant to a 2026 SIH project because it demonstrates that land-record modernization continues to evolve.

Reference:

https://dolr.gov.in/en/document/digital-india-land-records-modernization-programmedilrmp-3-0-operational-guidelines-2026-2031/

The existence of an evolving national land-record programme reinforces the need for PS16 to be designed for interoperability rather than as an isolated database.

---

# 7. ULPIN / Bhu-Aadhaar

## What is ULPIN?

ULPIN means:

**Unique Land Parcel Identification Number.**

It is commonly referred to as **Bhu-Aadhaar**.

The idea is to provide a unique identifier for an individual land parcel.

Conceptually:

```text
Unique Parcel ID
      ↓
Land Parcel
      ↓
Land Record
      ↓
GIS Boundary
      ↓
Acquisition Case
      ↓
Project
```

This is very useful for PS16.

If an authoritative parcel identifier is available, the acquisition platform should use it as a reference.

It helps avoid situations where:

```text
Land Record System:
Parcel = ABC123

Acquisition System:
Parcel = P-001

GIS System:
Parcel = Plot-45
```

all refer to the same physical land but are not properly connected.

A national acquisition platform should support mapping between identifiers where necessary.

Reference:

https://dilrmp.gov.in/

---

# 8. Cadastral Maps

A cadastral map is a detailed land/parcel map showing boundaries of individual plots.

For PS16, cadastral maps are important because the platform needs to know:

> Which exact parcels fall within a proposed acquisition area?

A conceptual flow is:

```text
Project Corridor
      ↓
Overlay with Parcel Map
      ↓
Affected Parcels
      ↓
Acquisition Tracking
```

This is why the combination of:

**GIS + cadastral data + acquisition workflow**

is much more useful than a normal project-management application.

---

# 9. Bhoomi Rashi Land Acquisition Portal

## What is Bhoomi Rashi?

Bhoomi Rashi is a Government of India land-acquisition portal associated with the Ministry of Road Transport & Highways, particularly for National Highway-related land acquisition.

Official portal:

https://bhoomirashi.gov.in/

It demonstrates that digital land-acquisition workflows are already being used in government.

The portal provides online land-acquisition-related functionality and monitoring/reporting features for the highway ecosystem.

---

# 10. Why Bhoomi Rashi Matters

The proposed PS16 solution should not claim:

> "There is no digital land acquisition system in India."

There are already systems such as Bhoomi Rashi.

Instead, the stronger argument is:

> Existing systems address important sector-specific or departmental requirements, while PS16 asks for a broader national platform that can connect projects, states, districts, land parcels, documents, compensation, R&R, possession and decision support across a wider ecosystem.

This is a much more credible position.

---

# 11. How Bhoomi Rashi and PS16 Can Relate

Conceptually:

```text
Bhoomi Rashi
      ↓
Highway Acquisition Information
      ↓
Integration Layer
      ↓
National Land Acquisition Platform
      ↓
National Monitoring
```

The actual production relationship would depend on official APIs, permissions and government architecture.

For the SIH prototype, this can be represented through a mock integration.

---

# 12. Record of Rights (RoR)

A Record of Rights is a land-record document containing information about rights/interests in land.

It is relevant because acquisition decisions depend on reliable land information.

The proposed platform should not treat an officer's manually typed owner name as the authoritative land record if an authorized land-record source is available.

Better:

```text
Authorized Land Record
        ↓
Retrieved/verified information
        ↓
Acquisition Case
```

The acquisition system should also preserve the source and retrieval date.

---

# 13. Registration and Land Records

Land acquisition may need information connected to land ownership and registration.

The platform can be designed to integrate with relevant authorized systems rather than duplicate them.

The integration layer can normalize different data formats into a common internal model.

Example:

```text
State A API
     \
State B API ----> Integration Layer ---> Common Model
     /
State C API
```

This is important for a national platform because different states may have different technical systems.

---

# 14. Financial/Payment Integration

Compensation is a central part of PS16.

The proposed architecture should distinguish between:

### Compensation assessment

How much is payable?

### Award

What amount has been formally determined?

### Payment initiation

Has the payment instruction been sent?

### Credit confirmation

Has the authorized financial system confirmed that the money was credited?

This is important.

The platform should not simply allow:

```text
Officer → Click "Paid"
```

Instead:

```text
Compensation
     ↓
Payment Instruction
     ↓
Authorized Financial System
     ↓
Bank/Payment Network
     ↓
Credit Confirmation
     ↓
Platform Status = CREDITED
```

Production integration would require the appropriate government/financial authorization and APIs.

---

# 15. Important Security Principle for Payment Data

The platform should not require unrestricted access to a beneficiary's bank account.

A safer approach is:

```text
Financial System
      ↓
Relevant transaction status
      ↓
Land Acquisition Platform
```

The platform should store only the data required for acquisition monitoring.

For example:

- Amount
- Transaction reference
- Date
- Status
- Failure/return reason where permitted

Sensitive bank information should be masked or excluded unless it is explicitly required and authorized.

---

# 16. GIS Technologies

The proposed solution can use established GIS technologies.

Possible technologies include:

### PostGIS

Adds spatial capabilities to PostgreSQL.

Useful for:

- Parcel polygons
- Project boundaries
- Spatial queries
- Area calculations
- Intersections

### MapLibre

Open-source map rendering library suitable for interactive maps.

### OpenLayers

A mature web-mapping library suitable for complex GIS interfaces.

### GeoJSON

A common format for exchanging geographic features.

### GDAL

A widely used toolkit for geospatial data conversion and processing.

These are implementation choices. Actual production deployment should use the government's approved GIS stack and data sources where applicable.

---

# 17. Why PostgreSQL + PostGIS Is a Good Fit

Normal database:

```text
Parcel ID
Area
Village
Status
```

GIS database:

```text
Parcel ID
Area
Village
Status
Boundary Geometry
```

PostGIS allows the system to ask spatial questions such as:

> Which parcels intersect the project boundary?

or:

> Which pending parcels are located along this section of the project corridor?

This makes GIS part of the actual acquisition workflow instead of just a decorative map.

---

# 18. Existing Systems vs Proposed Platform

| Existing/Relevant System | Main Relevance | Role in PS16 |
|---|---|---|
| DILRMP | Land-record modernization | Source/ecosystem for land records and cadastral information |
| ULPIN/Bhu-Aadhaar | Parcel identification | Parcel reference/identity where available |
| Cadastral systems | Parcel boundaries | GIS/spatial layer |
| Bhoomi Rashi | Highway land acquisition | Existing digital acquisition example and potential integration context |
| State land-record systems | State-level land information | Authorized data source |
| Financial/payment systems | Compensation transactions | Verified payment/credit status |
| Registration-related systems | Land/registration information | Relevant integration where authorized |
| PS16 Platform | Acquisition monitoring | Connects project, parcel, workflow, documents, compensation, R&R and possession |

---

# 19. Important Insight: PS16 Is Not Just Another Land Database

This distinction should appear in the SIH presentation.

### Land-record system

Answers:

> "What is the land record?"

### GIS/cadastral system

Answers:

> "Where is the parcel and what is its boundary?"

### Payment system

Answers:

> "What happened to the payment transaction?"

### Acquisition platform

Answers:

> "What is the current end-to-end status of acquiring this parcel for this project?"

### National decision-support layer

Answers:

> "Which projects are delayed, why are they delayed, and where should attention be focused?"

PS16 is strongest when these layers are connected.

---

# 20. Suggested Reference Architecture Based on Existing Ecosystem

```text
                    NATIONAL PLATFORM
                           |
       +-------------------+-------------------+
       |                   |                   |
       ↓                   ↓                   ↓
 Land Records             GIS              Finance
 DILRMP/States       Cadastral/Maps      Payment Systems
       |                   |                   |
       +-------------------+-------------------+
                           ↓
                 Integration Layer
                           ↓
               Land Acquisition Platform
                           |
       +-------------------+-------------------+
       |                   |                   |
   Workflow           Documents          R&R/Compensation
       |                   |                   |
       +-------------------+-------------------+
                           ↓
                  Dashboard + MIS
                           ↓
                  Analytics + Risk
```

---

# 21. Government Standards and Security

A production system should align with applicable Government of India requirements and standards for:

- Information security
- Privacy
- Authentication
- Digital records
- APIs
- Data exchange
- Accessibility
- Audit
- Infrastructure
- Government cloud/deployment requirements where applicable

The SIH prototype should therefore demonstrate good engineering practices even if it does not implement every production certification.

---

# 22. Data Standards

Interoperability requires common data definitions.

For example, the platform should clearly define:

### Project

A project requiring land.

### Parcel

An individual identifiable land unit.

### Acquisition Case

The administrative acquisition record related to land/project.

### Person/Family

An affected or displaced person/family where legally relevant.

### Compensation

Assessment/award/payment information.

### R&R

Applicable rehabilitation/resettlement entitlements and progress.

### Possession

Status of possession after acquisition.

### Document

Supporting official record.

### Milestone

A planned/actual project or acquisition event.

Having clear definitions prevents different systems from using the same word to mean different things.

---

# 23. Research Questions for the Team

Before building the production-like prototype, the team should research:

1. Which land-record APIs are officially available?
2. Which state systems provide parcel information?
3. How is ULPIN used in different states?
4. Which cadastral formats are commonly available?
5. What APIs exist for relevant financial/payment systems?
6. Which data can legally be shared between departments?
7. What information can be shown to citizens?
8. What are the applicable R&R workflows?
9. Which stages vary by state/project type?
10. Which existing government portals can be integrated instead of duplicated?

The answers will influence the final architecture.

---

# 24. Reference List

## Primary

### Smart India Hackathon 2026 — PS16 / SIH26016

Official published problem statement:

https://sih2026.vuce.in/en/ps/SIH26016

Use this as the primary source for the exact SIH requirements.

---

## Department of Land Resources

https://dolr.gov.in/

Useful for:

- Department information
- Land-record programmes
- Official documents
- DILRMP
- Policy/guideline information

---

## DILRMP

https://dolr.gov.in/en/programmes-schemes/dilrmp-2/

Useful for:

- Understanding land-record modernization
- Cadastral map digitization
- Record of Rights
- Integration of spatial and textual records

---

## DILRMP 3.0 Operational Guidelines, 2026–2031

https://dolr.gov.in/en/document/digital-india-land-records-modernization-programmedilrmp-3-0-operational-guidelines-2026-2031/

Useful because the period overlaps directly with the 2026 SIH problem.

---

## DILRMP Portal

https://dilrmp.gov.in/

Useful for understanding national land-record modernization monitoring and ULPIN-related information.

---

## Bhoomi Rashi

https://bhoomirashi.gov.in/

Useful for understanding an existing government digital land-acquisition platform in the National Highway context.

---

# 25. Final Research Conclusion

The research shows that PS16 should be approached as an **interoperability and decision-support problem**, not simply as a land-record digitization problem.

India already has important components:

```text
Land Records
      +
Cadastral Maps
      +
ULPIN
      +
Sector-specific Acquisition Systems
      +
Financial Systems
```

The opportunity in PS16 is to connect these with:

```text
Project Workflow
      +
Parcel-level Acquisition
      +
Compensation Tracking
      +
R&R
      +
Possession
      +
Documents
      +
National Dashboard
      +
Alerts
      +
Analytics
```

The strongest solution therefore follows this principle:

> **Do not replace systems that already perform an authoritative function. Connect them through secure, authorized integrations and build the missing national acquisition-monitoring and decision-support layer around them.**

That makes the proposed system more realistic, scalable and aligned with the existing Government of India digital ecosystem.
