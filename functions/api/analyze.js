export async function onRequestPost(context) {
  const { brand, competitors } = await context.request.json();

  const prompt = `
    ROLE: Lead Growth Analyst for Public Records Data.
    PRIMARY ASSET: ${brand}
    COMPETITOR CONTEXT: ${JSON.stringify(competitors)}

    OBJECTIVE: 
    Identify "High-Friction" tactical use cases for our data that neither we nor competitors are currently marketing. We need to move beyond "Catch a Cheater" or "Standard Background Check."

    REQUIRED REPORT SECTIONS (HTML format):
    1. 🔍 CURRENT ANGLE AUDIT: What is ${brand} currently over-relying on?
    2. ⚠️ COMPETITOR CLUSTERS: What use cases are currently saturated in the market?
    3. 🚀 THE WHITE SPACE (TACTICAL): Provide 3-4 NEW "Complementary" Use Cases. 
       - For each, define: The specific high-stakes problem, the target hook, and the specific data point (e.g., Civil Judgments, Tax Liens, Address History) that solves it.
    4. 🧪 TESTING ROADMAP: A table with "Angle", "3-Second Visual Hook", and "Success KPI."

    SPECIFIC INSTRUCTIONS:
    Think about niche markets: Real estate executors, small business B2B vetting, remote hiring fraud, professional influencer verification, and digital legacy management. Be tactical, not generic.
  `;

  const API_KEY = context.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  const html_report = data.candidates[0].content.parts[0].text;

  return new Response(JSON.stringify({ html_report }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
