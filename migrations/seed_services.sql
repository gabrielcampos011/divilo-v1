-- ============================================
-- Script de Seed: Catálogo de Serviços
-- Data: 2025-11-25
-- Descrição: Popula a tabela servicos com o catálogo completo
-- ============================================

-- IMPORTANTE: Execute este script APÓS a migração add_service_hierarchy.sql

-- Inserir serviços de Vídeo
INSERT INTO servicos (grupo_servico, nome_plano, nome_completo, categoria, valor_plano_cheio, max_vagas_padrao, valor_por_membro_divilo)
VALUES
  ('Youtube Premium', 'Familia', 'Youtube Premium | Familia', 'Video', 53.90, 6, 11.96),
  ('Mubi', 'Anual', 'Mubi | Anual', 'Video', 24.90, 2, 14.90),
  ('Mubi', 'Mensal', 'Mubi | Mensal', 'Video', 34.90, 2, 19.90),
  ('Kocowa', 'Anual', 'Kocowa | Anual', 'Video', 21.24, 4, 8.29),
  ('Kocowa', 'Mensal', 'Kocowa | Mensal', 'Video', 25.90, 4, 9.57),
  ('Curiosity Stream', 'Standard', 'Curiosity Stream | Standard', 'Video', 18.90, 5, 5.25),
  ('Curiosity Stream', 'Smart Bundle', 'Curiosity Stream | Smart Bundle', 'Video', 37.90, 5, 11.08),
  ('Curiosity Stream', 'Standard Anual', 'Curiosity Stream | Standard Anual', 'Video', 12.50, 5, 5.25),
  ('Curiosity Stream', 'Smart Bundle Mensal', 'Curiosity Stream | Smart Bundle Mensal', 'Video', 21.84, 5, 6.56),
  ('Calm', 'Premium', 'Calm | Premium', 'Video', 50.83, 6, 11.43),
  ('Rakuten Viki', 'VikiPass Plus', 'Rakuten Viki | VikiPass Plus', 'Video', 37.99, 4, 12.90),
  ('Oldflix', 'Mensal', 'Oldflix | Mensal', 'Video', 16.90, 3, 8.93),
  ('Oldflix', 'Anual', 'Oldflix | Anual', 'Video', 14.97, 3, 8.19),
  ('Oldflix', 'Trimestral', 'Oldflix | Trimestral', 'Video', 14.08, 3, 7.85),
  ('Looke', 'Mensal', 'Looke | Mensal', 'Video', 16.90, 3, 8.93),
  ('Looke', 'Anual', 'Looke | Anual', 'Video', 12.49, 3, 7.24)
ON CONFLICT (nome_completo) DO NOTHING;

-- Continuar com mais serviços de Vídeo...
INSERT INTO servicos (grupo_servico, nome_plano, nome_completo, categoria, valor_plano_cheio, max_vagas_padrao, valor_por_membro_divilo)
VALUES
  ('IQIYI', 'Premium Anual', 'IQIYI | Premium Anual', 'Video', 41.66, 4, 13.90),
  ('IQIYI', 'Padrão Anual', 'IQIYI | Padrão Anual', 'Video', 27.49, 2, 16.20),
  ('IQIYI', 'Premium Mensal', 'IQIYI | Premium Mensal', 'Video', 49.90, 4, 15.17),
  ('IQIYI', 'Padrão Mensal', 'IQIYI | Padrão Mensal', 'Video', 32.90, 2, 18.90),
  ('WeTV', 'Trimestral', 'WeTV | Trimestral', 'Video', 12.63, 2, 8.91),
  ('WeTV', 'Anual', 'WeTV | Anual', 'Video', 11.66, 2, 8.28),
  ('WeTV', 'Mensal', 'WeTV | Mensal', 'Video', 13.90, 2, 9.40),
  ('Univer Video', 'Plano Familiar', 'Univer Video | Plano Familiar', 'Video', 27.90, 4, 10.12),
  ('Univer Video', 'Plano Familiar (Semestral)', 'Univer Video | Plano Familiar (Semestral)', 'Video', 22.42, 4, 8.62),
  ('Univer Video', 'Plano Familiar (Anual)', 'Univer Video | Plano Familiar (Anual)', 'Video', 24.90, 4, 9.29),
  ('Univer Video', 'Plano Básico', 'Univer Video | Plano Básico', 'Video', 21.90, 2, 13.40),
  ('Univer Video', 'Plano Básico (Semestral)', 'Univer Video | Plano Básico (Semestral)', 'Video', 18.25, 2, 11.58),
  ('Univer Video', 'Plano Básico (Anual)', 'Univer Video | Plano Básico (Anual)', 'Video', 18.25, 2, 11.58),
  ('Zapping', 'Pacote Full', 'Zapping | Pacote Full', 'Video', 89.90, 2, 47.40),
  ('Zapping', 'Pacote Full com Futebol', 'Zapping | Pacote Full com Futebol', 'Video', 150.70, 2, 77.80),
  ('Zapping', 'Pacote Full com Filmes', 'Zapping | Pacote Full com Filmes', 'Video', 120.70, 2, 62.80)
