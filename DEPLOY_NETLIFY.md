# 🚀 Guia de Deploy no Netlify - Aimapctus Suite AI

## 📋 Pré-requisitos

✅ **Conta no Netlify**: [app.netlify.com](https://app.netlify.com)  
✅ **Repositório Git** (GitHub/GitLab/Bitbucket) - opcional  
✅ **Arquivos do projeto** preparados  

## 🎯 Opções de Deploy

### 🚀 **Opção 1: Deploy Drag & Drop (Mais Rápido)**

1. **Prepare os arquivos**:
   ```bash
   # Certifique-se que todos os arquivos estão na raiz
   index.html
   admin.html  
   roteiros.html
   auth.html
   dashboard.html
   onboarding.html
   netlify.toml
   _redirects
   _headers
   package.json
   css/
   js/
   assets/
   database/
   ```

2. **Acesse o Netlify**:
   - Vá para [app.netlify.com](https://app.netlify.com)
   - Clique em **"Add new site"**
   - Escolha **"Deploy manually"**

3. **Upload dos arquivos**:
   - Selecione todos os arquivos e pastas
   - Arraste para a área de upload
   - **OU** faça zip da pasta inteira e arraste o .zip

4. **Aguarde o deploy**:
   ```
   ✅ Deploy iniciado...
   ✅ Arquivos enviados...
   ✅ Site publicado!
   ```

5. **Configure domínio personalizado** (opcional):
   - Site Settings → Domain management
   - Add custom domain
   - Configure DNS

### 🔗 **Opção 2: Deploy via Git (Automático)**

1. **Envie para repositório Git**:
   ```bash
   git init
   git add .
   git commit -m "Deploy inicial - Aimapctus Suite AI"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/aimapctus-suite-ai.git
   git push -u origin main
   ```

2. **Configure no Netlify**:
   - Add new site → Import from Git
   - Escolha GitHub/GitLab/Bitbucket
   - Selecione o repositório
   - Configure:
     ```
     Branch to deploy: main
     Build command: echo 'Site estático - sem build'
     Publish directory: . (ponto - raiz)
     ```

3. **Deploy automático ativado**:
   - Todo push para `main` → deploy automático
   - Preview para PRs disponível

### 🛠️ **Opção 3: Deploy via CLI**

1. **Instale Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Faça login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   # Deploy de teste
   netlify deploy
   
   # Deploy para produção
   netlify deploy --prod
   ```

## ⚙️ Configurações Importantes

### 🔐 **Variáveis de Ambiente**

Configure em **Site Settings → Environment Variables**:

```env
# Supabase (quando configurar)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-aqui

# App Settings
ENVIRONMENT=production
APP_NAME=Aimapctus Suite AI
APP_VERSION=1.0.0
```

### 📁 **Verificação dos Arquivos**

Certifique-se que estes arquivos estão inclusos:

```
✅ netlify.toml      # Configurações principais
✅ _redirects        # Regras de redirecionamento  
✅ _headers          # Headers de segurança
✅ package.json      # Metadados do projeto
✅ .gitignore        # Arquivos ignorados
✅ README.md         # Documentação
```

### 🎯 **URLs Importantes Pós-Deploy**

Após o deploy, teste estas URLs:

- **Home**: `https://seu-site.netlify.app/`
- **Admin**: `https://seu-site.netlify.app/admin.html`
- **Roteiros**: `https://seu-site.netlify.app/roteiros.html`
- **Onboarding**: `https://seu-site.netlify.app/onboarding.html`
- **Dashboard**: `https://seu-site.netlify.app/dashboard.html`

## 🔍 **Checklist Pós-Deploy**

### ✅ **Funcionalidade**
- [ ] Landing page carregando corretamente
- [ ] Navegação entre páginas funcionando
- [ ] Formulários responsivos
- [ ] Botões e links ativos
- [ ] Imagens carregando
- [ ] Responsividade mobile

### ✅ **Performance**
- [ ] Lighthouse Score > 90
- [ ] Tempo de carregamento < 3s
- [ ] HTTPS ativo
- [ ] Compressão gzip ativa

### ✅ **Admin Panel**
- [ ] Admin.html acessível
- [ ] Login funcionando (admin/admin123)
- [ ] Roteiros IA carregando
- [ ] Interface responsiva
- [ ] Redirecionamentos corretos

### ✅ **SEO e Segurança**
- [ ] Meta tags corretas
- [ ] Headers de segurança ativos
- [ ] noindex em páginas admin
- [ ] CSP configurado
- [ ] Favicon carregando

## 🚨 **Troubleshooting**

### **Erro: "Page Not Found"**
```bash
# Verifique se _redirects está na raiz
# Confirme que netlify.toml está correto
```

### **CSS/JS não carregando**
```bash
# Verifique caminhos relativos nos HTML
# Confirme estrutura de pastas css/ e js/
```

### **Admin não funcionando**
```bash
# Teste credenciais: admin / admin123
# Verifique console do navegador por erros JavaScript
```

## 📊 **Monitoramento**

### **Analytics Netlify**
- Site Settings → Analytics
- Ative Netlify Analytics (pago)
- Monitore tráfego e performance

### **Google Analytics** (recomendado)
```html
<!-- Adicione ao <head> dos HTML -->
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src=\"https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID\"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🎯 **Próximos Passos**

1. **Domínio Personalizado**: Configure seu próprio domínio
2. **SSL Certificate**: Configurado automaticamente pelo Netlify
3. **CDN**: Ativo automaticamente (global)
4. **Forms**: Configure Netlify Forms para contato
5. **Functions**: Implemente funções serverless se necessário

## 💡 **Dicas de Otimização**

### **Performance**
- Comprima imagens antes do upload
- Use WebP quando possível
- Minimize CSS/JS antes do deploy

### **SEO**
- Configure Google Search Console
- Submeta sitemap.xml
- Configure structured data

### **Monitoramento**
- Configure alertas de downtime
- Monitore Core Web Vitals
- Acompanhe métricas de conversão

---

## 🎉 **Deploy Concluído!**

**🚀 Seu projeto Aimapctus Suite AI está pronto para produção no Netlify!**

- ⚡ **Performance otimizada**
- 🔒 **Segurança configurada** 
- 📱 **Totalmente responsivo**
- 🎯 **SEO friendly**
- 🔧 **Admin panel funcional**

**URL de exemplo**: `https://aimapctus-suite-ai.netlify.app`