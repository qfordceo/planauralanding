INSERT INTO storage.buckets (id, name, public)
VALUES ('milestone-photos', 'milestone-photos', true);

CREATE POLICY "Milestone photos are viewable by project participants"
ON storage.objects FOR SELECT
USING (bucket_id = 'milestone-photos' AND (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN project_milestones pm ON pm.build_estimate_id = p.id
    WHERE p.user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM contractors c
      WHERE c.user_id = auth.uid()
      AND c.id = pm.assigned_contractor_id
    )
  )
));

CREATE POLICY "Project participants can upload milestone photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'milestone-photos' AND (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN project_milestones pm ON pm.build_estimate_id = p.id
    WHERE p.user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM contractors c
      WHERE c.user_id = auth.uid()
      AND c.id = pm.assigned_contractor_id
    )
  )
));