'use client';

import { useRouter } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { encodePassphrase, randomString } from '@/lib/client-utils';
import styles from '../styles/Home.module.css';

function Meeting(props: { label: string }) {
  const router = useRouter();
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));
  const [participantName, setParticipantName] = useState('');
  const [roomName, setRoomName] = useState(''); // For the room name input

  const startMeeting = async () => {
    try {
      if (!roomName) {
        // Create a new room
        const response = await fetch('http://meet.medecro.ai/create-room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ participantName }),
        });

        if (!response.ok) {
          throw new Error('Failed to create room');
        }

        const { roomName: newRoomName, token } = await response.json();
        navigateToRoom(newRoomName, token);
      } else {
        // Join an existing room
        const response = await fetch('http://meet.medecro.ai/join-room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roomName, participantName }),
        });

        if (!response.ok) {
          throw new Error('Failed to join room');
        }

        const { token } = await response.json();
        navigateToRoom(roomName, token);
      }
    } catch (error) {
      console.error('Error starting meeting:', error);
    }
  };

  const navigateToRoom = (roomName: string, token: string) => {
    const params = new URLSearchParams({ token });
    if (e2ee) {
      params.append('passphrase', encodePassphrase(sharedPassphrase));
    }
    if (participantName) {
      params.append('participantName', participantName);
    }

    router.push(`/rooms/${roomName}?${params.toString()}`);
  };

  return (
    <div className={styles.tabContent}>
      <p style={{ margin: 0 }}>Medecro Meet</p>
      <input
        type="text"
        placeholder="Enter your name"
        value={participantName}
        onChange={(e) => setParticipantName(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />
      <input
        type="text"
        placeholder="Enter room name (leave empty to create a new one)"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />
      <button style={{ marginTop: '1rem' }} className="lk-button" onClick={startMeeting}>
        {roomName ? 'Join Room' : 'Create Room'}
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
          <input
            id="use-e2ee"
            type="checkbox"
            checked={e2ee}
            onChange={(ev) => setE2ee(ev.target.checked)}
          />
          <label htmlFor="use-e2ee">Enable end-to-end encryption</label>
        </div>
        {e2ee && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <label htmlFor="passphrase">Passphrase</label>
            <input
              id="passphrase"
              type="password"
              value={sharedPassphrase}
              onChange={(ev) => setSharedPassphrase(ev.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <main className={styles.main} data-lk-theme="default">
        <Suspense fallback="Loading">
          <Meeting label="Demo" />
        </Suspense>
      </main>
    </>
  );
}
