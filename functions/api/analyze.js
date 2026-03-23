export async function onRequestPost(context) {
  try {
    const { brand, competitors } = await context.request.json();
    const API_KEY = context.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY in Cloudflare Dashboard." }), { status: 500 });
    }

    // UPDATED: Using the 2026 Gemini 3 Flash stable endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `Analyze ${brand} vs ${JSON.stringify(competitors)}. Find tactical 2026 white-space use cases for public records data. Focus on non-obvious markets like estate executors, small business vetting, or influencer fraud. Return a structured HTML report with tables.` 
          }] 
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: `AI Studio Error: ${data.error.message}` }), { status: 400 });
    }

    const html_report = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ html_report }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: `System Error: ${err.message}` }), { status: 500 });
  }
}
