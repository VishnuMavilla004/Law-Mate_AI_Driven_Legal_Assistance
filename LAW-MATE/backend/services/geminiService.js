const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: __dirname + '/../.env' });

// log key presence for debugging (only first few chars shown)
const rawKey = process.env.GEMINI_API_KEY;
console.log('geminiService loaded, GEMINI_API_KEY=', rawKey ? rawKey.slice(0,8) + '...' : '<not set>');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

const API_KEY = rawKey;
const genAI = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const systemInstruction = `You are LawMate, an expert AI legal assistant specialized in Indian law. Your role is to explain laws, rights, and possible remedies in very simple and neutral language.
- You must always clarify that you are not a lawyer and can't give official legal advice.
- Never guarantee outcomes. Use words like ‘may’, ‘could’, ‘typically’.
- Your response MUST be a single, valid JSON object that strictly conforms to the provided schema. Do NOT output any text, markdown, or any characters before or after the JSON object.
- The severity rating should reflect potential legal/personal consequences. 'High' for criminal matters or significant personal/financial risk.
- Confidence score reflects how clearly the situation maps to laws.
- Provide practical, actionable next steps.`;


function getMockAnalysisResult(userQuery, category) {
  // Provide realistic legal analysis based on query content analysis
  const lowerQuery = userQuery.toLowerCase();
  const lowerCategory = category ? category.toLowerCase() : '';

  let analysis = {
    summary: `Based on your query about "${userQuery}", here is relevant legal information under Indian law. Please note, I am an AI and cannot provide official legal advice. This information is for general awareness and should not be a substitute for consulting a qualified legal professional.`,
    severity: "Medium",
    confidence: 80,
    confidenceReason: "Based on analysis of common legal scenarios and Indian law.",
    lawSuggestions: [],
    rights: [],
    nextSteps: [],
    documentSuggestions: []
  };

  // Analyze query for specific legal issues
  if (lowerQuery.includes('harass') || lowerQuery.includes('harassment') || lowerQuery.includes('abuse') || lowerQuery.includes('assault')) {
    analysis.summary = "Your query involves harassment or abuse. In India, various laws protect against harassment depending on the context (workplace, domestic, public, etc.).";
    analysis.severity = "High";
    analysis.lawSuggestions = [
      {
        code: "Section 354A",
        act: "Indian Penal Code (IPC)",
        title: "Sexual Harassment",
        simpleExplanation: "Criminalizes unwelcome sexual advances, demands, or showing pornography.",
        punishment: "Up to 3 years imprisonment and fine.",
        domainTags: ["Criminal Law", "Women Safety"]
      },
      {
        code: "POSH Act, 2013",
        act: "Sexual Harassment of Women at Workplace Act",
        title: "Workplace Harassment Protection",
        simpleExplanation: "Requires employers to prevent and address workplace sexual harassment.",
        punishment: "N/A - Compliance requirements.",
        domainTags: ["Employment Law", "Women Rights"]
      }
    ];
    analysis.rights = [
      "Right to a harassment-free environment",
      "Right to file police complaints",
      "Right to internal complaints committees at workplace",
      "Right to protection from retaliation"
    ];
    analysis.nextSteps = [
      "Document all incidents with dates and details",
      "File complaint with appropriate authority (police/employer)",
      "Seek immediate medical attention if physically harmed",
      "Contact women's helpline (181) or NGO support",
      "Consult a lawyer for specific legal remedies"
    ];
    analysis.documentSuggestions = [
      "Incident diary with detailed accounts",
      "Medical reports if applicable",
      "Communication records (messages, emails)",
      "Witness statements",
      "Police complaint copy"
    ];
  }
  else if (lowerQuery.includes('property') || lowerQuery.includes('land') || lowerQuery.includes('house') || lowerQuery.includes('inheritance')) {
    analysis.summary = "Your query relates to property or inheritance matters. Indian property law is governed by various acts depending on the type of property and parties involved.";
    analysis.severity = "Medium";
    analysis.lawSuggestions = [
      {
        code: "Section 6",
        act: "Hindu Succession Act, 1956",
        title: "Equal Inheritance Rights",
        simpleExplanation: "Daughters have equal rights as sons in ancestral property.",
        punishment: "N/A - Declaratory rights.",
        domainTags: ["Property Law", "Inheritance"]
      },
      {
        code: "Transfer of Property Act, 1882",
        act: "Transfer of Property Act",
        title: "Property Transfer Regulations",
        simpleExplanation: "Governs transfer of immovable property through sale, mortgage, etc.",
        punishment: "N/A - Civil remedies.",
        domainTags: ["Property Law", "Contract Law"]
      }
    ];
    analysis.rights = [
      "Right to peaceful possession of property",
      "Right to equal inheritance shares",
      "Right to challenge fraudulent transfers",
      "Right to property documentation"
    ];
    analysis.nextSteps = [
      "Gather all property documents and title deeds",
      "Check revenue records and mutation entries",
      "Send legal notice to opposing parties",
      "File civil suit in appropriate court",
      "Consult property law expert"
    ];
    analysis.documentSuggestions = [
      "Title deeds and sale deeds",
      "Revenue records and tax receipts",
      "Family tree for inheritance cases",
      "Previous court orders",
      "Identity proofs"
    ];
  }
  else if (lowerQuery.includes('divorce') || lowerQuery.includes('marriage') || lowerQuery.includes('maintenance') || lowerQuery.includes('alimony')) {
    analysis.summary = "Your query involves matrimonial matters. Divorce and related issues are governed by personal laws (Hindu Marriage Act, etc.) and can involve civil courts.";
    analysis.severity = "High";
    analysis.lawSuggestions = [
      {
        code: "Section 13",
        act: "Hindu Marriage Act, 1955",
        title: "Divorce Grounds",
        simpleExplanation: "Provides grounds for divorce including cruelty, desertion, adultery.",
        punishment: "N/A - Dissolution of marriage.",
        domainTags: ["Family Law", "Matrimonial Law"]
      },
      {
        code: "Section 125",
        act: "Criminal Procedure Code (CrPC)",
        title: "Maintenance for Wife/Children",
        simpleExplanation: "Magistrate can order maintenance for wife and children.",
        punishment: "N/A - Monthly maintenance.",
        domainTags: ["Family Law", "Maintenance"]
      }
    ];
    analysis.rights = [
      "Right to seek divorce on valid grounds",
      "Right to maintenance and alimony",
      "Right to custody of children",
      "Right to protection from domestic violence"
    ];
    analysis.nextSteps = [
      "Attempt mediation through family court",
      "File petition for divorce in family court",
      "Apply for interim maintenance",
      "Seek counseling if possible",
      "Consult family law specialist"
    ];
    analysis.documentSuggestions = [
      "Marriage certificate",
      "Proof of income and expenses",
      "Evidence of grounds for divorce",
      "Children's birth certificates",
      "Medical reports if applicable"
    ];
  }
  else if (lowerQuery.includes('employment') || lowerQuery.includes('job') || lowerQuery.includes('salary') || lowerQuery.includes('termination')) {
    analysis.summary = "Your query relates to employment matters. Indian labor laws provide protections depending on the type of employment and establishment size.";
    analysis.severity = "Medium";
    analysis.lawSuggestions = [
      {
        code: "Section 25F",
        act: "Industrial Disputes Act, 1947",
        title: "Retrenchment Conditions",
        simpleExplanation: "Employers must follow due process before terminating employment.",
        punishment: "Reinstatement with back wages.",
        domainTags: ["Labor Law", "Employment"]
      },
      {
        code: "Minimum Wages Act, 1948",
        act: "Minimum Wages Act",
        title: "Minimum Wage Protection",
        simpleExplanation: "Employees entitled to minimum wages as notified by government.",
        punishment: "Fine up to Rs. 500.",
        domainTags: ["Labor Law", "Wages"]
      }
    ];
    analysis.rights = [
      "Right to fair wages and timely payment",
      "Right to safe working conditions",
      "Right to notice before termination",
      "Right to grievance redressal",
      "Protection against unfair dismissal"
    ];
    analysis.nextSteps = [
      "Document employment terms and communications",
      "File complaint with labor department",
      "Approach labor court for disputes",
      "Contact trade union if applicable",
      "Seek legal advice from labor law expert"
    ];
    analysis.documentSuggestions = [
      "Appointment letter and contract",
      "Salary slips and bank statements",
      "Performance appraisals",
      "Termination notice",
      "Company policies"
    ];
  }
  else if (lowerQuery.includes('consumer') || lowerQuery.includes('defective') || lowerQuery.includes('complaint') || lowerQuery.includes('refund')) {
    analysis.summary = "Your query involves consumer rights. The Consumer Protection Act provides remedies for defective goods/services.";
    analysis.severity = "Low";
    analysis.lawSuggestions = [
      {
        code: "Section 2(1)(o)",
        act: "Consumer Protection Act, 2019",
        title: "Consumer Rights",
        simpleExplanation: "Right to safe products, accurate information, fair contracts.",
        punishment: "N/A - Consumer remedies.",
        domainTags: ["Consumer Law", "Contract Law"]
      },
      {
        code: "Section 35",
        act: "Consumer Protection Act, 2019",
        title: "Product Liability",
        simpleExplanation: "Manufacturers liable for defective products causing harm.",
        punishment: "Compensation and penalties.",
        domainTags: ["Consumer Law", "Product Liability"]
      }
    ];
    analysis.rights = [
      "Right to safe and quality products/services",
      "Right to information about products",
      "Right to fair contracts and pricing",
      "Right to redressal of grievances",
      "Right to compensation for losses"
    ];
    analysis.nextSteps = [
      "File complaint with consumer forum",
      "Gather evidence of purchase and defect",
      "Send legal notice to seller/manufacturer",
      "Approach district consumer forum",
      "Escalate to state/national commission if needed"
    ];
    analysis.documentSuggestions = [
      "Purchase receipts and warranties",
      "Product photographs and defect evidence",
      "Communication with seller",
      "Expert reports if applicable",
      "Witness statements"
    ];
  }
  // Fallback for unrecognized queries
  else {
    analysis.lawSuggestions = [
      {
        code: "Article 14",
        act: "Constitution of India",
        title: "Right to Equality",
        simpleExplanation: "All persons equal before law, entitled to equal protection.",
        punishment: "N/A - Fundamental right.",
        domainTags: ["Fundamental Rights"]
      },
      {
        code: "Article 21",
        act: "Constitution of India",
        title: "Right to Life and Liberty",
        simpleExplanation: "No person deprived of life or liberty except by procedure established by law.",
        punishment: "N/A - Fundamental right.",
        domainTags: ["Fundamental Rights"]
      }
    ];
    analysis.rights = [
      "Right to legal remedies for grievances",
      "Right to approach courts for justice",
      "Right to free legal aid (eligible persons)",
      "Right to fair hearing and due process"
    ];
    analysis.nextSteps = [
      "Identify the specific legal nature of your issue",
      "Gather relevant documents and evidence",
      "Consult qualified legal professional",
      "Consider free legal aid services",
      "Document your concerns in writing"
    ];
    analysis.documentSuggestions = [
      "Relevant contracts or agreements",
      "Correspondence related to the issue",
      "Identity and address proofs",
      "Supporting evidence or witness details"
    ];
  }

  return analysis;
}

