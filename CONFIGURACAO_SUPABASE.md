# 🚀 Guia de Configuração do Supabase
## Aimapctus Suite AI

### ✅ Passo 1: Criar Projeto no Supabase (5 minutos)

1. **Acesse**: https://supabase.com
2. **Faça login** ou crie uma conta gratuita
3. **Clique em "New Project"**
4. **Preencha os dados**:
   - **Nome**: `aimapctus-suite-ai`
   - **Senha do banco**: Crie uma senha forte e **ANOTE!** 
     - Exemplo: `AimapctusAI2024!@#`
   - **Região**: `South America (São Paulo)` ou mais próxima
5. **Clique em "Create new project"**
6. ⏳ **Aguarde 1-2 minutos** para o projeto ser criado

---

### ✅ Passo 2: Executar Schema do Banco (2 minutos)

1. **No painel do Supabase**, vá em **"SQL Editor"** (menu lateral)
2. **Clique em "New Query"**
3. **Cole TODO o código** do arquivo `database/schema.sql`:
   ```sql
   -- Cole todo o conteúdo do arquivo schema.sql aqui
   -- (O arquivo tem 176 linhas de código SQL)
   ```
4. **Clique em "Run"** (botão verde)
5. ✅ **Aguarde aparecer**: "Success. No rows returned"

### 🔧 Correção para Banco Existente (se já configurado antes)

**Se você já tinha configurado o Supabase antes** e está recebendo erro de `users_plan_check`, execute este script de correção:

**⚠️ IMPORTANTE:** Este erro acontece quando já existem dados na tabela com os valores antigos.

1. **No SQL Editor**, crie uma **nova query**
2. **Cole o código COMPLETO** do arquivo `database/update_plan_constraint.sql`:
   ```sql
   -- CORRIGIR CONSTRAINT DE PLANOS - SCRIPT COMPLETO
   
   -- Passo 1: Remover constraint antiga
   ALTER TABLE users DROP CONSTRAINT IF EXISTS users_plan_check;
   
   -- Passo 2: Converter dados existentes
   UPDATE users SET plan = 'criador' WHERE plan IN ('starter');
   UPDATE users SET plan = 'influencer' WHERE plan IN ('professional', 'enterprise');
   
   -- Passo 3: Adicionar constraint correta
   ALTER TABLE users ADD CONSTRAINT users_plan_check CHECK (plan IN ('criador', 'influencer'));
   
   -- Passo 4: Definir padrão
   ALTER TABLE users ALTER COLUMN plan SET DEFAULT 'criador';
   ```
3. **Execute a query** - isso corrigirá TODOS os problemas:
   - ✅ Remove a constraint antiga
   - ✅ Converte dados existentes automaticamente
   - ✅ Adiciona a validação correta
   - ✅ Define o padrão correto
4. ✅ **Agora o cadastro funcionará** perfeitamente com "Criador" e "Influencer Pro"

---

### ✅ Passo 3: Obter Chaves de API (1 minuto)

1. **Vá em "Settings" > "API"** (menu lateral)
2. **Copie estas informações**:

   **🔗 Project URL:**
   ```
   https://xxxxxxxxxx.supabase.co
   ```

   **🔑 anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

### ✅ Passo 4: Configurar as Chaves no Código (30 segundos)

1. **Abra o arquivo**: `js/config/config.js`
2. **Substitua as linhas 6 e 7**:

   **ANTES:**
   ```javascript
   url: 'COLE_AQUI_SEU_PROJECT_URL',
   key: 'COLE_AQUI_SUA_ANON_KEY'
   ```

   **DEPOIS:**
   ```javascript
   url: 'https://xxxxxxxxxx.supabase.co',  // Sua URL
   key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Sua chave
   ```

3. **Salve o arquivo** (Ctrl+S)

---

### ✅ Passo 5: Testar a Integração (1 minuto)

1. **Abra** `index.html` no navegador
2. **Abra o Console do navegador** (F12)
3. **Você deve ver**:
   ```
   🔧 Configuração carregada: {supabase: {url: "...", key: "..."}}
   ✅ Supabase inicializado com sucesso
   ```

4. **Se der erro**, verifique:
   - ✅ URL copiada corretamente
   - ✅ Chave anônima (não a service key)
   - ✅ Arquivo salvo

---

### ✅ Passo 6: Testar Cadastro de Usuário

1. **Vá para**: `auth.html`
2. **Clique em "Criar conta grátis"**
3. **Preencha os dados de teste**:
   - Nome: `Teste Usuário`
   - Email: `teste@exemplo.com`
   - Senha: `123456`
   - Plano: `Criador`
4. **Clique em "Começar Teste Grátis"**
5. ✅ **Deve aparecer**: "Conta criada com sucesso!"

---

### 🎉 Parabéns! Integração Completa

Se tudo funcionou:
- ✅ Banco de dados configurado
- ✅ Autenticação com email/senha funcionando
- ✅ Sistema de confirmação de email do Supabase ativo
- ✅ Interface de onboarding completa
- ✅ Sistema pronto para próximos passos

📧 **NOVO**: Veja `CONFIGURACAO_EMAIL_SUPABASE.md` para detalhes sobre o sistema de email.

### 📞 Precisa de Ajuda?

Se algo não funcionou, me mande:
1. **Print do console** (F12)
2. **Mensagem de erro** completa
3. **Qual passo não funcionou**

### 🚀 Próximos Passos

Após a integração funcionando:
1. **Dashboard do usuário** 📊
2. **Integração com Stripe** 💳
3. **Ferramentas de IA básicas** 🤖
4. **Deploy em produção** 🌐