export interface EducationItem {
  id: string;
  title: string;
  content: string;
}

export interface EducationSection {
  id: string;
  title: string;
  intro: string;
  items: EducationItem[];
}

export const educationData: EducationSection[] = [
  {
    id: 'tb',
    title: 'TB Awareness',
    intro: 'Tuberculosis is a serious but curable disease. Early detection saves lives.',
    items: [
      { id: 'tb-1', title: 'Symptoms to watch', content: 'Cough lasting more than 2 weeks, fever especially in the evening, night sweats, weight loss, and blood in sputum.' },
      { id: 'tb-2', title: 'Prevention', content: 'Cover mouth when coughing, ensure good ventilation in the house, let sunlight in, and maintain a healthy diet.' },
      { id: 'tb-3', title: 'When to refer', content: 'Refer to the primary health center immediately if someone has a continuous cough for over 14 days.' },
    ]
  },
  {
    id: 'vaccine',
    title: 'Child Vaccination',
    intro: 'Immunization protects children from deadly diseases. Follow the schedule strictly.',
    items: [
      { id: 'v-1', title: 'At Birth', content: 'BCG (for TB), OPV 0 (Polio drops), Hepatitis B birth dose.' },
      { id: 'v-2', title: '6, 10, and 14 weeks', content: 'OPV 1, 2, 3 (Polio drops) and Pentavalent 1, 2, 3 (protects against Diphtheria, Pertussis, Tetanus, Hepatitis B, and Hib).' },
      { id: 'v-3', title: '9-12 Months', content: 'Measles-Rubella (MR) 1st dose, Japanese Encephalitis (where applicable).' }
    ]
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy Care',
    intro: 'Proper care during pregnancy ensures a healthy mother and baby.',
    items: [
      { id: 'p-1', title: 'Monthly Checkups', content: 'Ensure at least 4 antenatal check-ups. Register early, track weight, BP, and take Iron-Folic Acid tablets.' },
      { id: 'p-2', title: 'Danger Signs', content: 'Severe headache, blurred vision, swelling of hands/face, bleeding, or reduced fetal movement mean immediate referral is needed.' },
      { id: 'p-3', title: 'Birth Preparedness', content: 'Identify a safe facility for delivery, arrange transport in advance, and keep emergency funds ready.' }
    ]
  },
  {
    id: 'nutrition',
    title: 'Nutrition Guide',
    intro: 'Good food is the foundation of good health for mothers and growing children.',
    items: [
      { id: 'n-1', title: 'Food Groups', content: 'Include energy foods (rice, wheat), body-building foods (dals, pulses, milk, eggs), and protective foods (green leafy vegetables, seasonal fruits).' },
      { id: 'n-2', title: 'Iron Rich Foods', content: 'To prevent anemia, eat spinach (palak), jaggery (gud), dates, and drumstick leaves.' },
      { id: 'n-3', title: 'Complementary Feeding', content: 'After 6 months, breastmilk is not enough. Start mashed dal, soft rice, and mashed fruits slowly while continuing breastfeeding.' }
    ]
  }
];
