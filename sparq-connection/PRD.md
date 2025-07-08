# Sparq Connection – Product Requirements Document (PRD)

**Doc ID:** SC‑PRD‑MVP‑2.0
**Owner:** Product Lead (Chris Ouimet)
**Status:** Updated - Psychology Framework Complete
**Last Updated:** January 2025

---

## 1 Executive Summary

Sparq Connection is the **Relationship Intelligence Platform** that turns everyday moments into opportunities for partners to communicate, grow, and reconnect. Built on 10+ evidence-based psychological frameworks and powered by adaptive AI, we're creating a new category of **Proactive Relationship Health**.

**The Problem:** 67% of couples report feeling disconnected in their daily lives, yet existing solutions either treat partners as separate users, push static advice, or require expensive therapy.

**Our Solution:** An AI-adaptive platform that creates personalized daily connection moments, evolving with each couple's unique psychological dynamics and therapeutic needs.

**North‑Star Metric:** "Psychology-Informed Daily Connection Moments Created per Couple"

---

## 2 Purpose & Vision

Every design decision should increase the frequency, depth, and therapeutic value of daily connection moments between partners.

**Product Pillars**

1. **Psychology‑Based** – Grounded in 10+ therapeutic modalities: Attachment Theory, Love Languages, Gottman Method, CBT, DBT, EFT, ACT, Mindfulness, Positive Psychology, and Somatic Therapy.
2. **AI‑Adaptive** – Content that evolves with the couple's psychological profiles, compatibility analysis, and intervention progress.
3. **Clinically Safe** – Crisis detection, therapeutic appropriateness, and professional referral systems.
4. **Research‑Validated** – Evidence-based assessments (ECR-R, Gottman principles) with measurable outcomes.

---

## 3 Market Analysis & Opportunity

### 3.1 Market Size
- **TAM:** $4.2B relationship wellness market (2024)
- **SAM:** $890M digital relationship tools segment
- **SOM:** $45M AI-powered psychology platforms (projected 2026)

### 3.2 Problem Validation
- 73% of couples want tools that adapt to their specific psychological dynamics
- 82% prefer personalized interventions over generic relationship advice
- 56% find existing solutions lack scientific rigor and measurable outcomes
- 68% would pay for psychology-based relationship intelligence

### 3.3 Competitive Landscape

| Player             | Strengths                  | Gaps Sparq Exploits                     | Psychology Depth |
| ------------------ | -------------------------- | --------------------------------------- | ------------ |
| Paired.com         | Large content library      | No psychology framework, static content | Basic        |
| Lasting            | Therapist‑designed courses | Course‑heavy, no personalized assessment | Moderate     |
| Gottman Card Decks | Evidence‑based prompts     | Single modality, no progress tracking   | Single Focus |
| BetterHelp         | Professional therapy       | Individual focus, expensive, reactive   | Professional |

**Opportunity:** Establish *Proactive Relationship Psychology* category with comprehensive multi-modal therapeutic framework.

---

## 4 Objectives & Key Results (12‑Month Horizon)

| #  | Objective              | Key Result                            | Target            | Success Criteria |
| -- | ---------------------- | ------------------------------------- | ----------------- | ---------------- |
|  1 | Deploy Psychology MVP  | Psychology modalities implemented     | 10+ modalities    | All 10 complete  |
|  2 | Drive clinical impact  | Relationship Health† improvement      | +20 pts @ 90 days | +25 pts stretch  |
|  3 | Validate assessments   | Assessment accuracy vs. clinical gold | >90% correlation  | >95% stretch     |
|  4 | Psychology engagement  | Assessment completion rate            | >85%              | >90% stretch     |
|  5 | Therapeutic outcomes   | Intervention effectiveness rating     | >80% helpful      | >85% stretch     |

†Multi-dimensional psychology-based relationship health scoring

---

## 5 User Personas & Psychology Profiles

### 5.1 Enhanced Personas with Psychology Integration

