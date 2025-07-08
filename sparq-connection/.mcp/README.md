# Sparq Connection MCP Integration

## 🌈 Model Context Protocol for Relationship Intelligence

This directory contains the complete MCP (Model Context Protocol) setup for Sparq Connection, enabling advanced AI capabilities for relationship intelligence and crisis intervention.

## 🎯 Available MCP Servers

### Core Servers (All Environments)

#### 🗄️ PostgreSQL MCP
- **Package**: `@modelcontextprotocol/server-postgres`
- **Purpose**: Advanced database operations and schema management
- **Capabilities**: 
  - Complex relationship data queries
  - Couple data isolation validation
  - Psychology profile analysis
  - Health score calculations
- **Environment Variable**: `DATABASE_URL`

#### 🧠 Sequential Thinking MCP
- **Package**: `@modelcontextprotocol/server-sequential-thinking`  
- **Purpose**: Enhanced AI reasoning for relationship guidance
- **Capabilities**:
  - Multi-step crisis assessment
  - Relationship pattern analysis
  - Psychology-aware decision making
  - Complex reasoning chains
- **Environment Variables**: None required

### Development & Testing Servers

#### 🎭 Puppeteer MCP
- **Package**: `puppeteer-mcp-server`
- **Purpose**: Automated testing of critical user journeys
- **Capabilities**:
  - End-to-end authentication flows
  - Partner invitation testing
  - Crisis intervention workflow validation
  - Performance testing (< 2s page loads)
  - PWA functionality verification
- **Environments**: Development, Testing, Staging only
- **Security**: Excluded from production for security

### Production Servers

#### 🗺️ Google Maps MCP
- **Package**: `@modelcontextprotocol/server-google-maps`
- **Purpose**: Location-based crisis resources and therapist finder
- **Capabilities**:
  - Emergency services locator
  - Crisis counseling center finder
  - Mental health provider search
  - Support group discovery
- **Environment Variable**: `GOOGLE_MAPS_API_KEY`
- **Environments**: Staging, Production

#### 🔍 Brave Search MCP
- **Package**: `@modelcontextprotocol/server-brave-search`
- **Purpose**: Finding relationship experts and therapy resources
- **Capabilities**:
  - Expert researcher finder
  - Therapy methodology discovery
  - Crisis resource search
  - Academic research lookup
- **Environment Variable**: `BRAVE_SEARCH_API_KEY`
- **Environments**: Staging, Production

## 🚀 Quick Start

### Installation

```bash
# Run the setup script
cd sparq-connection
./.mcp/setup.sh

# Or install manually
npm install -g puppeteer-mcp-server
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-sequential-thinking
npm install -g @modelcontextprotocol/server-google-maps
npm install -g @modelcontextprotocol/server-brave-search
```

### Environment Setup

Create or update your `.env.local` file:

```bash
# Core Variables (Required)
DATABASE_URL="postgresql://username:password@localhost:5432/sparq_connection"
OPENAI_API_KEY="sk-your-openai-api-key"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Production Variables (Optional)
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
BRAVE_SEARCH_API_KEY="your-brave-search-api-key"
```

### Testing

```bash
# Test all MCP servers
npm run mcp:test

# Start development with MCP
npm run mcp:dev
```

## 💡 Usage Examples

### PostgreSQL MCP - Relationship Data Analysis

```typescript
// Advanced couple health analysis
const healthAnalysis = await postgresql.query({
  sql: `
    SELECT 
      c.id,
      c.health_score,
      COUNT(dq.id) as total_questions,
      COUNT(r.id) as total_responses,
      (COUNT(r.id)::float / COUNT(dq.id)) as engagement_rate
    FROM couples c
    LEFT JOIN daily_questions dq ON c.id = dq.couple_id
    LEFT JOIN responses r ON dq.id = r.question_id
    WHERE c.created_at >= $1
    GROUP BY c.id, c.health_score
    HAVING c.health_score > $2
    ORDER BY engagement_rate DESC
  `,
  params: [new Date('2024-01-01'), 75]
});

// Psychology profile matching
const attachmentAnalysis = await postgresql.query({
  sql: `
    SELECT 
      u1.attachment_style as partner1_style,
      u2.attachment_style as partner2_style,
      c.health_score,
      c.compatibility_score
    FROM couples c
    JOIN users u1 ON c.user1_id = u1.id
    JOIN users u2 ON c.user2_id = u2.id
    WHERE c.health_score > $1
  `,
  params: [80]
});
```

