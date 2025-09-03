-- Script para atualizar a constraint de planos no Supabase
-- Execute este script no SQL Editor do Supabase para corrigir o erro de validação

-- PASSO 1: Remover a constraint existente
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_plan_check;

-- PASSO 2: Atualizar dados existentes para os novos valores
-- Converter valores antigos para os novos valores de plano
UPDATE users SET plan = 'criador' WHERE plan IN ('starter');
UPDATE users SET plan = 'influencer' WHERE plan IN ('professional', 'enterprise');

-- PASSO 3: Adicionar a nova constraint com os valores corretos
ALTER TABLE users ADD CONSTRAINT users_plan_check CHECK (plan IN ('criador', 'influencer'));

-- PASSO 4: Atualizar o valor padrão da coluna plan
ALTER TABLE users ALTER COLUMN plan SET DEFAULT 'criador';

-- PASSO 5: Verificar se tudo funcionou (opcional)
-- SELECT plan, COUNT(*) FROM users GROUP BY plan;

-- ✅ Sucesso! Agora a tabela aceita apenas 'criador' e 'influencer'
-- ✅ Dados existentes foram convertidos automaticamente
-- ✅ Novos cadastros funcionarão corretamente