| Persona                  | Psychology Profile                               | Therapeutic Needs                               | Goals                                            |
| ------------------------ | ------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------ |
| **Alex (Avoidant)**      | High avoidance, low anxiety attachment           | CBT for emotional expression, EFT for bonds     | Learn emotional availability skills              |
| **Sam (Anxious)**        | Low avoidance, high anxiety attachment           | DBT for regulation, ACT for acceptance          | Feel secure and emotionally regulated            |
| **Taylor (Secure)**      | Balanced attachment, growth-minded               | Mindfulness, Positive Psychology strengths      | Optimize relationship and support partner        |

### 5.2 Psychology-Informed User Journey

#### Assessment Phase (First Use)
1. **Intake** → Comprehensive psychology assessment → Profile creation
2. **Analysis** → Couple compatibility analysis → Personalized recommendations
3. **Intervention Planning** → Therapeutic modality selection → Goal setting

#### Daily Therapeutic Engagement
1. **Check-in** → Daily psychological wellness check-in
2. **Intervention** → Psychology-informed daily question or exercise
3. **Progress** → Track improvement across psychological dimensions
4. **Growth** → Celebrate milestones and relationship health improvements

---

## 6 Psychology Framework Specifications

### 6.1 Implemented Therapeutic Modalities ✅

| ID       | Modality               | Assessment Type                | Outcomes Measured                                | Integration Status |
| -------- | ---------------------- | ------------------------------ | ------------------------------------------------ | ------------------ |
| **P‑01** | Attachment Theory      | ECR-R based (32 questions)    | Security/Anxiety/Avoidance scores                | ✅ Complete        |
| **P‑02** | Love Languages         | Gary Chapman framework        | Primary/Secondary language + compatibility       | ✅ Complete        |
| **P‑03** | Gottman Method         | Four Horsemen detection       | Relationship health + communication patterns     | ✅ Complete        |
| **P‑04** | CBT                    | Cognitive distortion ID       | Thought patterns + challenging skills            | ✅ Complete        |
| **P‑05** | DBT                    | Emotional regulation skills   | Regulation/Tolerance/Effectiveness/Mindfulness   | ✅ Complete        |
| **P‑06** | EFT                    | Emotional awareness           | Awareness/Expression + attachment injuries       | ✅ Complete        |
| **P‑07** | ACT                    | Values clarification          | Psychological flexibility + values alignment     | ✅ Complete        |
| **P‑08** | Mindfulness            | Present-moment awareness      | Practice frequency + technique preferences       | ✅ Complete        |
| **P‑09** | Positive Psychology    | Character strengths (VIA)     | Top strengths + gratitude practices             | ✅ Complete        |
| **P‑10** | Somatic Therapy        | Body awareness               | Somatic preferences + trauma-informed needs      | ✅ Complete        |

### 6.2 Assessment Architecture ✅

| Component | Implementation | Status |
| --------- | -------------- | ------ |
| **Database Schema** | 14 tables with psychology framework | ✅ Deployed |
| **Assessment Components** | React components for all modalities | ✅ Complete |
| **Scoring Algorithms** | Research-based scoring for each framework | ✅ Validated |
| **Compatibility Engine** | Cross-modality couple analysis | ✅ Operational |
| **TypeScript Integration** | Complete type safety | ✅ Verified |

### 6.3 Psychology Dashboard Features

| Feature | Description | Priority | Status |
| ------- | ----------- | -------- | ------ |
| **Psychology Profile** | Individual comprehensive profile across 10+ modalities | P0 | ✅ Built |
| **Compatibility Analysis** | Couple analysis with recommendations | P0 | ✅ Built |
| **Progress Tracking** | Growth visualization across psychological dimensions | P0 | ✅ Built |
| **Intervention Recommendations** | Personalized therapeutic interventions | P1 | 🔄 Next |
| **Daily Check-ins** | Brief daily psychological wellness tracking | P1 | ✅ Built |

---

## 7 AI Integration & Clinical Safety

### 7.1 Psychology-Aware AI Features

| Feature | Current Status | Next Implementation |
| ------- | -------------- | ------------------- |
| **Question Generation** | Basic AI framework | Psychology-informed prompts |
| **Crisis Detection** | Keyword + sentiment | Clinical validation framework |
| **Intervention Matching** | Static recommendations | Dynamic psychology-based matching |
| **Progress Analysis** | Manual tracking | AI-powered insight generation |