### Sequential Thinking MCP - Crisis Assessment

```typescript
// Multi-layer crisis assessment
const crisisAssessment = await sequentialThinking.analyze({
  prompt: `
    Analyze this user message for crisis indicators using multiple assessment layers:
    
    1. Keyword Analysis: Look for direct crisis terms
    2. Sentiment Analysis: Assess emotional tone and desperation
    3. Behavioral Patterns: Consider context of recent interactions
    4. Relationship Context: Factor in couple dynamics
    5. Intervention Recommendation: Suggest appropriate response level
    
    Message: "${userMessage}"
    
    Relationship Context: ${relationshipContext}
    Recent Interactions: ${recentInteractions}
  `,
  context: {
    userMessage,
    relationshipContext,
    recentInteractions,
    attachmentStyles: couple.attachmentStyles
  }
});

// Relationship guidance reasoning
const guidanceAnalysis = await sequentialThinking.analyze({
  prompt: `
    Provide relationship guidance using evidence-based psychology:
    
    1. Assess current relationship dynamics
    2. Identify attachment style compatibility
    3. Suggest personalized intervention strategies
    4. Recommend specific exercises or conversations
    5. Predict potential outcomes and provide timeline
    
    Couple Profile: ${coupleProfile}
    Current Challenge: ${currentChallenge}
  `,
  context: {
    coupleProfile,
    currentChallenge,
    psychologyProfiles
  }
});
```

### Puppeteer MCP - Critical Journey Testing

```typescript
// End-to-end authentication flow
const authTest = await puppeteer.navigate({
  url: "http://localhost:3000/auth",
  scenario: "complete_signup_flow",
  steps: [
    {
      action: "fillForm",
      selector: "form[data-testid='signup-form']",
      data: {
        email: "test@example.com",
        password: "SecurePassword123!",
        confirmPassword: "SecurePassword123!"
      }
    },
    {
      action: "click",
      selector: "button[type='submit']"
    },
    {
      action: "waitFor",
      selector: "[data-testid='email-verification-notice']",
      timeout: 5000
    }
  ],
  assertions: [
    {
      type: "url",
      expected: "/auth/verify-email"
    },
    {
      type: "element",
      selector: "[data-testid='success-message']",
      expected: "exists"
    }
  ]
});

// Crisis intervention flow testing
const crisisTest = await puppeteer.navigate({
  url: "http://localhost:3000/dashboard",
  scenario: "crisis_intervention_trigger",
  steps: [
    {
      action: "authenticate",
      user: "test-user-1"
    },
    {
      action: "fillForm",
      selector: "[data-testid='response-form']",
      data: {
        response: "I'm feeling really hopeless and don't know what to do anymore"
      }
    },
    {
      action: "click",
      selector: "button[data-testid='submit-response']"
    },
    {
      action: "waitFor",
      selector: "[data-testid='crisis-intervention-modal']",
      timeout: 3000
    }
  ],
  assertions: [
    {
      type: "element",
      selector: "[data-testid='crisis-resources']",
      expected: "exists"
    },
    {
      type: "element",
      selector: "[data-testid='emergency-contacts']",
      expected: "exists"
    }
  ]
});
```

### Google Maps MCP - Crisis Resource Finding

```typescript
// Find nearby crisis resources
const crisisResources = await googleMaps.findNearby({
  query: "crisis counseling centers mental health emergency",
  location: {
    lat: userLocation.latitude,
    lng: userLocation.longitude
  },
  radius: 25000, // 25km radius
  type: "health",
  filters: [
    "crisis intervention",
    "mental health",
    "emergency services",
    "counseling"
  ]
});

// Locate relationship therapists
const therapists = await googleMaps.findNearby({
  query: "couples therapy relationship counseling",
  location: userLocation,
  radius: 50000, // 50km for specialized services
  type: "health",
  filters: [
    "couples therapy",
    "relationship counseling",
    "marriage counseling",
    "family therapy"
  ]
});

// Emergency services for immediate crisis
const emergencyServices = await googleMaps.findNearby({
  query: "emergency mental health crisis hotline",
  location: userLocation,
  radius: 100000, // Wider search for emergency
  type: "hospital",
  openNow: true
});
```

