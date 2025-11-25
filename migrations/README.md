# Migração: Hierarquia de Serviços

## 📋 Instruções de Execução

### Passo 1: Executar Migração do Schema

1. Acesse o **Supabase Dashboard** do seu projeto
2. Vá em **SQL Editor**
3. Abra o arquivo `migrations/add_service_hierarchy.sql`
4. Copie todo o conteúdo e cole no editor SQL
5. Clique em **Run** para executar

**O que isso faz:**
- Adiciona 5 novas colunas à tabela `servicos`
- Cria índices para otimizar buscas
- Adiciona constraint de unicidade em `nome_completo`

### Passo 2: Popular com Dados (Seed)

1. No **SQL Editor** do Supabase
2. Abra o arquivo `migrations/seed_services.sql`
3. Copie todo o conteúdo e cole no editor SQL
4. Clique em **Run** para executar

**O que isso faz:**
- Insere 50+ serviços no catálogo
- Organiza por marcas (Spotify, Netflix, etc.)
- Categoriza em Vídeo e Música

### Passo 3: Verificar Migração

Execute estas queries no SQL Editor para confirmar:

```sql
-- Verificar total de serviços
SELECT COUNT(*) as total FROM servicos;
-- Deve retornar ~50

-- Verificar marcas únicas
SELECT DISTINCT grupo_servico FROM servicos ORDER BY grupo_servico;
-- Deve retornar ~30 marcas

-- Verificar por categoria
SELECT categoria, COUNT(*) as total 
FROM servicos 
GROUP BY categoria;
-- Deve mostrar Video e Música
```

## ✅ Critério de Sucesso

- [ ] Migração executada sem erros
- [ ] Total de serviços >= 50
- [ ] Marcas únicas >= 25
- [ ] Categorias: Video e Música presentes

## 🔄 Rollback (Se Necessário)

Se precisar reverter a migração:

```sql
-- Remover colunas adicionadas
ALTER TABLE servicos
DROP COLUMN IF EXISTS grupo_servico,
DROP COLUMN IF EXISTS nome_plano,
DROP COLUMN IF EXISTS nome_completo,
DROP COLUMN IF EXISTS valor_por_membro_divilo,
DROP COLUMN IF EXISTS categoria;

-- Remover índices
DROP INDEX IF EXISTS idx_servicos_grupo;
DROP INDEX IF EXISTS idx_servicos_categoria;

-- Remover constraint
ALTER TABLE servicos
DROP CONSTRAINT IF EXISTS servicos_nome_completo_unique;
```

## 📝 Próximos Passos

Após confirmar que a migração foi bem-sucedida, me avise para eu continuar com a implementação do wizard de criação de grupos no frontend.