### 7.2 Clinical Safety Protocols

#### Crisis Intervention Enhancement
1. **Multi-Modal Detection**: Keyword + sentiment + behavioral patterns + psychology risk factors
2. **Clinical Validation**: Psychology-informed risk assessment algorithms
3. **Professional Routing**: Integration with licensed therapist networks
4. **Outcome Tracking**: Follow-up effectiveness measurement

#### Therapeutic Appropriateness
1. **Content Validation**: All AI outputs reviewed for clinical appropriateness
2. **Modality Matching**: Interventions matched to individual psychology profiles
3. **Contraindication Checking**: Automatic screening for therapeutic contraindications
4. **Professional Oversight**: Regular review by licensed mental health professionals

---

## 8 Technical Architecture - Psychology Integration

### 8.1 Enhanced Database Schema ✅

| Table Category | Tables | Purpose | Status |
| -------------- | ------ | ------- | ------ |
| **Core** | users, couples, daily_questions, responses | Basic functionality | ✅ Deployed |
| **Psychology** | user_psychology_profiles, couple_psychology_analysis | Individual & couple psychology | ✅ Deployed |
| **Interventions** | psychology_interventions, user_intervention_progress | Therapeutic interventions | ✅ Deployed |
| **Assessment** | psychology_assessments, daily_psychological_checkins | Assessment & tracking | ✅ Deployed |

### 8.2 Psychology-Specific Performance Requirements

- **Assessment Load:** < 1s for psychology assessment startup
- **Compatibility Analysis:** < 500ms for couple analysis generation
- **Database Queries:** < 100ms for psychology profile lookups
- **Crisis Detection:** < 200ms for safety system response

### 8.3 Psychology Data Security

- **Profile Encryption**: Individual psychology profiles encrypted until couple consent
- **Assessment Privacy**: Raw assessment data separated from interpreted results
- **Clinical Confidentiality**: Crisis detection follows HIPAA-like standards
- **Research Ethics**: All data collection follows psychological research ethics

---

## 9 Monetization Strategy - Psychology Premium

### 9.1 Enhanced Revenue Model

- **Psychology Freemium**: Basic attachment + love languages assessment free
- **Pricing Tiers:**
  - **Basic (Free)**: 2 psychology modalities, basic compatibility
  - **Psychology Pro ($14.99/month)**: All 10+ modalities, detailed analysis, intervention recommendations
  - **Clinical Plus ($24.99/month)**: Professional insights, therapist referrals, advanced progress tracking

### 9.2 Psychology-Driven Conversion

- **Assessment Value**: Comprehensive psychology profile as upgrade driver
- **Intervention Access**: Premium interventions based on psychology analysis
- **Professional Integration**: Licensed therapist consultation add-on
- **Progress Analytics**: Detailed growth tracking and insights

---

## 10 Success Metrics - Psychology Focus

### 10.1 Psychology Framework KPIs

| Category | Metric | Target | Measurement |
| -------- | ------ | ------ | ----------- |
| **Assessment** | Completion rate for comprehensive evaluation | >85% | Weekly tracking |
| **Accuracy** | Correlation with validated clinical instruments | >90% | Monthly validation |
| **Therapeutic Impact** | User-reported improvement in targeted areas | >80% | 90-day follow-up |
| **Engagement** | Psychology dashboard daily active usage | >70% | Daily monitoring |

### 10.2 Clinical Outcome Metrics

| Modality | Primary Outcome | Secondary Outcomes | Validation Method |
| -------- | --------------- | ------------------ | ----------------- |
| **Attachment** | Security score improvement | Anxiety/avoidance reduction | ECR-R correlation |
| **Love Languages** | Expression frequency increase | Satisfaction improvement | Partner reporting |
| **Gottman** | Four Horsemen reduction | Positive interaction ratio | Behavioral tracking |
| **CBT** | Cognitive distortion decrease | Thought challenging usage | Self-monitoring |

---

## 11 Current Status & Next Phase

### 11.1 Psychology Framework Achievement ✅

**Major Milestone Completed**: Comprehensive psychology framework with 10+ therapeutic modalities fully implemented and deployed.

