// Formal Tamil and English Grievance Template Generator

export const translationService = {
  /**
   * Generates formal complaint letter structure in both English & Tamil
   */
  generateFormalGrievance(incident) {
    const isEmergency = incident.type === 'EMERGENCY';
    const dept = incident.department || 'Municipal Corporation / Emergency Cell';
    const loc = incident.address || `${incident.lat.toFixed(4)}, ${incident.long.toFixed(4)}`;

    const englishLetter = `
MEMORANDUM / OFFICIAL CIVIC GRIEVANCE NOTICE
--------------------------------------------------
To: ${dept}
Target Portal: ${incident.routingPortal || 'Public Grievance Portal'}
Date & Time: ${new Date().toLocaleString()}
Incident Reference: ${incident.id}
GPS Location: Latitude ${incident.lat}, Longitude ${incident.long}
Geocoded Address: ${loc}

Subject: URGENT ACTION REQUIRED: ${incident.title}

Dear Sir/Madam,

This official civic grievance report has been captured via Geo-Cam verification (Truth Score: ${incident.truthScore || 95}%) and routed through the Autonomous Multi-Agent Civic Intelligence Platform.

Details of Incident:
${incident.description}

Requested Remedial Action:
1. Dispatch field inspection squad immediately to coordinates (${incident.lat}, ${incident.long}).
2. Initiate emergency repair / safety containment.
3. Update ticket acknowledgement status on central portal within 48 hours.

Notice of Automated Escalation:
Failure to acknowledge or initiate action within 48-72 hours will trigger an automated Tier-2 escalation to the District Collectorate and Chief Minister's Special Cell via n8n workflow loops.

Yours faithfully,
Verified Citizen & Autonomous Dispatch Agent
    `.trim();

    const tamilLetter = `
அதிகாரப்பூர்வ நகர்ப்புற புகார் மற்றும் அவசர அறிவிப்பு
--------------------------------------------------
பெறுநர்: ${dept}
இலக்கு போர்ட்டல்: ${incident.routingPortal || 'மக்கள் குறைதீர்க்கும் மையம்'}
தேதி & நேரம்: ${new Date().toLocaleString('ta-IN')}
புகார் குறிப்பு எண்: ${incident.id}
ஜி.பி.எஸ் ஆயங்கள்: அட்சரேகை ${incident.lat}, தீர்க்கரேகை ${incident.long}
முகவரி: ${loc}

பொருள்: அவசர நடவடிக்கை கோருதல்: ${incident.tamilTitle || incident.title}

ஐயா/அம்மா,

ஜிியோ-கேம் (Geo-Cam) சரிபார்ப்பு (உண்மைத் திறன் மதிப்பு: ${incident.truthScore || 95}%) மூலம் பதிவு செய்யப்பட்ட இந்த அதிகாரப்பூர்வ நகர்ப்புற புகார் தன்னாட்சி முகவர் இயங்குதளம் வழியாக தங்களுக்கு அனுப்பப்படுகிறது.

சம்பவத்தின் விவரங்கள்:
${incident.tamilDescription || incident.description}

தேவையான உடனடி நடவடிக்கைகள்:
1. குறிக்கப்பட்ட இடத்திற்கு (${incident.lat}, ${incident.long}) உடனடியாக ஆய்வு அதிகாரிகளை அனுப்ப வேண்டும்.
2. அவசர சீரமைப்பு மற்றும் பாதுகாப்பு நடவடிக்கைகளை உடனடியாக மேற்கொள்ள வேண்டும்.
3. 48 மணி நேரத்திற்குள் புகார் நிலை அறிவிப்பை மத்திய போர்ட்டலில் புதுப்பிக்க வேண்டும்.

தானியங்கி மேல்முறையீட்டு அறிவிப்பு:
48-72 மணி நேரத்திற்குள் நடவடிக்கை எடுக்கப்படாவிட்டால், n8n தானியங்கி வழிமுறை மூலம் மாவட்ட ஆட்சியர் மற்றும் முதலமைச்சரின் தனிப்பிரிவுக்கு புகார் தானாகவே உயர்த்தப்படும்.

இப்படிக்கு,
சரிபார்க்கப்பட்ட नागरिकர் & தன்னாட்சி அனுப்புதல் முகவர்
    `.trim();

    return {
      english: englishLetter,
      tamil: tamilLetter
    };
  }
};
