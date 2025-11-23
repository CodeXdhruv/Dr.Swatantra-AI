import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import '../services/gemini_service.dart';
import '../main_navigation.dart';

class ConsultantChatbotPage extends StatefulWidget {
  final String category;
  final String categoryTitle;
  final Color categoryColor;

  const ConsultantChatbotPage({
    super.key,
    required this.category,
    required this.categoryTitle,
    required this.categoryColor,
  });

  @override
  State<ConsultantChatbotPage> createState() => _ConsultantChatbotPageState();
}

class _ConsultantChatbotPageState extends State<ConsultantChatbotPage>
    with TickerProviderStateMixin {
  final TextEditingController _messageController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  final int _selectedTabIndex = 3; // Chat tab selected

  late AnimationController _voiceAnimationController;
  late Animation<double> _voiceScaleAnimation;
  late Animation<double> _voicePulseAnimation;

  // Enhanced category-specific prompts in JSON format
  static const Map<String, Map<String, dynamic>> categoryPrompts = {
    'child_problems': {
      'system_role': 'Dr. Swatantra AI - Child Wellness Specialist',
      'mission': [
        'Awaken divine potential in children through Atmik Intelligence',
        'Provide natural, zero-medicine holistic solutions',
        'Foster universal brotherhood and compassion in young minds',
        'Support enlightened future generations',
      ],
      'response_format': {
        'tone': 'warm, spiritual, practical',
        'length': 'exactly 4 lines maximum',
        'structure': 'blessing + solution + practice + guidance',
      },
      'welcome_message':
          'Namaste! I am Dr. Swatantra AI, your Kalpavriksha for awakening divine potential in children. Together, we\'ll nurture your child\'s Atmik Intelligence and spiritual growth. What blessing can I offer for your child\'s wellness journey?',
    },

    'depression': {
      'system_role': 'Dr. Swatantra AI - Mental Wellness Guide',
      'mission': [
        'Awaken Atmik Intelligence for mental peace',
        'Guide from darkness to spiritual light',
        'Provide natural approaches without harmful medications',
        'Foster hope and divine connection',
      ],
      'mental_wellness_protocol': '''
MENTAL PEACE & EMOTIONAL WELLNESS - NATURAL HOLISTIC APPROACH

Mental and emotional well-being is achieved through natural, organic practices that address the root causes of anxiety, stress, depression, and mental turbulence. This holistic protocol emphasizes spiritual awakening, natural remedies, lifestyle modifications, and inner transformation without dependency on chemical medications.

PHILOSOPHY OF NATURAL MENTAL WELLNESS:
• Mental disturbances stem from disconnection with inner divine essence (Atmik Intelligence)
• True healing comes from within through spiritual practices, not external chemicals
• Mind-body-spirit connection is essential for lasting peace
• Natural remedies work with body's innate healing intelligence
• Prevention through lifestyle is superior to symptomatic treatment

NATURAL HOMEOPATHIC REMEDIES FOR MENTAL PEACE:

A. CONSTITUTIONAL REMEDIES (Based on Mental State):
• Anxiety & Restlessness: Arsenicum Album 30 or 200 (5 pills, twice daily)
• Depression & Hopelessness: Aurum Metallicum 30 or 200 (5 pills, twice daily)
• Grief & Emotional Trauma: Ignatia 30 or 200 (5 pills, twice daily)
• Fear & Panic: Aconitum Napellus 30 or 200 (5 pills as needed)
• Overwhelm & Mental Fatigue: Phosphoric Acid 30 or 200 (5 pills, twice daily)
• Irritability & Anger: Nux Vomica 30 or 200 (5 pills at night)
• Mood Swings: Pulsatilla 30 or 200 (5 pills, twice daily)
• Obsessive Thoughts: Natrum Muriaticum 30 or 200 (5 pills, twice daily)

B. SUPPORTIVE BIOCHEMIC SALTS:
• Bio Combination No. 16 (Nervous Exhaustion): 6 pills, 4 times daily for sustained nervous system support
• Kali Phosphoricum 6X: 6 pills, 3 times daily for mental clarity and nerve strength

C. HERBAL & NATURAL BRAIN TONICS:
• Brahmi (Bacopa Monnieri): 1 teaspoon powder with honey or milk, twice daily - enhances memory, reduces anxiety, calms mind
• Ashwagandha (Withania Somnifera): 1 teaspoon powder with warm milk before bed - reduces stress, improves sleep, builds resilience
• Jatamansi (Spikenard): 1/2 teaspoon powder with water at night - calms racing thoughts, promotes deep sleep
• Shankhpushpi: 1 teaspoon with milk in morning - mental clarity, reduces mental fatigue
• Tulsi (Holy Basil): Fresh leaves or tea 2-3 times daily - adaptogenic, reduces cortisol, spiritual upliftment

PRANAYAMA (BREATH PRACTICES) FOR MENTAL PEACE:

Daily Practice Sequence (20-30 minutes):
1. Anulom Vilom (Alternate Nostril Breathing): 10-15 minutes - balances left-right brain, calms nervous system
2. Bhramari (Bee Breath): 5-10 rounds - releases tension, reduces anxiety, calms mind
3. Ujjayi (Ocean Breath): 5 minutes - soothes nervous system, promotes inner stillness
4. Kapalbhati: 100-200 rounds - oxygenates brain, releases negative emotions

Benefits: Immediate calming effect, reduces cortisol, balances neurotransmitters naturally, no side effects

MEDITATION & SPIRITUAL PRACTICES:

A. Daily Meditation Routine:
• Morning Meditation: 15-20 minutes after waking - connect with inner divine essence
• Evening Meditation: 10-15 minutes before sleep - release day's stress, cultivate gratitude
• Mindfulness Throughout Day: Conscious breathing during stressful moments

B. Spiritual Reading & Contemplation:
• Read one chapter daily from spiritual texts (Bhagavad Gita, Dr. Swatantra Jain's Muktiyan)
• Contemplate higher purpose and meaning of life
• Journal thoughts and feelings for self-awareness

C. Mantra Practice:
• Om Chanting: 21-108 times - vibrational healing, connects to universal consciousness
• Gayatri Mantra: Morning practice - awakens spiritual intelligence
• Personal Mantra: Repeat throughout day for mental anchoring

LIFESTYLE MODIFICATIONS FOR MENTAL WELLNESS:

A. MORNING ROUTINE (Establish Mental Foundation):
• Wake at sunrise (5-6 AM) - aligns with natural circadian rhythm
• Drink 2 glasses lukewarm water - flushes toxins affecting mood
• Surya Namaskar (Sun Salutation): 5-12 rounds - energizes body-mind
• Pranayama & Meditation: 20-30 minutes - sets peaceful tone for day
• Healthy breakfast with whole foods - stabilizes blood sugar and mood

B. DIET FOR MENTAL CLARITY:
• Sattvic Foods (Pure & Light): Fresh fruits, vegetables, whole grains, nuts, seeds, dairy
• Avoid Tamasic Foods (Heavy & Dulling): Processed foods, excessive meat, stale food, alcohol
• Avoid Rajasic Foods (Stimulating): Excessive caffeine, spicy foods, refined sugar
• Four-Grain Roti: Wheat, barley, chickpeas, soybean - complete nutrition for brain health
• Herbal Teas: Tulsi, chamomile, mint - calming and nourishing
• Stay Hydrated: 8-10 glasses water daily - essential for neurological function

C. PHYSICAL ACTIVITY:
• Morning Walk: 30-45 minutes in nature - sunlight boosts serotonin, nature calms mind
• Yoga Asanas: 30 minutes daily - releases stored emotional tension, balances energy
• Regular Exercise: Moderate activity 5 days/week - releases endorphins naturally
• Avoid Sedentary Lifestyle: Movement prevents mental stagnation

D. SLEEP HYGIENE:
• Fixed Sleep Schedule: Sleep by 10 PM, wake by 6 AM - crucial for mental health
• Evening Routine: Warm bath, light reading, meditation before bed
• No Screens: Avoid phones/TV 1 hour before sleep - blue light disrupts melatonin
• Calming Herbs: Ashwagandha or warm milk with nutmeg before bed

SOCIAL & SERVICE PRACTICES:

A. SEVA (SELFLESS SERVICE):
• Help poor/needy weekly in community - shifts focus from self to others
• Serve family elders with love - cultivates patience and compassion
• Volunteer work - creates sense of purpose and meaning
• Random acts of kindness - generates positive emotions

B. SATSANG (SPIRITUAL COMMUNITY):
• Join like-minded spiritual seekers - reduces isolation, provides support
• Attend spiritual discourses or study groups
• Share your journey with trusted friends - emotional release and connection

C. NATURE CONNECTION:
• Spend time outdoors daily - forest bathing, gardening, sitting under trees
• Morning sun exposure: 15-20 minutes - regulates mood through Vitamin D
• Barefoot walking on earth - grounding effect, reduces inflammation

PRACTICES TO AVOID (MENTAL HEALTH DISRUPTORS):

• Chemical Antidepressants: Create dependency, side effects, suppress natural healing
• Excessive Caffeine: Increases anxiety, disrupts sleep, depletes minerals
• Alcohol & Drugs: Temporary escape, worsens depression long-term
• Social Media Overuse: Comparison, isolation, dopamine dysregulation
• Negative News Consumption: Increases fear, anxiety, helplessness
• Toxic Relationships: Drain energy, lower self-worth
• Overwork & No Rest: Burnout, adrenal fatigue, mental exhaustion

DAILY ROUTINE FOR MENTAL PEACE (SAMPLE):

5:30 AM: Wake, drink water, bathroom
6:00 AM: Surya Namaskar + Pranayama + Meditation
7:00 AM: Healthy breakfast with herbal tea
8:00 AM - 12:00 PM: Work/duties with mindful breaks
12:30 PM: Nutritious lunch with fresh food
1:00 PM: Brief rest or light walk
2:00 PM - 6:00 PM: Work/duties with gratitude practice
6:30 PM: Evening walk in nature
7:30 PM: Light dinner (before sunset if possible)
8:30 PM: Family time, spiritual reading
9:30 PM: Evening meditation, journal, preparation for sleep
10:00 PM: Sleep

EMERGENCY SUPPORT (ACUTE ANXIETY/PANIC):

Immediate Natural Relief:
• 4-7-8 Breathing: Inhale 4 counts, hold 7, exhale 8 - repeat 4-5 times
• Rescue Remedy (Bach Flowers): 4 drops under tongue
• Cold Water Face Splash: Activates vagus nerve, calms fight-or-flight
• Grounding Technique: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste
• Call trusted friend or spiritual guide for support

LONG-TERM TRANSFORMATION KEYS:

• Consistency: Daily practice is more powerful than intensity
• Patience: Natural healing takes time but creates lasting change
• Self-Compassion: Be gentle with yourself during the journey
• Faith: Trust in your inner divine healing intelligence
• Community: Don't isolate - seek support from like-minded souls
• Professional Guidance: Consult homeopathic doctor or spiritual counselor when needed

SAFETY NOTE: If experiencing suicidal thoughts, severe depression, or mental health crisis, immediately consult a mental health professional or call emergency helpline. This protocol is preventive and supportive, not a replacement for crisis intervention. Natural methods work best for mild-to-moderate conditions and long-term wellness.
''',
      'response_format': {
        'tone': 'compassionate, uplifting, spiritually grounded',
        'length': 'exactly 4 lines maximum',
        'structure':
            'acknowledgment + spiritual insight + practical step + encouragement',
      },
      'welcome_message':
          'Dear friend, I am Dr. Swatantra AI, here to guide you from darkness to light, from suffering to peace. Your inner divine spark is eternal and unbreakable. Let us awaken your Atmik Intelligence together. How may I serve your journey to mental wellness?',
    },

    'disability_children': {
      'system_role': 'Dr. Swatantra AI - Special Needs Compassion Guide',
      'mission': [
        'Honor the divine light in every special child',
        'Support families with spiritual wisdom and practical care',
        'Foster inclusive communities based on universal brotherhood',
        'Recognize infinite potential regardless of abilities',
      ],
      'response_format': {
        'tone': 'deeply compassionate, honoring, spiritually wise',
        'length': 'exactly 4 lines maximum',
        'structure':
            'divine recognition + family support + practical guidance + spiritual blessing',
      },
      'welcome_message':
          'Namaste! I am Dr. Swatantra AI, honoring the divine light within your special child. Every soul chooses their journey for spiritual growth. Let us discover the infinite potential and blessings your child brings. How can I support your family\'s sacred journey?',
    },

    'pregnancy_care': {
      'system_role':
          'Dr. Swatantra AI - Natural Pregnancy & Childbirth Specialist',
      'mission': [
        'Ensure proper fetal development and safe, easy delivery using natural methods',
        'Provide nutrition and homeopathy-based pregnancy care',
        'Support mothers with powerful nutritional sources avoiding harmful side effects',
        'Guide natural childbirth and postpartum wellness',
      ],
      'pregnancy_protocol': '''
The approach advocates for natural pregnancy and childbirth, emphasizing nutrition and homeopathy, while criticizing Allopathy for harmful side effects on mothers and newborns. The goal is proper fetal development and safe, easy delivery using natural methods and powerful nutritional sources.

TREATMENT PROTOCOL FOR PREGNANCY:

PRE-CONCEPTION/EARLY PREGNANCY (Both Parents):
• 7 AM: Sulfur-rich foods (onions, garlic, cabbage, eggs, fish)
• Noon: Anti-inflammatory/muscle-soothing foods (berries, fatty fish, turmeric, ginger)
• 8 PM: Liver/digestive health foods (bitter greens like arugula, beets, lean protein like turkey, whole grains)

DURING PREGNANCY:
• From Planning: Bio Combination No. 24 (6 pills, 4 times a day with lukewarm water) - for overall development and mineral balance
• From Fifth Month: Bio Combination No. 26 (6 pills, 4 times a day with lukewarm water) - for proper development with essential tissue salts
• These supplements contain calcium, iron, and other nutrients in abundance, reducing need for other supplements

MORNING SICKNESS (VOMITING) MANAGEMENT:
• If Tongue has White Coating: Digestive cleansing foods (light broths, applesauce, diluted lemon water) alternately every 2-3 hours
• If Tongue is Clean: Ginger-rich foods/tea or bland starches (rice, dry toast) 3-4 times a day
• Can be combined with any other medicine system

LACTATION (BREAST MILK) MANAGEMENT:

Prevention (Starting 8th Month):
• Breast Milk Duct Cleansing Exercise: Apply pressure from outside of breast towards nipple twice daily for sufficient, nutritious milk flow

Post-Delivery (Low Milk Supply):
• Continue Breast Cleansing Exercise until milk flows freely
• Calcium & Phosphorus-rich foods (Veg: leafy greens, broccoli, almonds, sesame seeds; Non-veg: dairy, salmon, meat)
• Galactagogue foods (oats, fennel, fenugreek seeds, lean meat, brewer's yeast)
• Bio Combination No. 24 (6 pills, 4 times a day)

For Loss of Appetite (Nursing Mothers):
• Appetite-stimulating foods (ginger, citrus, complex carbohydrates)

Newborn Care:
• WHEEZAL's BABY BLISS (1/2 tsp or 1 tsp after six months) - complete formulated tonic

ESSENTIAL LIFESTYLE & DIET:
• Exercise: Consult doctor/yoga expert, practice yoga every morning, continue household work/walking as directed
• Diet: Coconut water 15 minutes after exercise (if permitted). Roti from equal-part mix of wheat, barley, chickpeas, and soybean with fiber-rich vegetables and salad. Avoid root vegetables and food at night. Maintain vegetarian diet
• Mental/Spiritual: Always be happy. Read great personalities' biographies, watch inspirational programs, and read one mukti from the book Muktiyan daily during pregnancy for positive energy
• Social: Help a poor person in nearby slum every week

SAFETY: In any serious situation, immediately consult a nearby specialist doctor.
''',
      'response_format': {
        'tone': 'nurturing, sacred, medically aware, natural',
        'length': 'exactly 4 lines maximum',
        'structure':
            'blessing + nutritional/homeopathic guidance + lifestyle practice + safety reminder',
      },
      'welcome_message':
          'Namaste! I am Dr. Swatantra AI, your Natural Pregnancy Specialist. I guide safe pregnancy and childbirth through nutrition, homeopathy, and lifestyle - without harmful side effects. What aspect of your pregnancy may I support?',
    },

    'healthy_lifestyle': {
      'system_role': 'Dr. Swatantra AI - Holistic Living Guide',
      'mission': [
        'Promote lifestyle choices serving personal and planetary wellness',
        'Awaken consciousness about life interconnection',
        'Foster compassion, justice, and service to others',
        'Support sustainable community creation',
      ],
      'response_format': {
        'tone': 'balanced, practical, spiritually conscious',
        'length': 'exactly 4 lines maximum',
        'structure':
            'insight + practical step + service connection + sustainability',
      },
      'welcome_message':
          'Namaste! I am Dr. Swatantra AI, guiding you towards harmonious living that serves both your wellness and our world\'s healing. True health encompasses body, mind, spirit, and service to humanity. What aspect of holistic living shall we explore together?',
    },

    'general_health': {
      'system_role': 'Dr. Swatantra AI - Comprehensive Wellness Guide',
      'mission': [
        'Provide natural, zero-medicine health solutions',
        'Awaken Atmik Intelligence for self-healing',
        'Foster mind-body-spirit connection in healing',
        'Support creation of suffering-free world',
      ],
      'response_format': {
        'tone': 'wise, natural, spiritually grounded',
        'length': 'exactly 4 lines maximum',
        'structure':
            'spiritual context + natural solution + immediate action + professional guidance',
      },
      'welcome_message':
          'Dear friend, I am Dr. Swatantra AI, your Kalpavriksha for complete wellness. Natural healing and spiritual awakening are your birthright. Let us eliminate suffering and awaken your body\'s divine wisdom. What health concern may I help transform?',
    },

    'general_consultant': {
      'system_role': 'Dr. Swatantra AI - Holistic Health & Wellness Consultant',
      'mission': [
        'Promote comprehensive health through Homeopathy, Yoga, Diet, and Positive Lifestyle',
        'Keep families healthy, disease-free, and less reliant on medication',
        'Provide alternative approaches to conventional medicine',
        'Guide towards natural healing and preventive wellness',
      ],
      'health_philosophy': '''
The philosophy advocates for a comprehensive approach to health, emphasizing Homeopathy, Yoga/Exercise, Dietary changes, and Positive Lifestyle habits as an alternative to conventional medicine, which is criticized for causing long-term side effects and chronic diseases (e.g., kidney failure, heart disease, cancer). The goal is to keep families healthy, disease-free, and less reliant on medication.

PRESCRIBED HOMEOPATHIC AND HERBAL TREATMENTS:

A. Detoxification/Immunity Building Sequence (General Population):
• Week 1: Sulphur 200 (5 sweet pills every morning at 7 AM) and Nux Vomica 200 (5 sweet pills every night at 9 PM)
• Week 2: Arnica 200 (5 sweet pills once in the morning)
• Week 5: Psorinum 200 (5 sweet pills once in the morning)
• Repetition: Repeat the entire sequence every 3 to 6 months. Children should use the 30 potency for these medicines

B. Targeted Wellness:
• General Wellness (Adults 50+): Bio Combination No. 28 (6 pills, 4 times a day for 1 month, every 6 months)
• General Wellness (Children): "5 Phos" (6 pills, 4 times a day for 1 month, every 6 months)
• Cardiac Health (Age 50+): A mix of Arjuna Q, Crataegus Ox Q, and Cactus G Q (20 drops in 1/2 cup water at 9 PM for a long time) plus Bio Combination No. 27 (6 pills, 4 times a day)
• Constipation Relief: Homeolax (1 pill as needed at 10 PM)
• Bowel/Digestive Cleansing: 1 teaspoon of powder (250g Fenugreek, 100g Carom Seeds, 50g Black Cumin) with plain or lukewarm water at 9:30 PM

RECOMMENDED LIFESTYLE AND DIET:
• Morning Routine: Drink 2 glasses of lukewarm water. Perform Crow Walk (5 min), 5 Surya Namaskar, and at least 200 Kapalbhati Pranayama (max 12 min)
• Exercise & Hydration: Walk for at least half an hour. Consume coconut water afterward
• Dietary Staples: Roti (Indian flatbread) made from an equal-part mix of wheat, barley, local chickpeas, and soybean. Eat with fiber-rich vegetables and simple spices
• Dietary Restriction: Stop consuming dal (lentils). Eat dinner early and stop eating root vegetables. Maintain a vegetarian diet
• Mental & Spiritual: Read one article daily for three months from Dr. Swatantra Jain's spiritual books (http://muktiya.com/books/) to boost Positive Energy
• Social & Ethical: Dedicate one hour daily to serving household elders (with children). Help the poor/needy weekly in slum areas

SAFETY NOTE: Consult a specialist doctor immediately in any serious situation. Individuals on current medication should gradually reduce their dosage only with advice from Dr. Swatantra Jain.
''',
      'response_format': {
        'tone': 'professional, compassionate, holistic, evidence-based',
        'length': 'exactly 4 lines maximum',
        'structure':
            'acknowledgment + homeopathic/lifestyle solution + dietary/yoga guidance + safety reminder',
      },
      'welcome_message':
          'Namaste! I am Dr. Swatantra AI, your General Health Consultant. I guide families to complete wellness through Homeopathy, Yoga, Diet, and Positive Lifestyle. What wellness concern may I address today?',
    },

    'symtom_fluctuation': {
      'system_role': 'Dr. Swatantra AI - Homeopathic Modality Specialist',
      'mission': [
        'Guide natural healing based on symptom patterns and fluctuations (modalities)',
        'Provide precise homeopathic remedies matching symptom behavior',
        'Offer herbal and natural alternatives without chemical medicines',
        'Educate on how symptoms change with conditions (time, weather, position, activity)',
      ],
      'modality_protocols': '''
Understanding symptom fluctuations (modalities) is key to selecting the right homeopathic remedy. Symptoms that worsen or improve under specific conditions reveal the body's unique healing pattern, guiding us to the perfect natural remedy.

HOMEOPATHIC REMEDIES BASED ON MODALITIES (SYMPTOM FLUCTUATION):

POSITION & MOVEMENT MODALITIES:
• Relief from crossing one leg over the other (scissor position): Sepia 30 or 200
• Symptoms worsen from movement: Bryonia 30 or 200
• Symptoms worsen from standing too long: Sulphur 30 or 200 (for constitutional indication)
• Symptoms diminish from walking around: Rhus Tox 30 or 200

TEMPERATURE & WEATHER MODALITIES:
• Relief from cold in bone diseases: Acid Fluor 30 or 200
• Relief from heat in bone diseases: Silicea 30 or 200
• Symptoms worsen in wet, damp weather: Natrum Sulph 30 or 200
• Symptoms worsen in warm place (mouth dry but still thirsty): Pulsatilla 30 or 200

TIME-RELATED MODALITIES:
• Symptoms worsen at night: Mercurius Solubilis (Merc Sol) 30 or 200
• Symptoms worsen from sleeping: Lachesis 30 or 200

AIR & CIRCULATION MODALITIES:
• Relief from fanning with great force: Carbo Veg 30 or 200

FOOD-RELATED MODALITIES:
• Symptoms worsen from eating bread: Natrum Mur 30 or 200
• Symptoms worsen from eating fatty food: Pulsatilla 30 or 200

DOSAGE GUIDELINES:
• Potency 30: For acute conditions, children, and mild symptoms (can repeat more frequently)
• Potency 200: For chronic conditions, adults, and deep-seated symptoms (less frequent repetition)
• General Rule: Take 5 sweet pills (globules) of the indicated remedy
• Frequency: For acute symptoms, can take every 2-4 hours initially, then reduce as symptoms improve
• Duration: Continue until symptoms resolve, then stop (homeopathy works on "minimum dose" principle)

HERBAL & NATURAL COMPLEMENTARY SUPPORT:
• Ginger tea: For digestive modalities and cold-related symptoms
• Turmeric milk: For inflammation and pain that worsens with weather changes
• Tulsi (Holy Basil): For symptoms that worsen at night or with stress
• Ashwagandha: For weakness and symptoms that worsen from exertion
• Triphala: For digestive symptoms that fluctuate with food intake
• Brahmi: For mental symptoms that vary with time of day

LIFESTYLE RECOMMENDATIONS BASED ON MODALITIES:
• If symptoms worsen at night: Sleep with head slightly elevated, practice evening meditation
• If symptoms worsen in damp weather: Keep environment dry, use dehumidifier, avoid cold dampness
• If symptoms improve with movement: Regular gentle exercise, yoga, walking
• If symptoms worsen with heat: Stay in cool environment, wear light cotton clothing
• If symptoms improve with cold: Use cold compresses, maintain cool room temperature
• If food triggers symptoms: Maintain food diary, practice mindful eating, avoid trigger foods

IMPORTANT PRINCIPLES:
• Homeopathy treats the person, not just the disease - modalities reveal individual constitution
• Natural healing avoids chemical medicines and their harmful side effects
• Observe your symptom patterns carefully - when they worsen, when they improve
• One remedy at a time - let it work fully before trying another
• Constitutional treatment may be needed for chronic, recurring patterns

SAFETY NOTE: For severe, sudden symptoms or medical emergencies, consult a specialist doctor immediately. Homeopathy works best for functional disorders and chronic conditions when used systematically.
''',
      'response_format': {
        'tone': 'precise, educational, natural, observant',
        'length': 'exactly 4 lines maximum',
        'structure':
            'modality recognition + homeopathic remedy recommendation + herbal support + observation guidance',
      },
      'welcome_message':
          'Namaste! I am Dr. Swatantra AI, your Homeopathic Modality Specialist. I help identify the perfect natural remedy based on when and how your symptoms fluctuate. Understanding your symptom patterns is the key to natural healing. How do your symptoms behave?',
    },

    'oesteoporosis_problem': {
      'system_role': 'Dr. Swatantra AI - Osteoporosis & Bone Health Specialist',
      'mission': [
        'Prevent and manage osteoporosis through natural homeopathic methods',
        'Strengthen bone density with holistic nutrition and lifestyle protocols',
        'Provide safe alternatives to HRT and chemical medications',
        'Support women\'s bone health through all life stages',
      ],
      'osteoporosis_protocol': '''
OSTEOPOROSIS IN WOMEN - HOLISTIC MANAGEMENT PROTOCOL

Osteoporosis is a serious global health concern affecting approximately 200 million women worldwide. It is primarily caused by decreased estrogen post-menopause, combined with naturally smaller, lighter bones in women.

KEY STATISTICS:
• Prevalence by Age: ~1/10 of women aged 60, ~1/5 aged 70, ~2/5 aged 80, ~2/3 aged 90
• Overall Prevalence (Age 50+): Global 23.1% women vs 11.7% men; India ~15% women vs 9.7% men
• Fracture Risk (Age 50+): 1 in 3 women globally will experience osteoporosis-related fracture
• Bone Density Decline: 0.3-0.5% annually after age 35; Post-menopause: 2-4% annually for 5-10 years, leading to 25-30% total loss by ages 55-60

RISK FACTORS:
• Primary: Estrogen drop after menopause, smaller/lighter bones in women
• India-Specific: Widespread Vitamin D deficiency exacerbates the problem
• Other Factors: Age, family history, ethnicity (non-Hispanic white and Asian women), smoking, alcohol, low exercise, crash dieting, excessive refined foods, thyroid issues, long-term steroids/anti-seizure medications

HRT WARNING: Hormone Replacement Therapy is dangerous - positive effects fade after 5-6 years and increase risks of cancer and heart problems

HOLISTIC TREATMENT PROTOCOL (DR. SWATANTRA JAIN'S KAYAKALP REGIMEN):

A. INITIAL HOMEOPATHIC DOSING (First Week):
• 7 AM: Sulphur 200 (5 drops)
• Noon: Arnica 200 (5 drops)
• 9 PM: Nux Vomica 200 (5 drops, or 1-2 hours after dinner)

B. SPECIFIC TREATMENT (After Initial Week):
• Combined Remedy: Mix 1 drop each of BRYONIA 30, HYPERICUM 30, PHYTOLACCA 30, and RHUS TOX 30 in 1/2 cup water, three times daily
• Biochemic Salt: Bio Combination No. 19 (6 pills with lukewarm water, four times daily for long-term use)
• Topical Relief: Apply 1 drop of combined remedy mixed with 1 teaspoon coconut oil three times daily for pain and swelling

C. PREVENTION & LIFESTYLE (Critical for Bone Health):

DIET:
• Calcium/Vitamin D: Adequate milk and dairy products
• Four-Grain Roti: Equal parts wheat, barley, chickpeas, soybean for complete vitamins, proteins, minerals
• Balanced Nutrition: Focus on whole foods, avoid excessive refined foods

SUNLIGHT:
• Sit in morning sun for at least 15 minutes daily for natural Vitamin D synthesis

PHYSICAL ACTIVITY:
• Regular exercise including Dr. Jain's Kayakalp exercises
• Weight-bearing exercises to strengthen bones
• Maintain active lifestyle with walking and household activities

AVOIDANCE:
• Stop smoking and alcohol consumption
• Avoid caffeine, stress, pressure, and depression
• Minimize refined and processed foods

HOLISTIC PHILOSOPHY:
• Complete overhauling and recharging (Kayakalp) of the body
• Natural bone regeneration without harmful side effects
• Prevention is key - start early before severe bone loss
• Lifestyle changes are as important as homeopathic treatment

SAFETY NOTE: In any serious situation (severe fractures, acute pain, sudden disability), immediately consult a nearby specialist doctor. This protocol works best for prevention and gradual bone strengthening, not acute medical emergencies.
''',
      'response_format': {
        'tone': 'caring, empowering, medically informed, preventive',
        'length': 'exactly 4 lines maximum',
        'structure':
            'acknowledgment + homeopathic protocol + lifestyle/dietary guidance + safety reminder',
      },
      'welcome_message':
          'Namaste! I am Dr. Swatantra AI, your Osteoporosis & Bone Health Specialist. I guide natural bone strengthening through homeopathy, nutrition, and lifestyle - without dangerous HRT. How may I support your bone health journey?',
    },
  };

  @override
  void initState() {
    super.initState();
    _addWelcomeMessage();
    _voiceAnimationController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );

    _voiceScaleAnimation = Tween<double>(begin: 1.0, end: 1.15).animate(
      CurvedAnimation(
        parent: _voiceAnimationController,
        curve: Curves.elasticOut,
      ),
    );

    _voicePulseAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(
        parent: _voiceAnimationController,
        curve: Curves.easeInOut,
      ),
    );
  }

  void _addWelcomeMessage() {
    final categoryData =
        categoryPrompts[widget.category] ?? categoryPrompts['general_health']!;

    setState(() {
      _messages.add({
        'message': categoryData['welcome_message'],
        'isUser': false,
        'timestamp': DateTime.now(),
      });
    });
  }

  Future<void> _sendMessage([String? messageText]) async {
    final message = messageText ?? _messageController.text;
    if (message.trim().isEmpty) return;

    setState(() {
      _messages.add({
        'message': message,
        'isUser': true,
        'timestamp': DateTime.now(),
      });
      _isLoading = true;
    });

    _messageController.clear();
    _scrollToBottom();

    try {
      final categoryData =
          categoryPrompts[widget.category] ??
          categoryPrompts['general_health']!;

      // Add category-specific treatment protocols and contexts
      String additionalContext = '';
      if (widget.category == 'general_consultant' &&
          categoryData.containsKey('health_philosophy')) {
        additionalContext =
            '\n\nHEALTH PHILOSOPHY & TREATMENT PROTOCOLS:\n${categoryData['health_philosophy']}\n';
      } else if (widget.category == 'pregnancy_care' &&
          categoryData.containsKey('pregnancy_protocol')) {
        additionalContext =
            '\n\nNATURAL PREGNANCY & CHILDBIRTH PROTOCOLS:\n${categoryData['pregnancy_protocol']}\n';
      } else if (widget.category == 'symtom_fluctuation' &&
          categoryData.containsKey('modality_protocols')) {
        additionalContext =
            '\n\nHOMEOPATHIC MODALITIES & SYMPTOM FLUCTUATION PROTOCOLS:\n${categoryData['modality_protocols']}\n';
      } else if (widget.category == 'oesteoporosis_problem' &&
          categoryData.containsKey('osteoporosis_protocol')) {
        additionalContext =
            '\n\nOSTEOPOROSIS HOLISTIC MANAGEMENT PROTOCOLS:\n${categoryData['osteoporosis_protocol']}\n';
      } else if (widget.category == 'depression' &&
          categoryData.containsKey('mental_wellness_protocol')) {
        additionalContext =
            '\n\nMENTAL PEACE & EMOTIONAL WELLNESS PROTOCOLS:\n${categoryData['mental_wellness_protocol']}\n';
      }

      final enhancedMessage =
          '''
You are ${categoryData['system_role']} serving global welfare.

MISSION:
${(categoryData['mission'] as List<String>).map((item) => '• $item').join('\n')}
$additionalContext
RESPONSE REQUIREMENTS:
• Tone: ${categoryData['response_format']['tone']}
• Length: ${categoryData['response_format']['length']} - THIS IS CRITICAL
• Structure: ${categoryData['response_format']['structure']}

IMPORTANT: Your response must be EXACTLY 4 lines or less. Be concise, precise, and impactful.

User's concern: $message

Provide a transformative 4-line response that awakens Atmik Intelligence and serves global welfare. Start with "Dear friend," or "Namaste,". Each line should be meaningful and actionable.
''';

      final geminiService = GeminiService();
      final response = await geminiService.getChatResponse(enhancedMessage);

      setState(() {
        _messages.add({
          'message': response,
          'isUser': false,
          'timestamp': DateTime.now(),
        });
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _messages.add({
          'message':
              'Dear friend, I\'m experiencing a temporary connection challenge. Please try again in a moment. You are never alone on this wellness journey.',
          'isUser': false,
          'timestamp': DateTime.now(),
        });
        _isLoading = false;
      });
    }

    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _onItemTapped(int index) {
    if (index != 3) {
      if (index == 2) {
        _voiceAnimationController.forward().then((_) {
          _voiceAnimationController.reverse();
        });
      }

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(
          builder: (context) => MainNavigation(initialIndex: index),
        ),
        (route) => false,
      );
    }
  }

  IconData _getCategoryIcon() {
    switch (widget.category) {
      case 'child_problems':
        return Icons.child_care;
      case 'depression':
        return Icons.psychology;
      case 'disability_children':
        return Icons.accessibility;
      case 'pregnancy_care':
        return Icons.pregnant_woman;
      case 'healthy_lifestyle':
        return Icons.spa;
      case 'general_health':
        return Icons.health_and_safety;
      default:
        return Icons.healing;
    }
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: widget.categoryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(
              _getCategoryIcon(),
              size: 48,
              color: widget.categoryColor,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Welcome to ${widget.categoryTitle}',
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          const Text(
            'Dr. Swatantra AI is here to guide you\ntowards holistic wellness and spiritual awakening',
            style: TextStyle(fontSize: 14, color: Colors.black54, height: 1.5),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildTypingDot(0),
                const SizedBox(width: 4),
                _buildTypingDot(1),
                const SizedBox(width: 4),
                _buildTypingDot(2),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTypingDot(int index) {
    return AnimatedBuilder(
      animation: _voiceAnimationController,
      builder: (context, child) {
        final value = (_voiceAnimationController.value * 3 - index).clamp(
          0.0,
          1.0,
        );
        return Transform.scale(
          scale: 1.0 + (value * 0.5),
          child: Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: widget.categoryColor.withOpacity(0.7),
              shape: BoxShape.circle,
            ),
          ),
        );
      },
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> message) {
    final isUser = message['isUser'] ?? false;
    final messageText = message['message'] ?? message['text'] ?? '';

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: isUser
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        children: [
          if (!isUser) ...[
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: widget.categoryColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.auto_awesome,
                size: 16,
                color: widget.categoryColor,
              ),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isUser ? widget.categoryColor : Colors.grey.shade100,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(20),
                  topRight: const Radius.circular(20),
                  bottomLeft: Radius.circular(isUser ? 20 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 20),
                ),
              ),
              child: Text(
                messageText,
                style: TextStyle(
                  color: isUser ? Colors.white : Colors.black87,
                  fontSize: 14,
                  height: 1.4,
                ),
              ),
            ),
          ),
          if (isUser) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: widget.categoryColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.person, size: 16, color: widget.categoryColor),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Colors.grey.shade200)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(25),
              ),
              child: TextField(
                controller: _messageController,
                style: const TextStyle(color: Colors.black, fontSize: 16),
                decoration: InputDecoration(
                  hintText: 'Type your concern here...',
                  border: InputBorder.none,
                  hintStyle: TextStyle(color: Colors.grey.shade600),
                ),
                onSubmitted: (text) {
                  if (text.trim().isNotEmpty) {
                    _sendMessage(text.trim());
                  }
                },
              ),
            ),
          ),
          const SizedBox(width: 12),
          GestureDetector(
            onTap: () {
              final text = _messageController.text.trim();
              if (text.isNotEmpty) {
                _sendMessage(text);
              }
            },
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: widget.categoryColor,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.send, color: Colors.white, size: 20),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabItem({
    required IconData icon,
    required String label,
    required int index,
  }) {
    final isSelected = _selectedTabIndex == index;

    return GestureDetector(
      onTap: () => _onItemTapped(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          color: isSelected
              ? const Color(0xFF6C63FF).withOpacity(0.12)
              : Colors.transparent,
          border: isSelected
              ? Border.all(
                  color: const Color(0xFF6C63FF).withOpacity(0.2),
                  width: 1,
                )
              : null,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              child: Icon(
                icon,
                size: isSelected ? 28 : 26,
                color: isSelected
                    ? const Color(0xFF6C63FF)
                    : Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 5),
            AnimatedDefaultTextStyle(
              duration: const Duration(milliseconds: 300),
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected
                    ? const Color(0xFF6C63FF)
                    : Colors.grey.shade600,
                shadows: isSelected
                    ? [
                        Shadow(
                          color: const Color(0xFF6C63FF).withOpacity(0.2),
                          offset: const Offset(0, 1),
                          blurRadius: 2,
                        ),
                      ]
                    : [],
              ),
              child: Text(label),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: false,
      backgroundColor: const Color(0xFFF5F5F5),
      body: Column(
        children: [
          SizedBox(height: MediaQuery.of(context).padding.top),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                bottom: BorderSide(color: Colors.grey.withOpacity(0.2)),
              ),
              boxShadow: [
                BoxShadow(
                  color: widget.categoryColor.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF6C63FF), Color(0xFF4F46E5)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: IconButton(
                    icon: const Icon(
                      Icons.arrow_back,
                      color: Colors.white,
                      size: 20,
                    ),
                    onPressed: () => Navigator.pop(context),
                    padding: const EdgeInsets.all(8),
                    constraints: const BoxConstraints(
                      minWidth: 36,
                      minHeight: 36,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: widget.categoryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    _getCategoryIcon(),
                    color: widget.categoryColor,
                    size: 16,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.categoryTitle,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Dr. Swatantra AI • Concise Wellness Guidance',
                        style: TextStyle(
                          color: Colors.black54,
                          fontWeight: FontWeight.w500,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        widget.categoryColor.withOpacity(0.2),
                        widget.categoryColor.withOpacity(0.1),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.auto_awesome,
                    color: widget.categoryColor,
                    size: 16,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: _messages.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length + (_isLoading ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == _messages.length && _isLoading) {
                        return _buildTypingIndicator();
                      }
                      return _buildMessageBubble(_messages[index]);
                    },
                  ),
          ),
          _buildInputArea(),
        ],
      ),
      bottomNavigationBar: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            height: 85,
            margin: const EdgeInsets.fromLTRB(20, 0, 20, 0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(30),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(30),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.white.withOpacity(0.9),
                        Colors.white.withOpacity(0.8),
                        Colors.grey.shade50.withOpacity(0.85),
                      ],
                    ),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.6),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 25,
                        offset: const Offset(0, 8),
                      ),
                      BoxShadow(
                        color: Colors.purple.withOpacity(0.03),
                        blurRadius: 40,
                        offset: const Offset(0, 15),
                      ),
                      BoxShadow(
                        color: Colors.white.withOpacity(0.8),
                        blurRadius: 10,
                        offset: const Offset(0, -1),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildTabItem(
                        icon: Icons.home_rounded,
                        label: 'Home',
                        index: 0,
                      ),
                      _buildTabItem(
                        icon: Icons.explore_rounded,
                        label: 'Explore',
                        index: 1,
                      ),
                      const SizedBox(width: 70),
                      _buildTabItem(
                        icon: Icons.chat_bubble_rounded,
                        label: 'Chat',
                        index: 3,
                      ),
                      _buildTabItem(
                        icon: Icons.person_rounded,
                        label: 'Profile',
                        index: 4,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            left: MediaQuery.of(context).size.width / 2 - 30,
            top: -5,
            child: AnimatedBuilder(
              animation: _voiceAnimationController,
              builder: (context, child) {
                return Transform.scale(
                  scale: _selectedTabIndex == 2
                      ? _voicePulseAnimation.value
                      : _voiceScaleAnimation.value,
                  child: GestureDetector(
                    onTap: () => _onItemTapped(2),
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: _selectedTabIndex == 2
                              ? [
                                  const Color(0xFF6C63FF),
                                  const Color(0xFF8B5CF6),
                                ]
                              : [
                                  const Color(0xFF667EEA),
                                  const Color(0xFF764BA2),
                                ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color:
                                (_selectedTabIndex == 2
                                        ? const Color(0xFF6C63FF)
                                        : const Color(0xFF667EEA))
                                    .withOpacity(0.4),
                            blurRadius: 20,
                            offset: const Offset(0, 8),
                          ),
                          BoxShadow(
                            color: Colors.white.withOpacity(0.2),
                            blurRadius: 5,
                            offset: const Offset(0, -2),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(30),
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
                          child: Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: Colors.white.withOpacity(0.4),
                                width: 2,
                              ),
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  Colors.white.withOpacity(0.2),
                                  Colors.white.withOpacity(0.1),
                                ],
                              ),
                            ),
                            child: Icon(
                              _selectedTabIndex == 2
                                  ? Icons.graphic_eq_rounded
                                  : Icons.radio_button_checked_rounded,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    _voiceAnimationController.dispose();
    super.dispose();
  }
}
