import { getBrowserClient } from './client';

interface UploadResult {
  url: string | null;
  path: string | null;
  error: Error | null;
}

interface SignedUrlResult {
  url: string | null;
  error: Error | null;
}

export async function uploadFile(options: {
  bucket: string;
  path: string;
  file: File;
  upsert?: boolean;
}): Promise<UploadResult> {
  const supabase = getBrowserClient();
  if (!supabase) {
    return { url: null, path: null, error: new Error('Supabase client not configured') };
  }

  const { data, error } = await supabase.storage
    .from(options.bucket)
    .upload(options.path, options.file, { upsert: options.upsert ?? false });

  if (error) {
    return { url: null, path: null, error: new Error(error.message) };
  }

  const { data: urlData } = supabase.storage.from(options.bucket).getPublicUrl(data.path);

  return { url: urlData.publicUrl, path: data.path, error: null };
}

export async function getSignedUrl(options: {
  bucket: string;
  path: string;
  expiresIn?: number;
}): Promise<SignedUrlResult> {
  const supabase = getBrowserClient();
  if (!supabase) {
    return { url: null, error: new Error('Supabase client not configured') };
  }

  const { data, error } = await supabase.storage
    .from(options.bucket)
    .createSignedUrl(options.path, options.expiresIn ?? 3600);

  return { url: data?.signedUrl ?? null, error: error ? new Error(error.message) : null };
}

export async function deleteFile(bucket: string, paths: string[]): Promise<{ error: Error | null }> {
  const supabase = getBrowserClient();
  if (!supabase) {
    return { error: new Error('Supabase client not configured') };
  }

  const { error } = await supabase.storage.from(bucket).remove(paths);
  return { error: error ? new Error(error.message) : null };
}

export function generateAvatarPath(userId: string, fileName: string): string {
  const ext = fileName.split('.').pop() || 'jpg';
  return `${userId}/avatar-${Date.now()}.${ext}`;
}

export function generateMediaPath(userId: string, fileName: string): string {
  const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${userId}/${Date.now()}-${sanitized}`;
}
