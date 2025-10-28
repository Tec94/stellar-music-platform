import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaUploader } from '../../src/components/MediaUploader';

function createFile(name: string, size: number, type: string) {
  return new File(['file contents'], name, { type });
}

describe('Media upload flow', () => {
  it('validates file before upload', async () => {
    const user = userEvent.setup();
    const onUpload = vi.fn();
    render(<MediaUploader onUpload={onUpload} />);

    const fileInput = screen.getByTestId('file-input');
    const invalidFile = createFile('doc.pdf', 1000, 'application/pdf');

    await user.upload(fileInput, invalidFile);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid file/i);
    });
    expect(onUpload).not.toHaveBeenCalled();
  });

  it('uploads valid media file', async () => {
    const user = userEvent.setup();
    const onUpload = vi.fn().mockResolvedValue({ url: 'https://cdn.example.com/photo.jpg' });
    render(<MediaUploader onUpload={onUpload} />);

    const fileInput = screen.getByTestId('file-input');
    const validFile = createFile('photo.jpg', 1024, 'image/jpeg');

    await user.upload(fileInput, validFile);

    await waitFor(() => {
      expect(onUpload).toHaveBeenCalled();
      expect(screen.getByRole('status')).toHaveTextContent('Uploaded: https://cdn.example.com/photo.jpg');
    });
  });

  it('handles upload errors', async () => {
    const user = userEvent.setup();
    const onUpload = vi.fn().mockRejectedValue(new Error('Upload failed'));
    render(<MediaUploader onUpload={onUpload} />);

    const fileInput = screen.getByTestId('file-input');
    const validFile = createFile('photo.jpg', 1024, 'image/jpeg');

    await user.upload(fileInput, validFile);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Upload failed');
    });
  });
});