async function analyzeLegalIssue(category, query, imageDataUrl = null) {
  // align with controller call which passes category first
  if (!genAI) {
    console.warn("GEMINI_API_KEY not set or invalid. Using mock data.");
    return new Promise(resolve => setTimeout(() => resolve(getMockAnalysisResult(query, category)), 1500));
  }

  // Add timestamp to prompt for more variety
  const timestamp = new Date().toISOString();
  const promptText = `You are LawMate, an expert AI legal assistant specialized in Indian law. Your role is to provide specific, accurate legal information based on Indian laws, acts, and court precedents. You must answer the user's specific question with relevant legal details, citing specific sections of laws where applicable.

IMPORTANT: Do not give generic responses. Always provide concrete legal information relevant to the user's query. If the query is about harassment, cite specific IPC sections, acts like POSH, etc. If about property, cite specific property laws. Always include actionable advice.

- You must always clarify that you are not a lawyer and can't give official legal advice.
- Never guarantee outcomes. Use words like 'may', 'could', 'typically'.
- Your response MUST be a single, valid JSON object that strictly conforms to the following schema. Do NOT output any text, markdown, or any characters before or after the JSON object.

Schema:
{
  "summary": "A concise summary of the legal analysis and advice",
  "severity": "Low" | "Medium" | "High",
  "confidence": number (0-100, how confident the analysis is),
  "lawSuggestions": [
    {
      "code": "Section or Article number",
      "act": "Name of the Act",
      "title": "Short title of the law",
      "simpleExplanation": "Simple explanation of the law",
      "punishment": "Punishment or remedy",
      "domainTags": ["array of tags like 'Criminal Law', 'Property Law'"]
    }
  ],
  "rights": ["array of relevant rights"],
  "nextSteps": ["array of actionable next steps"],
  "documentSuggestions": ["array of suggested documents"]
}

- The severity rating should reflect potential legal/personal consequences. 'High' for criminal matters or significant personal/financial risk.
- Confidence score reflects how clearly the situation maps to laws.
- Provide practical, actionable next steps based on Indian legal procedures.

Current timestamp: ${timestamp}
Category: ${category}
ML-detected category: ${category}

USER QUESTION: "${query}"

Provide a detailed analysis specific to this query, citing relevant Indian laws, sections, and acts. Include specific remedies, procedures, and next steps under Indian law.`;

  let contents;

  if (imageDataUrl) {
    const [mimeTypePart, base64Part] = imageDataUrl.split(';base64,');
    if (!mimeTypePart || !base64Part) {
      throw new Error("Invalid image data URL format.");
    }
    const mimeType = mimeTypePart.split(':')[1];
    contents = [
      { text: promptText },
      {
        inlineData: {
          mimeType,
          data: base64Part,
        },
      },
    ];
  } else {
    contents = promptText;
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
      }
    });
    const responseText = response.text.trim();
    console.log("Gemini response:", responseText);
    // Extra logging for debugging
    if (!responseText) {
      console.warn("Gemini API returned empty response for query:", query);
    }
    // Strip markdown code blocks if present (fallback for AI not following instructions)
    let jsonText = responseText;
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API for analysis for query:", query, error);
    console.warn("Falling back to mock data due to API error");
    return getMockAnalysisResult(query, category);
  }
}

