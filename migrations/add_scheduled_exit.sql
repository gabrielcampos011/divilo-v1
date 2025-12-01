-- Add scheduled exit date to members table
alter table membros
add column if not exists data_saida_agendada timestamptz;

-- Add comment to explain usage
comment on column membros.data_saida_agendada is 'Data agendada para saída do membro (aviso prévio). Se null, não há saída agendada.';