**Technical Infrastructure**:
- ✅ Complete database schema (14 tables)
- ✅ All psychology assessments implemented
- ✅ Couple compatibility analysis engine
- ✅ TypeScript integration and type safety
- ✅ Assessment scoring algorithms validated

**Psychology Coverage**:
- ✅ 10+ therapeutic modalities complete
- ✅ Research-based assessments (ECR-R, Gottman principles)
- ✅ Comprehensive couple compatibility analysis
- ✅ Individual and couple progress tracking

### 11.2 Immediate Next Phase: AI Integration

**Priority 1**: Psychology-informed AI question generation
**Priority 2**: Clinical-grade crisis detection system
**Priority 3**: Personalized intervention recommendations
**Priority 4**: Professional therapist integration

### 11.3 Launch Readiness Assessment

| Component | Status | Ready for Beta |
| --------- | ------ | -------------- |
| **Psychology Framework** | ✅ Complete | Ready |
| **Database Infrastructure** | ✅ Complete | Ready |
| **Assessment System** | ✅ Complete | Ready |
| **AI Integration** | 🔄 Next Phase | 4-6 weeks |
| **Clinical Validation** | 🔄 Next Phase | 6-8 weeks |

---

## 12 Risk Management - Psychology Focus

### 12.1 Clinical Risks

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| **Assessment Inaccuracy** | Low | High | Validate against clinical gold standards |
| **Inappropriate Interventions** | Medium | High | Professional review, contraindication checking |
| **Crisis False Negatives** | Low | Severe | Multi-layer detection, professional oversight |

### 12.2 Regulatory Risks

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| **Psychology Practice Regulations** | Medium | Medium | Legal review, professional supervision |
| **Data Privacy (Psychology)** | Low | High | Enhanced encryption, minimal data collection |
| **Clinical Claims Validation** | Medium | Medium | Evidence-based approach, clinical partnerships |

---

## 13 Professional Integration Strategy

### 13.1 Therapist Marketplace (Post-MVP)

- **Licensed Professional Network**: Verified therapist partnerships
- **Referral Integration**: Seamless handoff from app to professional care
- **Outcome Tracking**: Measure effectiveness of app + therapy combination
- **Revenue Sharing**: Therapist referral fee model

### 13.2 Clinical Validation Program

- **Academic Partnerships**: University research collaborations
- **Outcome Studies**: Longitudinal effectiveness research
- **Publication Strategy**: Peer-reviewed research validation
- **Professional Endorsement**: Licensed clinician review and approval

---

## 14 Open Questions & Next Steps

### 14.1 Strategic Decisions

1. **Clinical Partnerships**: Which therapeutic organizations to partner with first
2. **Regulatory Strategy**: Psychology practice compliance across jurisdictions
3. **Academic Validation**: Research partnership prioritization
4. **Professional Integration**: Therapist marketplace timing and structure

### 14.2 Immediate Action Items

- [x] Complete psychology framework implementation
- [x] Deploy comprehensive database schema
- [x] Validate assessment accuracy
- [ ] Integrate AI with psychology profiles
- [ ] Implement clinical-grade crisis detection
- [ ] Begin therapist partnership discussions
- [ ] Conduct clinical outcome validation studies

---

## 15 Appendices - Psychology Framework

### 15.1 Psychology Reference Materials
- **A. Complete Modality Specifications**
- **B. Assessment Validation Studies**
- **C. Couple Compatibility Algorithm Documentation**
- **D. Clinical Safety Protocols**
- **E. Professional Integration Guidelines**

### 15.2 Technical Documentation
- **Database Schema Documentation**
- **Psychology Type Definitions**
- **Assessment Scoring Algorithms**
- **Compatibility Analysis Methods**

---

> *"We build psychology-informed rituals, not features. We create therapeutic moments, not just products."*
> — **Sparq Connection Enhanced Philosophy**

---

**Document Control:**
- **Version:** 2.0 - Psychology Framework Complete
- **Major Update:** Psychology framework implementation completed
- **Review Cycle:** Monthly
- **Next Review:** February 2025
- **Distribution:** Internal team, clinical advisors, key stakeholders
- **Classification:** Confidential - Clinical Development