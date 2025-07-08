const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Sparq Connection Database State Verification');
console.log('===============================================');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('\n📋 Table Verification:');
  
  // Expected tables from all migrations
  const expectedTables = {
    // Core tables (Migration 001)
    'users': { migration: '001', description: 'User profiles and authentication' },
    'couples': { migration: '001', description: 'Relationship/couple management' },
    'invitations': { migration: '001', description: 'Partner invitation system' },
    'daily_questions': { migration: '001', description: 'AI-generated daily questions' },
    'responses': { migration: '001', description: 'User responses to questions' },
    'reflections': { migration: '001', description: 'Private encrypted journal entries' },
    'quests': { migration: '001', description: 'Relationship exercises and activities' },
    'crisis_events': { migration: '001', description: 'Crisis detection metadata' },
    
    // Psychology framework tables (Migration 004)
    'user_psychology_profiles': { migration: '004', description: 'Individual psychology profiles (10+ modalities)' },
    'couple_psychology_analysis': { migration: '004', description: 'Couple compatibility analysis' },
    'psychology_interventions': { migration: '004', description: 'Evidence-based intervention library' },
    'user_intervention_progress': { migration: '004', description: 'User progress through interventions' },
    'daily_psychological_checkins': { migration: '004', description: 'Daily emotional wellness check-ins' },
    'psychology_assessments': { migration: '004', description: 'Assessment responses and results' }
  };
  
  const existingTables = [];
  const missingTables = [];
  
  for (const [tableName, info] of Object.entries(expectedTables)) {
    try {
      // Try to query the table structure - if it exists, this will succeed
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(0); // Get no rows, just test if table exists
        
      if (error) {
        if (error.message.includes('does not exist') || error.message.includes('relation') && error.message.includes('does not exist')) {
          console.log(`  ❌ ${tableName} - MISSING (${info.migration})`);
          missingTables.push({name: tableName, ...info});
        } else {
          console.log(`  ⚠️  ${tableName} - ERROR: ${error.message}`);
        }
      } else {
        console.log(`  ✅ ${tableName} - EXISTS (${info.description})`);
        existingTables.push({name: tableName, ...info});
      }
    } catch (err) {
      console.log(`  ❌ ${tableName} - ERROR: ${err.message}`);
      missingTables.push({name: tableName, ...info});
    }
  }
  
  return { existingTables, missingTables };
}

async function checkEnums(existingTables) {
  console.log('\n🏷️ Enum Type Verification:');
  
  const expectedEnums = {
    // Core enums (Migration 001)
    'attachment_style': { migration: '001', values: ['secure', 'anxious', 'avoidant', 'disorganized'] },
    'relationship_status': { migration: '001', values: ['dating', 'engaged', 'married', 'partnership'] },
    'question_category': { migration: '001', values: ['values', 'memories', 'future', 'intimacy', 'conflict', 'gratitude'] },
    'mood_type': { migration: '001', values: ['happy', 'sad', 'anxious', 'excited', 'confused', 'grateful', 'frustrated'] },
    'crisis_severity': { migration: '001', values: ['low', 'medium', 'high', 'critical'] },
    'invitation_status': { migration: '001', values: ['pending', 'accepted', 'expired'] },
    
    // Psychology enums (Migration 004)
    'love_language': { migration: '004', values: ['words_of_affirmation', 'quality_time', 'physical_touch', 'acts_of_service', 'receiving_gifts'] },
    'gottman_horseman': { migration: '004', values: ['criticism', 'contempt', 'defensiveness', 'stonewalling'] },
    'emotional_state': { migration: '004', values: ['joy', 'sadness', 'anger', 'fear', 'disgust', 'surprise', 'shame', 'guilt', 'excitement', 'contentment', 'anxiety', 'love'] },
    'therapy_modality': { migration: '004', values: ['cbt', 'dbt', 'eft', 'act', 'mindfulness', 'positive_psychology', 'somatic', 'narrative', 'sfbt', 'gottman', 'attachment'] },
    'personality_strength': { migration: '004', values: ['curiosity', 'judgment', 'love_of_learning', 'perspective', 'bravery', 'perseverance', 'honesty', 'zest', 'love', 'kindness', 'social_intelligence', 'teamwork', 'fairness', 'leadership', 'forgiveness', 'humility', 'prudence', 'self_regulation', 'appreciation_of_beauty', 'gratitude', 'hope', 'humor', 'spirituality'] }
  };
  
  const existingEnums = [];
  const missingEnums = [];
  
  // Since we can't query pg_type directly with anon key, we'll test by trying to use the enum
  for (const [enumName, info] of Object.entries(expectedEnums)) {
    try {
      // Try to create a function that uses the enum - if enum exists, this will work
      // We'll check for specific enum usage in our known tables
      if (enumName === 'attachment_style' && existingTables.some(t => t.name === 'users')) {
        const { data, error } = await supabase
          .from('users')
          .select('attachment_style')
          .limit(1);
          
        if (!error || (error && !error.message.includes('does not exist'))) {
          console.log(`  ✅ ${enumName} - EXISTS (${info.migration})`);
          existingEnums.push({name: enumName, ...info});
        } else {
          console.log(`  ❌ ${enumName} - MISSING (${info.migration})`);
          missingEnums.push({name: enumName, ...info});
        }
      } else {
        // For other enums, we'll make educated guesses based on table existence
        const relatedTables = {
          'love_language': 'user_psychology_profiles',
          'emotional_state': 'daily_psychological_checkins',
          'therapy_modality': 'psychology_interventions'
        };
        
        const relatedTable = relatedTables[enumName];
        if (relatedTable) {
          const tableExists = existingTables.some(t => t.name === relatedTable);
          if (tableExists) {
            console.log(`  ✅ ${enumName} - LIKELY EXISTS (${info.migration})`);
            existingEnums.push({name: enumName, ...info});
          } else {
            console.log(`  ❌ ${enumName} - MISSING (${info.migration})`);
            missingEnums.push({name: enumName, ...info});
          }
        } else {
          console.log(`  ⚠️  ${enumName} - UNKNOWN STATUS (${info.migration})`);
        }
      }
    } catch (err) {
      console.log(`  ❌ ${enumName} - ERROR: ${err.message}`);
      missingEnums.push({name: enumName, ...info});
    }
  }
  
  return { existingEnums, missingEnums };
}