ON CONFLICT (nome_completo) DO NOTHING;

-- Mais serviços de Vídeo...
INSERT INTO servicos (grupo_servico, nome_plano, nome_completo, categoria, valor_plano_cheio, max_vagas_padrao, valor_por_membro_divilo)
VALUES
  ('Zapping', 'Pacote Late +', 'Zapping | Pacote Late +', 'Video', 19.80, 2, 12.35),
  ('Zapping', 'Pacote Late + com Futebol', 'Zapping | Pacote Late + com Futebol', 'Video', 79.80, 2, 42.35),
  ('Zapping', 'Pacote Full + com Filmes', 'Zapping | Pacote Full + com Filmes', 'Video', 49.80, 2, 27.35),
  ('Headspace', 'Familia', 'Headspace | Familia', 'Video', 50.32, 6, 11.34),
  ('Record Plus', 'Plano Mensal', 'Record Plus | Plano Mensal', 'Video', 18.90, 4, 7.64),
  ('Record Plus', 'Plano Semestral', 'Record Plus | Plano Semestral', 'Video', 16.82, 4, 7.13),
  ('Record Plus', 'Plano Anual', 'Record Plus | Plano Anual', 'Video', 15.83, 4, 7.08),
  ('NBA', 'League Pass Premium Mensal', 'NBA | League Pass Premium Mensal', 'Video', 69.99, 3, 26.43),
  ('Lumine', 'Padrão', 'Lumine', 'Video', 33.90, 4, 11.77)
ON CONFLICT (nome_completo) DO NOTHING;

-- Inserir serviços de Música
INSERT INTO servicos (grupo_servico, nome_plano, nome_completo, categoria, valor_plano_cheio, max_vagas_padrao, valor_por_membro_divilo)
VALUES
  ('Spotify', 'Duo', 'Spotify | Duo', 'Música', 31.90, 2, 19.45),
  ('Spotify', 'Familia', 'Spotify | Familia', 'Música', 40.90, 6, 10.32),
  ('Deezer', 'Familia', 'Deezer | Familia', 'Música', 39.90, 6, 10.15),
  ('Napster', 'Mensal', 'Napster | Mensal', 'Música', 26.99, 6, 8.00),
  ('Napster', 'Anual', 'Napster | Anual', 'Música', 22.50, 6, 7.25),
  ('Tidal', 'Family', 'Tidal | Family', 'Música', 34.90, 6, 9.32),
  ('Qobuz', 'Duo Anual', 'Qobuz | Duo Anual', 'Música', 29.90, 2, 18.45),
  ('Qobuz', 'Duo Familiar Anual', 'Qobuz | Duo Familiar Anual', 'Música', 34.99, 6, 34.99),
  ('Qobuz', 'Duo Mensal', 'Qobuz | Duo Mensal', 'Música', 33.90, 2, 9.33),
  ('Qobuz', 'Studio Familiar Mensal', 'Qobuz | Studio Familiar Mensal', 'Música', 41.90, 6, 10.48)
ON CONFLICT (nome_completo) DO NOTHING;


-- ============================================
-- Verificação do Seed
-- ============================================

-- Contar total de serviços inseridos
SELECT COUNT(*) as total_servicos FROM servicos;

-- Contar serviços por categoria
SELECT categoria, COUNT(*) as total 
FROM servicos 
GROUP BY categoria 
ORDER BY categoria;

-- Listar marcas únicas
SELECT DISTINCT grupo_servico 
FROM servicos 
ORDER BY grupo_servico;

-- Verificar alguns exemplos
SELECT grupo_servico, nome_plano, valor_por_membro_divilo, max_vagas_padrao 
FROM servicos 
LIMIT 10;
