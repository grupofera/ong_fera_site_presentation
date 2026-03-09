-- Add projeto column to animais table
-- This migration adds support for project separation (ONG FERA vs Animais Iluminados)

ALTER TABLE animais
ADD COLUMN projeto VARCHAR(255) DEFAULT NULL;

-- Add comment to explain the column
COMMENT ON COLUMN animais.projeto IS 'Project identifier: NULL for ONG FERA, "Animais Iluminados" for special project';

-- Create index for faster filtering by project
CREATE INDEX idx_animais_projeto ON animais(projeto);