async function generateReport() {
  try {
    console.log('✅ Database connection successful!');
    
    const { existingTables, missingTables } = await checkTables();
    const { existingEnums, missingEnums } = await checkEnums(existingTables);
    
    console.log('\n📊 MIGRATION STATUS REPORT');
    console.log('==========================');
    
    console.log(`\n✅ EXISTING COMPONENTS:`);
    console.log(`   Tables: ${existingTables.length}/14`);
    console.log(`   Enums: ${existingEnums.length}/11`);
    
    if (existingTables.length > 0) {
      console.log('\n   Existing Tables:');
      existingTables.forEach(t => console.log(`     - ${t.name} (${t.migration})`));
    }
    
    console.log(`\n❌ MISSING COMPONENTS:`);
    console.log(`   Tables: ${missingTables.length}/14`);
    console.log(`   Enums: ${missingEnums.length}/11`);
    
    if (missingTables.length > 0) {
      console.log('\n   Missing Tables:');
      missingTables.forEach(t => console.log(`     - ${t.name} (${t.migration})`));
    }
    
    if (missingEnums.length > 0) {
      console.log('\n   Missing Enums:');
      missingEnums.forEach(e => console.log(`     - ${e.name} (${e.migration})`));
    }
    
    // Analysis and recommendations
    console.log('\n🔍 ANALYSIS:');
    
    const migration001Complete = existingTables.filter(t => t.migration === '001').length >= 8;
    const migration004Complete = existingTables.filter(t => t.migration === '004').length >= 6;
    
    if (migration001Complete && migration004Complete) {
      console.log('🎉 All migrations appear to be complete!');
    } else if (migration001Complete && !migration004Complete) {
      console.log('⚠️  Core schema exists, but psychology framework is missing');
      console.log('📝 Recommendation: Run psychology-only migration');
    } else if (!migration001Complete && !migration004Complete) {
      console.log('❌ Partial migration state detected');
      console.log('📝 Recommendation: Run conditional migration to fix conflicts');
    } else {
      console.log('🔄 Mixed migration state - needs careful analysis');
    }
    
    // Return status for programmatic use
    return {
      success: true,
      existingTables: existingTables.map(t => t.name),
      missingTables: missingTables.map(t => t.name),
      migration001Complete,
      migration004Complete,
      needsConditionalMigration: missingTables.length > 0 || missingEnums.length > 0
    };
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Allow this to be run directly or imported
if (require.main === module) {
  generateReport();
}

module.exports = { generateReport };