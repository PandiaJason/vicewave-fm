'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayer } from '@/player/PlayerProvider';

export default function NightDriveRoutePage() {
  const { toggleNightDrive } = usePlayer();
  const router = useRouter();

  useEffect(() => {
    toggleNightDrive(true);
    router.replace('/');
  }, [toggleNightDrive, router]);

  return null;
}