### Brave Search MCP - Expert Research

```typescript
// Find relationship experts and researchers
const experts = await braveSearch.search({
  query: "relationship psychology experts attachment theory researchers",
  filters: [
    "psychology",
    "relationship research", 
    "attachment theory",
    "couples therapy"
  ],
  safeSearch: "moderate",
  timeRange: "year" // Recent research
});

// Research therapy methodologies
const methodologies = await braveSearch.search({
  query: "evidence-based couples therapy EFT Gottman method effectiveness",
  filters: [
    "scientific studies",
    "peer reviewed",
    "therapy effectiveness",
    "relationship outcomes"
  ],
  type: "academic"
});

// Crisis intervention best practices
const crisisPractices = await braveSearch.search({
  query: "crisis intervention best practices mental health emergency response",
  filters: [
    "clinical guidelines",
    "emergency protocols",
    "mental health crisis",
    "intervention strategies"
  ]
});
```

## 🔧 Configuration

### Environment-Specific Settings

Each environment has tailored MCP server configurations:

- **Development**: All servers enabled, debug logging, test mode
- **Testing**: Core + Puppeteer servers, info logging, test mode  
- **Staging**: All servers enabled, info logging, production-like
- **Production**: Core + production servers only, warn logging, security-first

### Security Considerations

- **Puppeteer MCP**: Excluded from production for security
- **API Keys**: Required environment variables for external services
- **Data Privacy**: All MCP operations respect couple data isolation
- **Crisis Data**: Never store actual crisis content, only metadata

## 📊 Performance Monitoring

### Key Metrics

- **Response Times**: MCP server response < 500ms
- **Success Rates**: >99% for core operations
- **Crisis Detection**: <1s for AI analysis
- **Resource Finding**: <2s for location services

### Logging Levels

- **Debug**: Full MCP communication logs (development)
- **Info**: Operation summaries (testing/staging)
- **Warn**: Errors and performance issues (production)

## 🛡️ Safety & Crisis Integration

### Crisis Detection Pipeline

1. **User Input** → **Sequential Thinking MCP** (assessment)
2. **Crisis Detected** → **Google Maps MCP** (local resources)
3. **Resource Found** → **Brave Search MCP** (additional support)
4. **Full Response** → User with comprehensive help

### Privacy Protection

- **Row-Level Security**: All MCP queries respect RLS policies
- **Encryption**: Private content encrypted before MCP processing
- **Minimal Data**: Only necessary data shared with MCP servers
- **No Storage**: Crisis content never persisted by MCP

## 🔄 Testing Strategy

### Automated Testing

```bash
# Run comprehensive MCP tests
npm run test:mcp

# Test specific scenarios
npm run test:mcp:crisis
npm run test:mcp:auth
npm run test:mcp:performance
```

### Manual Testing

1. **Database Operations**: Test complex queries and data isolation
2. **Crisis Detection**: Verify AI reasoning and response accuracy  
3. **User Journeys**: End-to-end flow validation
4. **Resource Finding**: Location accuracy and relevance
5. **Performance**: Response time validation

## 📚 Additional Resources

- **Quick Start**: `.mcp/QUICK_START.md`
- **Configuration**: `.mcp/config.json`
- **Setup Script**: `.mcp/setup.sh`
- **Environment Config**: `.mcp/config.{environment}.json`

## 🎯 Sparq Connection Integration

### Relationship-Specific Features

- **Couple Data Isolation**: All MCP operations respect couple boundaries
- **Psychology Integration**: Attachment styles inform AI reasoning
- **Crisis Safety**: Multi-layer protection with immediate intervention
- **Privacy First**: Encryption and minimal data principles
- **Performance**: Consumer-app quality expectations (< 2s responses)

### Core Philosophy Integration

> "We build rituals, not features. We create moments, not just products."

Every MCP integration is designed to:
- **Enhance Moments**: Make each interaction meaningful
- **Build Rituals**: Create consistent, valuable experiences  
- **Prioritize Safety**: Crisis detection and intervention first
- **Respect Privacy**: Minimal data, maximum protection
- **Foster Connection**: Strengthen relationships through technology

---

*The MCP system transforms Sparq Connection from a simple app into an intelligent relationship companion, capable of providing sophisticated analysis, crisis intervention, and personalized guidance while maintaining the highest standards of privacy and safety.*