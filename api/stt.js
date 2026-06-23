export const config = { runtime: 'edge' };

export default async function handler(req) {
  // CORS preflight 처리
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const body = await req.arrayBuffer();

  const resp = await fetch('https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-NCP-APIGW-API-KEY-ID': process.env.CLOVA_CLIENT_ID,
      'X-NCP-APIGW-API-KEY':    process.env.CLOVA_CLIENT_SECRET,
    },
    body,
  });

  const data = await resp.json();

  return new Response(JSON.stringify(data), {
    status: resp.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
