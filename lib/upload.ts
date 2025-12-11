import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate a unique filename
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
  const path = join(process.cwd(), 'public/uploads', filename);

  await writeFile(path, buffer);
  return `/uploads/${filename}`;
}
