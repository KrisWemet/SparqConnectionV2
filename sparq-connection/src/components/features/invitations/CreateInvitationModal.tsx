'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useInvitations } from '@/hooks/useInvitations';
import { emailSchema } from '@/lib/utils/validation';

const invitationSchema = z.object({
  email: emailSchema.optional(),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

interface CreateInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateInvitationModal({ isOpen, onClose, onSuccess }: CreateInvitationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any>(null);
  const { createInvitation } = useInvitations();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
  });

  const onSubmit = async (data: InvitationFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: invitationData, error: invitationError } = await createInvitation(data.email);

      if (invitationError) {
        setError(invitationError.message);
      } else {
        setInvitation(invitationData);
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    setInvitation(null);
    onClose();
  };

  const copyInviteLink = () => {
    if (invitation) {
      const inviteUrl = `${window.location.origin}/invite/${invitation.invite_code}`;
      navigator.clipboard.writeText(inviteUrl);
    }
  };

  const shareInviteLink = () => {
    if (invitation && typeof navigator !== 'undefined' && 'share' in navigator) {
      const inviteUrl = `${window.location.origin}/invite/${invitation.invite_code}`;
      navigator.share({
        title: 'Join me on Sparq Connection',
        text: 'Let\'s strengthen our relationship together with daily connection moments!',
        url: inviteUrl,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-center">
            {invitation ? 'Invitation Created!' : 'Invite Your Partner'}
          </CardTitle>
          <p className="text-center text-gray-600">
            {invitation 
              ? 'Share this link with your partner to start your journey together'
              : 'Send an invitation to start building stronger connection moments together'
            }
          </p>
        </CardHeader>
        <CardContent>
          {!invitation ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Partner's Email (Optional)"
                type="email"
                placeholder="partner@email.com"
                {...register('email')}
                error={errors.email?.message}
                helperText="Leave empty to create a shareable link instead"
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Create Invitation
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invitation Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/invite/${invitation.invite_code}`}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyInviteLink}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Invitation Code</h4>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-mono bg-white px-3 py-1 rounded border">
                    {invitation.invite_code}
                  </code>
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  Your partner can also use this code directly in the app
                </p>
              </div>

              <div className="flex gap-3">
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <Button
                    variant="outline"
                    onClick={shareInviteLink}
                    className="flex-1"
                  >
                    Share
                  </Button>
                )}
                <Button
                  onClick={handleClose}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                This invitation expires in 7 days
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Modal>
  );
}