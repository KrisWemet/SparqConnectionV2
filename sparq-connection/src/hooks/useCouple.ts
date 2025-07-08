'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuthContext } from '@/lib/auth/AuthProvider';
import { Couple, User, CoupleProfile } from '@/types';

export interface CoupleState {
  couple: CoupleProfile | null;
  partner: User | null;
  loading: boolean;
  hasCouple: boolean;
}

export interface CoupleActions {
  refreshCouple: () => Promise<void>;
  updateCouple: (updates: Partial<Couple>) => Promise<{ error?: any }>;
}

export function useCouple(): CoupleState & CoupleActions {
  const [couple, setCouple] = useState<CoupleProfile | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  const fetchCouple = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get couple data using the database function
      const { data: coupleData, error: coupleError } = await supabase.rpc(
        'get_user_couple',
        { user_id: user.id }
      );

      if (coupleError) {
        console.error('Error fetching couple:', coupleError);
        setLoading(false);
        return;
      }

      if (coupleData && coupleData.length > 0) {
        const coupleRecord = coupleData[0];
        
        // Fetch full couple details
        const { data: fullCouple, error: fullCoupleError } = await supabase
          .from('couples')
          .select(`
            *,
            partner1:users!couples_partner1_id_fkey(*),
            partner2:users!couples_partner2_id_fkey(*)
          `)
          .eq('id', coupleRecord.couple_id)
          .single();

        if (fullCoupleError) {
          console.error('Error fetching full couple data:', fullCoupleError);
          setLoading(false);
          return;
        }

        setCouple(fullCouple);

        // Set partner (the other person in the couple)
        const partnerData = fullCouple.partner1.id === user.id 
          ? fullCouple.partner2 
          : fullCouple.partner1;
        setPartner(partnerData);
      }
    } catch (error) {
      console.error('Error in fetchCouple:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCouple = async () => {
    setLoading(true);
    await fetchCouple();
  };

  const updateCouple = async (updates: Partial<Couple>) => {
    if (!couple || !user) {
      return { error: new Error('No couple or user found') };
    }

    try {
      const { error } = await supabase
        .from('couples')
        .update(updates)
        .eq('id', couple.id);

      if (!error) {
        // Refresh couple data
        await refreshCouple();
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchCouple();
    } else {
      setCouple(null);
      setPartner(null);
      setLoading(false);
    }
  }, [user]);

  return {
    couple,
    partner,
    loading,
    hasCouple: !!couple,
    refreshCouple,
    updateCouple,
  };
}