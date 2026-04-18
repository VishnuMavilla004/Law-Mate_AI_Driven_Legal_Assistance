import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult, DocumentType, UserDetails, PastIncidentAnalysisResult } from '../types';

// The API key is injected by the environment.
const API_KEY = process.env.API_KEY;

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const systemInstruction = `You are LawMate, an expert AI legal assistant specialized in Indian law. Your role is to explain laws, rights, and possible remedies in very simple and neutral language.
- You must always clarify that you are not a lawyer and can't give official legal advice.
- Never guarantee outcomes. Use words like ‘may’, ‘could’, ‘typically’.
- Your response MUST be a single, valid JSON object that strictly conforms to the provided schema. Do NOT output any text, markdown, or any characters before or after the JSON object.
- The severity rating should reflect potential legal/personal consequences. 'High' for criminal matters or significant personal/financial risk.
- Confidence score reflects how clearly the situation maps to laws.
- Provide practical, actionable next steps.`;

const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  summary: "The user is experiencing harassment at their workplace from a senior colleague, involving inappropriate comments and messages outside of work hours. This is causing significant mental distress.",
  severity: "High",
  confidence: 92,
  confidenceReason: "The described behavior aligns clearly with the definitions of workplace harassment and stalking under Indian law.",
  lawSuggestions: [
    { code: "Section 354A", act: "Indian Penal Code (IPC)", title: "Sexual Harassment", simpleExplanation: "Making unwelcome sexual remarks, demanding sexual favors, or showing pornography against a woman's will.", punishment: "Up to 3 years imprisonment and/or a fine.", domainTags: ["Women Safety", "Workplace"] },
    { code: "Section 10", act: "Sexual Harassment of Women at Workplace Act, 2013", title: "Internal Complaints Committee (ICC)", simpleExplanation: "Every employer with more than 10 employees must set up an ICC to handle harassment complaints.", punishment: "N/A - Procedural.", domainTags: ["Workplace"] }
  ],
  rights: ["Right to a safe and harassment-free workplace.", "Right to file a complaint with the Internal Complaints Committee (ICC).", "Right to privacy."],
  nextSteps: ["Document every incident with dates, times, and details.", "File a formal written complaint with your company's ICC or HR.", "If the company fails to act, approach the Local Complaints Committee (LCC).", "Consider sending a formal legal notice through a lawyer."],
  documentSuggestions: ["Complaint to ICC", "FIR Draft", "Legal Notice"]
};

export const analyzeSituation = async (category: string, message: string, imageDataUrl: string | null = null): Promise<AnalysisResult> => {
  if (!genAI) {
    console.warn("API_KEY is not set. Using mock data.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ANALYSIS_RESULT), 1500));
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    }
  });

  const userPromptText = `You are LawMate, an expert AI legal assistant specialized in Indian law. Your role is to explain laws, rights, and possible remedies in very simple and neutral language.
- You must always clarify that you are not a lawyer and can't give official legal advice.
- Never guarantee outcomes. Use words like 'may', 'could', 'typically'.
- Your response MUST be a single, valid JSON object that strictly conforms to the provided schema. Do NOT output any text, markdown, or any characters before or after the JSON object.
- The severity rating should reflect potential legal/personal consequences. 'High' for criminal matters or significant personal/financial risk.
- Confidence score reflects how clearly the situation maps to laws.
- Provide practical, actionable next steps.

Category: ${category}\n\nUser's situation: "${message}"\n\nPlease analyze this situation based on Indian law and provide a structured legal overview in the specified JSON format. If an image is provided, use it as visual context for the situation described.`;

  let contents: any;

  if (imageDataUrl) {
    const [mimeTypePart, base64Part] = imageDataUrl.split(';base64,');
    if (!mimeTypePart || !base64Part) {
      throw new Error("Invalid image data URL format.");
    }
    const mimeType = mimeTypePart.split(':')[1];
    
    contents = [
      { text: userPromptText },
      {
        inlineData: {
          mimeType,
          data: base64Part,
        },
      },
    ];
  } else {
    contents = userPromptText;
  }

    try {
        const result = await model.generateContent(contents);
        let jsonText = result.response.text().trim();
        // Remove code fences if present
        if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "");
        }
        console.log("Gemini response:", jsonText); // Add logging
        const analysisResult = JSON.parse(jsonText) as AnalysisResult;
        return analysisResult;

    } catch (error) {
        console.error("Error calling Gemini API for analysis:", error);
        console.warn("Falling back to mock data for analysis");
        return MOCK_ANALYSIS_RESULT;
    }
};

