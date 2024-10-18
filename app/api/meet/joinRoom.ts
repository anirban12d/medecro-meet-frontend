import { NextApiRequest, NextApiResponse } from 'next';
import { AccessToken } from 'livekit-server-sdk';

const createToken = (roomName: string, participantName: string) => {
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantName,
    ttl: '10m',
  });
  at.addGrant({ roomJoin: true, room: roomName });
  return at.toJwt();
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { roomName, participantName } = req.body;

    const token = createToken(roomName, participantName);
    res.status(200).json({ token });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
