import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const form = await req.formData();
  const base = process.env.NEXT_PUBLIC_CHATBOT_API_URL!;

  try {
    const res = await fetch(`${base}/math/suggest`, {
      method: 'POST',
      body: form,
    });

    const text = await res.text();
    try {
      const jsonData = JSON.parse(text);
      return NextResponse.json({ data: jsonData.response }, { status: res.status });
    } catch {
      return NextResponse.json({ raw: text }, { status: res.status });
    }
  } catch (error) {
    console.log("error---", error);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 502 });
  }
}
