-- Function to get couple data for a user
CREATE OR REPLACE FUNCTION get_user_couple(user_id UUID)
RETURNS TABLE (
    couple_id UUID,
    partner_id UUID,
    partner_name TEXT,
    relationship_start_date DATE,
    relationship_status relationship_status,
    health_score INTEGER,
    current_streak INTEGER,
    longest_streak INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as couple_id,
        CASE 
            WHEN c.partner1_id = user_id THEN c.partner2_id 
            ELSE c.partner1_id 
        END as partner_id,
        CASE 
            WHEN c.partner1_id = user_id THEN u2.display_name 
            ELSE u1.display_name 
        END as partner_name,
        c.relationship_start_date,
        c.relationship_status,
        c.health_score,
        c.current_streak,
        c.longest_streak
    FROM couples c
    JOIN users u1 ON u1.id = c.partner1_id
    JOIN users u2 ON u2.id = c.partner2_id
    WHERE c.partner1_id = user_id OR c.partner2_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a couple from invitation
CREATE OR REPLACE FUNCTION accept_invitation(invite_code_param TEXT, accepter_id UUID)
RETURNS UUID AS $$
DECLARE
    invitation_record invitations%ROWTYPE;
    couple_id_result UUID;
BEGIN
    -- Get the invitation
    SELECT * INTO invitation_record
    FROM invitations
    WHERE invite_code = invite_code_param 
    AND status = 'pending'
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid or expired invitation code';
    END IF;
    
    -- Create the couple
    INSERT INTO couples (partner1_id, partner2_id)
    VALUES (invitation_record.inviter_id, accepter_id)
    RETURNING id INTO couple_id_result;
    
    -- Update invitation status
    UPDATE invitations
    SET status = 'accepted', couple_id = couple_id_result
    WHERE id = invitation_record.id;
    
    RETURN couple_id_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_couple_streak(couple_id_param UUID)
RETURNS VOID AS $$
DECLARE
    last_question_date DATE;
    current_date_local DATE := CURRENT_DATE;
    current_streak_value INTEGER;
    longest_streak_value INTEGER;
BEGIN
    -- Get the most recent question date for this couple
    SELECT date INTO last_question_date
    FROM daily_questions
    WHERE couple_id = couple_id_param
    ORDER BY date DESC
    LIMIT 1;
    
    -- Get current streak values
    SELECT current_streak, longest_streak 
    INTO current_streak_value, longest_streak_value
    FROM couples
    WHERE id = couple_id_param;
    
    IF last_question_date IS NULL THEN
        -- No questions yet, set streak to 0
        UPDATE couples
        SET current_streak = 0
        WHERE id = couple_id_param;
    ELSIF last_question_date = current_date_local THEN
        -- Question for today exists, increment streak
        UPDATE couples
        SET current_streak = current_streak_value + 1,
            longest_streak = GREATEST(longest_streak_value, current_streak_value + 1)
        WHERE id = couple_id_param;
    ELSIF last_question_date = current_date_local - INTERVAL '1 day' THEN
        -- Yesterday's question exists, maintain streak
        -- No change needed
        NULL;
    ELSE
        -- Gap in questions, reset streak
        UPDATE couples
        SET current_streak = 0
        WHERE id = couple_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate health score
CREATE OR REPLACE FUNCTION calculate_health_score(couple_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    communication_score INTEGER := 50;
    engagement_score INTEGER := 50;
    consistency_score INTEGER := 50;
    response_count INTEGER;
    total_questions INTEGER;
    current_streak_val INTEGER;
    avg_response_length INTEGER;
    final_score INTEGER;
BEGIN
    -- Get basic couple data
    SELECT current_streak INTO current_streak_val
    FROM couples
    WHERE id = couple_id_param;
    
    -- Calculate engagement score based on response rate
    SELECT COUNT(*) INTO total_questions
    FROM daily_questions
    WHERE couple_id = couple_id_param
    AND date >= CURRENT_DATE - INTERVAL '30 days';
    
    SELECT COUNT(*) INTO response_count
    FROM responses r
    JOIN daily_questions dq ON dq.id = r.question_id
    WHERE dq.couple_id = couple_id_param
    AND dq.date >= CURRENT_DATE - INTERVAL '30 days';
    
    IF total_questions > 0 THEN
        engagement_score := LEAST(100, (response_count * 100) / (total_questions * 2)); -- *2 for both partners
    END IF;
    
    -- Calculate communication score based on response length and frequency
    SELECT AVG(LENGTH(content)) INTO avg_response_length
    FROM responses r
    JOIN daily_questions dq ON dq.id = r.question_id
    WHERE dq.couple_id = couple_id_param
    AND dq.date >= CURRENT_DATE - INTERVAL '30 days';
    
    communication_score := LEAST(100, GREATEST(20, avg_response_length / 2));
    
    -- Calculate consistency score based on streak
    consistency_score := LEAST(100, current_streak_val * 5);
    
    -- Calculate final weighted score
    final_score := (
        communication_score * 0.4 +
        engagement_score * 0.4 +
        consistency_score * 0.2
    )::INTEGER;
    
    -- Update the couple's health score
    UPDATE couples
    SET health_score = final_score
    WHERE id = couple_id_param;
    
    RETURN final_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to expire old invitations
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS VOID AS $$
BEGIN
    UPDATE invitations
    SET status = 'expired'
    WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_couple(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION accept_invitation(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_couple_streak(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_health_score(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_invitations() TO service_role;