import { supabase } from '@/lib/supabaseClient';

export const storageService = {
  async uploadLogo(file: File) {
    const fileName = `logo-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(fileName, file, {
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from('logos').getPublicUrl(fileName);

    return publicUrl;
  },

  async getLogoUrl(logoPath: string) {
    const {
      data: { publicUrl },
    } = supabase.storage.from('logos').getPublicUrl(logoPath);

    return publicUrl;
  },

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  },
};
