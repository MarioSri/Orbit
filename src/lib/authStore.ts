import { writable, derived } from 'svelte/store';
import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

// ─── Auth State ───────────────────────────────────────────

export const user = writable<User | null>(null);
export const session = writable<Session | null>(null);
export const authLoading = writable<boolean>(true);

// ─── Profile State ────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  plan: 'free' | 'pro';
  stripe_customer_id: string | null;
  max_devices: number;
  created_at: string;
}

export const profile = writable<Profile | null>(null);

// Derived: is the user on a paid plan?
export const isPro = derived(profile, ($profile) => $profile?.plan === 'pro');

// ─── Init: Listen to auth changes ─────────────────────────

/**
 * Generate a simple device fingerprint from available browser/Tauri info.
 * In production Tauri, this would use the machine-id crate for a hardware fingerprint.
 */
function generateFingerprint(): string {
  const raw = (typeof navigator !== 'undefined')
    ? `${navigator.userAgent}|${navigator.language}|${screen.width}x${screen.height}`
    : 'unknown-device';
  // Simple hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `fp_${Math.abs(hash).toString(36)}`;
}

function getOsPlatform(): 'macos' | 'windows' {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac')) return 'macos';
  return 'windows';
}

function getDeviceName(): string {
  if (typeof navigator === 'undefined') return 'Unknown Device';
  const ua = navigator.userAgent;
  if (ua.includes('Mac')) return 'Mac';
  if (ua.includes('Windows')) return 'Windows PC';
  return 'Desktop';
}

async function autoRegisterDevice() {
  try {
    const fingerprint = generateFingerprint();
    const os = getOsPlatform();
    const name = getDeviceName();
    await registerDevice(fingerprint, name, os);
  } catch (err) {
    // Silently fail — device registration is non-critical
    console.warn('Device registration skipped:', (err as Error).message);
  }
}

export async function initAuth() {
  // Get existing session (persisted by Supabase SDK in localStorage)
  const { data: { session: existingSession } } = await supabase.auth.getSession();

  if (existingSession) {
    session.set(existingSession);
    user.set(existingSession.user);
    await fetchProfile(existingSession.user.id);
    await autoRegisterDevice();
  }

  authLoading.set(false);

  // Listen for auth changes (login, logout, token refresh)
  supabase.auth.onAuthStateChange(async (event, newSession) => {
    session.set(newSession);
    user.set(newSession?.user ?? null);

    if (newSession?.user) {
      await fetchProfile(newSession.user.id);
      if (event === 'SIGNED_IN') {
        await autoRegisterDevice();
      }
    } else {
      profile.set(null);
    }
  });
}

// ─── Profile Fetch ────────────────────────────────────────

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, plan, stripe_customer_id, max_devices, created_at')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Failed to fetch profile:', error.message);
    profile.set(null);
    return;
  }

  profile.set(data as Profile);
}

// ─── Auth Actions ─────────────────────────────────────────

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  profile.set(null);
}

// ─── Device Registration ──────────────────────────────────

export async function registerDevice(
  fingerprint: string,
  deviceName: string,
  os: 'macos' | 'windows'
) {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('devices')
    .upsert(
      {
        user_id: currentUser.id,
        device_fingerprint: fingerprint,
        device_name: deviceName,
        os,
        last_seen_at: new Date().toISOString()
      },
      { onConflict: 'user_id,device_fingerprint' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyDevices() {
  const { data, error } = await supabase
    .from('devices')
    .select('id, device_fingerprint, device_name, os, last_seen_at')
    .order('last_seen_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function removeDevice(deviceId: string) {
  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', deviceId);

  if (error) throw error;
}
