export async function onRequestPost(context) {
  try {
    const { brand, competitors } = await context.request.json();
    const API_KEY = context.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is missing in Cloudflare Environment Variables." }), { status: 500 });
    }

    // Using Gemini 3 Flash model as per your architecture
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `Analyze the public records brand ${brand} against competitors ${JSON.stringify(competitors)}. Find tactical white-space use cases (e.g. estate management, recruiter vetting, etc). Return a professional HTML report with tables.` 
          }] 
        }]
      })
    });

    const data = await response.json();

    // If Google returns an error (like an invalid key), we pass that to the UI
    if (data.error) {
      return new Response(JSON.stringify({ error: `Google API Error: ${data.error.message}` }), { status: 400 });
    }

    if (!data.candidates || !data.candidates[0]) {
      return new Response(JSON.stringify({ error: "The AI was unable to generate a response. Try a different competitor URL." }), { status: 500 });
    }

    const html_report = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ html_report }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: `System Crash: ${err.message}` }), { status: 500 });
  }
}
