-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_events ENABLE ROW LEVEL SECURITY;

-- Users RLS policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their partner's profile" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM couples 
            WHERE (partner1_id = auth.uid() AND partner2_id = users.id)
               OR (partner2_id = auth.uid() AND partner1_id = users.id)
        )
    );

-- Couples RLS policies
CREATE POLICY "Partners can view their couple data" ON couples
    FOR SELECT USING (
        auth.uid() = partner1_id OR auth.uid() = partner2_id
    );

CREATE POLICY "Partners can update their couple data" ON couples
    FOR UPDATE USING (
        auth.uid() = partner1_id OR auth.uid() = partner2_id
    );

CREATE POLICY "Users can create couples" ON couples
    FOR INSERT WITH CHECK (
        auth.uid() = partner1_id OR auth.uid() = partner2_id
    );

-- Invitations RLS policies
CREATE POLICY "Users can view their invitations" ON invitations
    FOR SELECT USING (
        auth.uid() = inviter_id OR 
        EXISTS (
            SELECT 1 FROM couples 
            WHERE couples.id = invitations.couple_id 
            AND (partner1_id = auth.uid() OR partner2_id = auth.uid())
        )
    );

CREATE POLICY "Users can create invitations" ON invitations
    FOR INSERT WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their invitations" ON invitations
    FOR UPDATE USING (auth.uid() = inviter_id);

-- Daily questions RLS policies
CREATE POLICY "Couple members can view their questions" ON daily_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM couples 
            WHERE couples.id = daily_questions.couple_id
            AND (partner1_id = auth.uid() OR partner2_id = auth.uid())
        )
    );

CREATE POLICY "System can insert questions" ON daily_questions
    FOR INSERT WITH CHECK (true);

-- Responses RLS policies
CREATE POLICY "Users can view responses in their couple" ON responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM daily_questions dq
            JOIN couples c ON c.id = dq.couple_id
            WHERE dq.id = responses.question_id
            AND (c.partner1_id = auth.uid() OR c.partner2_id = auth.uid())
        )
    );

CREATE POLICY "Users can create their own responses" ON responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses" ON responses
    FOR UPDATE USING (auth.uid() = user_id);

-- Reflections RLS policies (private to user)
CREATE POLICY "Users can view their own reflections" ON reflections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reflections" ON reflections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections" ON reflections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflections" ON reflections
    FOR DELETE USING (auth.uid() = user_id);

-- Quests RLS policies
CREATE POLICY "Couple members can view their quests" ON quests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM couples 
            WHERE couples.id = quests.couple_id
            AND (partner1_id = auth.uid() OR partner2_id = auth.uid())
        )
    );

CREATE POLICY "Couple members can update their quests" ON quests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM couples 
            WHERE couples.id = quests.couple_id
            AND (partner1_id = auth.uid() OR partner2_id = auth.uid())
        )
    );

CREATE POLICY "System can insert quests" ON quests
    FOR INSERT WITH CHECK (true);

-- Crisis events RLS policies (restricted access)
CREATE POLICY "System can manage crisis events" ON crisis_events
    FOR ALL USING (false);

-- Grant permissions for authenticated users
GRANT SELECT ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON couples TO authenticated;
GRANT SELECT, INSERT, UPDATE ON invitations TO authenticated;
GRANT SELECT ON daily_questions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON responses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON reflections TO authenticated;
GRANT SELECT, UPDATE ON quests TO authenticated;

-- Grant permissions for service role (for system operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;