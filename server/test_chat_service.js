import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { askAgronomicAssistant } from './src/services/geminiService.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

async function runChatTests() {
  console.log('================================================================');
  console.log('🌱 FARMSHIELD MULTILINGUAL CHATBOT & GEMINI INTEGRATION TESTS');
  console.log('================================================================\n');

  // Test 1: Fallback when API key is placeholder
  console.log('TEST 1: Fallback Detection on Key Placeholder');
  const res1 = await askAgronomicAssistant({
    message: 'What should I do for tomato early blight?',
    language: 'en'
  });
  assert(res1.source === 'local_fallback', 'Gracefully routed to local fallback when placeholder key is present');
  assert(res1.reply.includes('Alternaria solani') || res1.reply.includes('Blight'), 'Returned accurate agronomic blight advice');

  // Test 2: Multilingual Tamil Fallback
  console.log('\nTEST 2: Multilingual Support - Tamil (தமிழ்)');
  const res2 = await askAgronomicAssistant({
    message: 'களிமண் நிலத்திற்கு எந்த பயிர் ஏற்றது?',
    language: 'ta'
  });
  assert(res2.source === 'local_fallback', 'Tamil query routed properly');
  assert(res2.reply.includes('நெல்') || res2.reply.includes('கரும்பு'), 'Returned Tamil agronomic advice');

  // Test 3: Multilingual Hindi Fallback
  console.log('\nTEST 3: Multilingual Support - Hindi (हिन्दी)');
  const res3 = await askAgronomicAssistant({
    message: 'हवा में नमी 85% से ज्यादा है क्या करें?',
    language: 'hi'
  });
  assert(res3.reply.includes('नमी') || res3.reply.includes('झुलसा'), 'Returned Hindi agronomic advice');

  // Test 4: Multilingual Telugu Fallback
  console.log('\nTEST 4: Multilingual Support - Telugu (తెలుగు)');
  const res4 = await askAgronomicAssistant({
    message: 'యూరియా ఎప్పుడు వేయాలి?',
    language: 'te'
  });
  assert(res4.reply.includes('యూరియా') || res4.reply.includes('ఆకులు'), 'Returned Telugu agronomic advice');

  // Test 5: DIGIPIN Question
  console.log('\nTEST 5: DIGIPIN India Post Geographic Grounding');
  const res5 = await askAgronomicAssistant({
    message: 'What is DIGIPIN and how does FarmShield use it?',
    language: 'en'
  });
  assert(res5.reply.includes('DIGIPIN') && res5.reply.includes('India Post'), 'Explains India Post DIGIPIN');

  console.log('\n================================================================');
  console.log(`TEST RUN COMPLETE: ${passed} / ${total} CHECKS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('================================================================');

  if (passed !== total) process.exit(1);
  process.exit(0);
}

runChatTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