const pastIncidentSystemInstruction = `You are a legal historian AI. Analyze a past incident provided by the user. Compare the legal landscape at the time of the incident with the current legal framework in India. Your response must be a single, valid JSON object conforming to the schema. Focus on highlighting the differences and how new laws could have changed the approach or outcome.`;

async function analyzePastIncident(description, date) {
  if (!genAI) {
    console.warn("GEMINI_API_KEY not set. Using mock data for past incident analysis.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ANALYSIS_RESULT), 2000));
  }

  const prompt = `Incident Description: "${description}"\nApproximate Date of Incident: ${date}`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.4,
        responseMimeType: "application/json",
        systemInstruction: pastIncidentSystemInstruction
      }
    });
    const responseText = response.text.trim();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error calling Gemini API for past incident analysis:", error);
    console.warn("Falling back to mock data for past incident analysis");
    return MOCK_ANALYSIS_RESULT;
  }
}

async function generateDocument(docType, analysis, userDetails, additionalDetails) {
  console.log('generateDocument called with:', { docType, userDetails: userDetails.fullName });
  console.log('AI object initialized:', !!genAI);

  if (!genAI) {
    console.warn("GEMINI_API_KEY not set. Using mock data.");
    return generateMockDocument(docType, analysis, userDetails, additionalDetails);
  }

  // Create a comprehensive prompt using the analysis data
  const prompt = `You are LawMate, an expert AI legal assistant specialized in Indian law. Generate a professional, legally sound draft of a ${docType} based on the following case analysis and user details.

CASE ANALYSIS:
Summary: ${analysis.summary}
Severity: ${analysis.severity}
Confidence: ${analysis.confidence}%
Applicable Laws:
${analysis.lawSuggestions.map(law => `- ${law.code} of ${law.act}: ${law.title} - ${law.simpleExplanation}`).join('\n')}

User Rights:
${analysis.rights.map(right => `- ${right}`).join('\n')}

Recommended Next Steps:
${analysis.nextSteps.map(step => `- ${step}`).join('\n')}

USER DETAILS:
Full Name: ${userDetails.fullName}
Address: ${userDetails.address}
Contact: ${userDetails.contact}
Opponent Name: ${userDetails.opponentName}
Opponent Address: ${userDetails.opponentAddress}

ADDITIONAL DETAILS PROVIDED BY USER:
${additionalDetails || 'None provided'}

INSTRUCTIONS:
- Generate a complete, professional ${docType} draft that is specifically tailored to this case
- Use the applicable laws and case details from the analysis above
- Include proper legal formatting, citations, and structure
- Make it comprehensive but concise
- Ensure all content is directly relevant to the user's specific situation
- Use formal legal language appropriate for court documents
- Include all necessary sections for a ${docType}
- Base the content on Indian law and the specific laws mentioned in the analysis

Generate the complete ${docType} draft below:`;

  try {
    console.log('Making API call to Gemini for document generation...');
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });
    console.log('API call successful, response received');
    const responseText = response.text.trim();
    console.log('Response length:', responseText.length);
    return responseText;
  } catch (error) {
    console.error("Error calling Gemini API for document generation:", error);
    console.warn("Falling back to mock document generation");
    return generateMockDocument(docType, analysis, userDetails, additionalDetails);
  }
}