export const generateDocument = async (docType: DocumentType, analysis: AnalysisResult, userDetails: UserDetails, additionalDetails: string): Promise<string> => {
    try {
        const response = await fetch('/api/legal/generate-document', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                docType,
                analysis,
                userDetails,
                additionalDetails,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.document;
    } catch (error) {
        console.error("Error calling backend API for document generation:", error);
        throw new Error("Failed to generate the document. Please try again later.");
    }
};

// --- Past Incident Analyzer Service ---

const pastIncidentSystemInstruction = `You are a legal historian AI. Analyze a past incident provided by the user. Compare the legal landscape at the time of the incident with the current legal framework in India. Your response must be a single, valid JSON object conforming to the schema. Focus on highlighting the differences and how new laws could have changed the approach or outcome.`;

const MOCK_PAST_ANALYSIS_RESULT: PastIncidentAnalysisResult = {
    incidentSummary: "The user faced online harassment and a data leak in 2018. Personal photos and contact details were shared on a fake social media profile, but the existing IT Act provisions were not specific enough, and law enforcement was not well-equipped to handle the case, which eventually went cold.",
    timeline: [
        { year: "2018", event: "User's incident of online harassment occurs." },
        { year: "2023", event: "Digital Personal Data Protection Act is enacted, creating specific obligations for data fiduciaries and rights for individuals." },
        { year: "2024", event: "Bharatiya Nyaya Sanhita replaces the IPC, potentially altering procedural aspects." }
    ],
    analysisThen: {
        applicableLaws: [
            { lawCode: "Section 66E, IT Act, 2000", description: "Violation of privacy.", relevance: "Was applicable for capturing and publishing private images without consent, but enforcement was challenging." },
            { lawCode: "Section 509, IPC", description: "Insulting the modesty of a woman.", relevance: "Often used for online harassment, but didn't specifically address data leaks." }
        ],
        userRights: ["Right to file an FIR.", "General right to privacy under Article 21."]
    },
    analysisNow: {
        applicableLaws: [
            { lawCode: "Digital Personal Data Protection Act, 2023", description: "Protection of personal digital data.", relevance: "This new law provides a strong framework. The user is a 'Data Principal' with rights to protection. The social media platform would be a 'Data Fiduciary' with clear duties." },
            { lawCode: "Bharatiya Nyaya Sanhita, 2023", description: "New Penal Code.", relevance: "Relevant sections on harassment and stalking may offer clearer definitions or different procedural requirements." }
        ],
        userRights: ["Right to data protection.", "Right to be forgotten (under certain conditions).", "Right to file a complaint with the Data Protection Board of India.", "Stronger procedural rights for cybercrime reporting."]
    },
    keyChanges: [
        { changeTitle: "Specialized Data Protection Law", changeDescription: "The DPDP Act, 2023, provides a dedicated authority (Data Protection Board) and specific penalties for data breaches, which was absent in 2018." },
        { changeTitle: "Clearer Definitions and Duties", changeDescription: "The concept of 'Data Fiduciary' and their responsibilities makes it easier to hold platforms accountable for data misuse, unlike the broader provisions of the old IT Act." }
    ]
};


export const analyzePastIncident = async (description: string, date: string): Promise<PastIncidentAnalysisResult> => {
    if (!genAI) {
        console.warn("API_KEY is not set. Using mock data for past incident analysis.");
        return new Promise(resolve => setTimeout(() => resolve(MOCK_PAST_ANALYSIS_RESULT), 2000));
    }
    
    const model = genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
        },
        systemInstruction: pastIncidentSystemInstruction
    });

    const userPrompt = `Incident Description: "${description}"\nApproximate Date of Incident: ${date}`;

    try {
        const result = await model.generateContent(userPrompt);
        let jsonText = result.response.text().trim();
        // Remove code fences if present
        if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "");
        }
        return JSON.parse(jsonText) as PastIncidentAnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API for past incident analysis:", error);
        console.warn("Falling back to mock data for past incident analysis");
        return MOCK_PAST_ANALYSIS_RESULT;
    }
};
