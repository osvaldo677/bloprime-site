-- ==========================================================
-- BLOPRIME v2 — FUNÇÕES E TRIGGERS DE LIMPEZA DE ARMAZENAMENTO
-- ==========================================================
-- Este script elimina automaticamente fotos e vídeos
-- associados a atletas e treinadores quando os respetivos
-- perfis são removidos da base de dados.
-- ==========================================================

-- 1️⃣ Função para apagar ficheiros de um atleta
CREATE OR REPLACE FUNCTION delete_athlete_files()
RETURNS TRIGGER AS $$
DECLARE
  fotoPath text;
  videoPath text;
BEGIN
  -- Extrair caminhos dos URLs guardados
  IF OLD.foto_url IS NOT NULL THEN
    fotoPath := replace(
      OLD.foto_url,
      concat(storage_url(), '/object/public/fotos/'),
      ''
    );
    PERFORM storage_delete_object('fotos', fotoPath);
  END IF;

  IF OLD.video_url IS NOT NULL THEN
    videoPath := replace(
      OLD.video_url,
      concat(storage_url(), '/object/public/videos/'),
      ''
    );
    PERFORM storage_delete_object('videos', videoPath);
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2️⃣ Função para apagar ficheiros de um treinador
CREATE OR REPLACE FUNCTION delete_coach_files()
RETURNS TRIGGER AS $$
DECLARE
  fotoPath text;
  videoPath text;
BEGIN
  IF OLD.foto_url IS NOT NULL THEN
    fotoPath := replace(
      OLD.foto_url,
      concat(storage_url(), '/object/public/fotos/'),
      ''
    );
    PERFORM storage_delete_object('fotos', fotoPath);
  END IF;

  IF OLD.video_url IS NOT NULL THEN
    videoPath := replace(
      OLD.video_url,
      concat(storage_url(), '/object/public/videos/'),
      ''
    );
    PERFORM storage_delete_object('videos', videoPath);
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3️⃣ Criar triggers associadas às tabelas de atletas e treinadores
DROP TRIGGER IF EXISTS trg_delete_athlete_files ON athletes;
CREATE TRIGGER trg_delete_athlete_files
AFTER DELETE ON athletes
FOR EACH ROW
EXECUTE FUNCTION delete_athlete_files();

DROP TRIGGER IF EXISTS trg_delete_coach_files ON coaches;
CREATE TRIGGER trg_delete_coach_files
AFTER DELETE ON coaches
FOR EACH ROW
EXECUTE FUNCTION delete_coach_files();

-- ==========================================================
-- LOG DE IMPLEMENTAÇÃO
-- Autor: BloPrime Desenvolvimento
-- Versão: v2.0
-- Última atualização: 2025-10-08
-- ==========================================================
-- O que este script faz:
--  • Remove ficheiros do Storage quando atletas ou treinadores são eliminados.
--  • Mantém o Storage sincronizado com a base de dados.
--  • Garante conformidade com boas práticas de privacidade (GDPR).
-- ==========================================================