function generateMockDocument(docType, analysis, userDetails, additionalDetails) {
  const today = new Date().toLocaleDateString('en-IN');
  
  let document = '';

  if (docType.toLowerCase().includes('legal notice')) {
    document = `LEGAL NOTICE

Date: ${today}

To:
${userDetails.opponentName}
${userDetails.opponentAddress}

From:
${userDetails.fullName}
${userDetails.address}
Contact: ${userDetails.contact}

SUBJECT: LEGAL NOTICE FOR ${analysis.summary.toUpperCase()}

Dear ${userDetails.opponentName},

I, ${userDetails.fullName}, resident of ${userDetails.address}, hereby serve you with this legal notice under the relevant provisions of Indian law.

FACTS OF THE CASE:
${analysis.summary}

APPLICABLE LAWS:
${analysis.lawSuggestions.map(law => `- ${law.code} of ${law.act}: ${law.simpleExplanation}`).join('\n')}

YOUR RIGHTS:
${analysis.rights.map(right => `- ${right}`).join('\n')}

DEMAND:
You are hereby called upon to:
${analysis.nextSteps.map(step => `- ${step}`).join('\n')}

${additionalDetails ? `ADDITIONAL DETAILS: ${additionalDetails}` : ''}

FAILURE TO COMPLY:
In case of non-compliance within 15 days from the receipt of this notice, I shall be compelled to initiate appropriate legal proceedings against you without any further notice.

This notice is issued without prejudice to any other rights and remedies available to me under law.

Yours faithfully,

${userDetails.fullName}
${userDetails.address}
Contact: ${userDetails.contact}

Note: This is a draft document prepared by LawMate AI. Please consult a qualified legal professional before using this document.`;
  } else if (docType.toLowerCase().includes('fir') || docType.toLowerCase().includes('complaint')) {
    document = `FIRST INFORMATION REPORT / POLICE COMPLAINT

Date: ${today}

To:
The Officer In-Charge
[Name of Police Station]
[Address of Police Station]

From:
${userDetails.fullName}
${userDetails.address}
Contact: ${userDetails.contact}

SUBJECT: COMPLAINT REGARDING ${analysis.summary.toUpperCase()}

Respected Sir/Madam,

I, ${userDetails.fullName}, resident of ${userDetails.address}, do hereby lodge this complaint under Section 154 of the Code of Criminal Procedure, 1973.

PARTICULARS OF THE COMPLAINT:

1. Name and Address of Complainant: ${userDetails.fullName}, ${userDetails.address}

2. Date and Time of Incident: [Please specify the exact date and time]

3. Place of Incident: [Please specify the location]

4. Details of Incident: ${analysis.summary}

5. Name and Address of Accused: ${userDetails.opponentName}, ${userDetails.opponentAddress}

6. Applicable Laws: 
${analysis.lawSuggestions.map(law => `- ${law.code} of ${law.act}`).join('\n')}

7. Witnesses (if any): [Please specify]

8. Evidence/Documents: 
${analysis.documentSuggestions.map(doc => `- ${doc}`).join('\n')}

${additionalDetails ? `ADDITIONAL INFORMATION: ${additionalDetails}` : ''}

I request that appropriate action be taken against the accused as per law. I am ready to cooperate with the police investigation.

Place: ${userDetails.address.split(',')[0] || 'Location'}
Date: ${today}

Yours faithfully,

${userDetails.fullName}
Contact: ${userDetails.contact}

Note: This is a draft document prepared by LawMate AI. Please consult a qualified legal professional before using this document.`;
  } else if (docType.toLowerCase().includes('petition') || docType.toLowerCase().includes('application')) {
    document = `LEGAL PETITION / APPLICATION

IN THE COURT OF [APPROPRIATE COURT]
AT [CITY/LOCATION]

Case No: __________

${userDetails.fullName}                        ...Petitioner/Applicant

Versus

${userDetails.opponentName}                     ...Respondent/Opposite Party

PETITION UNDER [RELEVANT SECTIONS]

MOST RESPECTFULLY SHOWETH:

1. That the Petitioner/Applicant is ${userDetails.fullName}, resident of ${userDetails.address}.

2. That the Respondent/Opposite Party is ${userDetails.opponentName}, resident of ${userDetails.opponentAddress}.

3. That the facts of the case are as follows:
   ${analysis.summary}

4. That the Petitioner/Applicant has the following rights:
   ${analysis.rights.map(right => `- ${right}`).join('\n')}

5. That the applicable laws are:
   ${analysis.lawSuggestions.map(law => `- ${law.code} of ${law.act}: ${law.simpleExplanation}`).join('\n')}

6. That the Petitioner/Applicant has taken the following steps:
   ${analysis.nextSteps.map(step => `- ${step}`).join('\n')}

${additionalDetails ? `7. That additional details are: ${additionalDetails}` : ''}

PRAYER:
In view of the facts stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:

(a) Allow this petition/application
(b) Grant appropriate relief as deemed fit
(c) Pass any other order(s) as this Hon'ble Court deems fit and proper in the interest of justice

AND FOR THIS ACT OF KINDNESS, THE PETITIONER/APPLICANT SHALL EVER PRAY.

Dated: ${today}

Place: ${userDetails.address.split(',')[0] || 'Location'}

${userDetails.fullName}
Petitioner/Applicant
${userDetails.address}
Contact: ${userDetails.contact}

Note: This is a draft document prepared by LawMate AI. Please consult a qualified legal professional before using this document.`;
  } else {
    // Generic document template
    document = `${docType.toUpperCase()}

Date: ${today}

From:
${userDetails.fullName}
${userDetails.address}
Contact: ${userDetails.contact}

To:
${userDetails.opponentName}
${userDetails.opponentAddress}

SUBJECT: ${docType.toUpperCase()} REGARDING LEGAL MATTER

Dear ${userDetails.opponentName},

This document pertains to the following legal matter:
${analysis.summary}

Applicable Legal Provisions:
${analysis.lawSuggestions.map(law => `- ${law.code} of ${law.act}: ${law.simpleExplanation}`).join('\n')}

Your Rights and Obligations:
${analysis.rights.map(right => `- ${right}`).join('\n')}

Recommended Actions:
${analysis.nextSteps.map(step => `- ${step}`).join('\n')}

${additionalDetails ? `Additional Details: ${additionalDetails}` : ''}

Please take appropriate action within the stipulated time frame.

Yours sincerely,

${userDetails.fullName}
${userDetails.address}
Contact: ${userDetails.contact}

Note: This is a draft document prepared by LawMate AI. Please consult a qualified legal professional before using this document.`;
  }

  return document;
}

module.exports = {
  analyzeLegalIssue,
  analyzePastIncident,
  generateDocument,
};
