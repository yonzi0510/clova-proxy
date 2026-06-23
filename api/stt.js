export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);

  const resp = await fetch('https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-NCP-APIGW-API-KEY-ID': process.env.CLOVA_CLIENT_ID,
      'X-NCP-APIGW-API-KEY': process.env.CLOVA_CLIENT_SECRET,
    },
    body,
  });

  const data = await resp.json();
  return res.status(resp.status).json(data);
}
