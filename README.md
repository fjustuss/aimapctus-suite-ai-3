# 🎬 Aimapctus Suite AI

**SaaS Suite AI para Criadores de Conteúdo TikTok, Kwai e YouTube**

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/aimapctus-suite-ai/deploys)

## 🚀 Deploy Status

- **Produção**: [aimapctus-suite-ai.netlify.app](https://aimapctus-suite-ai.netlify.app)
- **Status**: ✅ Ready to Deploy!
- **Última atualização**: $(date)

## 📋 Visão Geral

Plataforma SaaS completa com IA para criadores de conteúdo, oferecendo ferramentas avançadas para TikTok, Kwai e YouTube.

- **Design Moderno**: Interface escura e elegante com gradientes e animações suaves
- **Totalmente Responsivo**: Otimizado para desktop, tablet e mobile
- **Tema Dark**: Esquema de cores escuro profissional com efeitos de brilho sutis
- **Performance Otimizada**: CSS e JavaScript minificados com carregamento rápido
- **SEO Friendly**: Meta tags otimizadas e estrutura semântica
- **Acessibilidade**: Seguindo as melhores práticas de acessibilidade web
- **Interatividade**: Animações suaves e feedback visual para melhor UX

## 📁 Estrutura do Projeto

```
aimapctus-suite-ai-3/
├── index.html          # Página principal da landing page
├── admin.html          # Painel administrativo
├── css/
│   └── styles.css      # Estilos principais
├── js/
│   └── main.js         # Funcionalidades JavaScript
├── assets/
│   └── README.md       # Guia para assets necessários
└── README.md           # Documentação do projeto
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica moderna
- **CSS3**: Flexbox, Grid, Custom Properties, Animações
- **JavaScript ES6+**: Funcionalidades interativas e modernas
- **Font Awesome**: Ícones profissionais
- **Google Fonts**: Tipografia Inter

## 📋 Recursos Implementados

### Página Principal (index.html)
- ✅ Header com navegação fixa
- ✅ Hero section com call-to-action
- ✅ Seção de recursos/funcionalidades
- ✅ Como funciona (3 passos)
- ✅ Depoimentos de clientes
- ✅ Planos e preços (com toggle anual/mensal)
- ✅ FAQ com accordion
- ✅ Call-to-action final
- ✅ Footer completo
- ✅ Modal de contato

### Painel Admin (admin.html)
- ✅ Sistema de login com credenciais
- ✅ Dashboard com estatísticas em tempo real
- ✅ **Gerenciamento de Usuários**: tabela interativa com busca e filtros
- ✅ **Configurações do Sistema**: integrações, limites e preferências
- ✅ **Relatórios e Analytics**: gráficos e métricas de uso
- ✅ Atividade recente com feed em tempo real
- ✅ Interface totalmente responsiva
- ✅ Navegação fluida entre seções

### Funcionalidades JavaScript
- ✅ Navegação mobile (hamburger menu)
- ✅ Toggle de preços anual/mensal
- ✅ FAQ accordion
- ✅ Modal de contato
- ✅ Animações em scroll
- ✅ Smooth scrolling
- ✅ Sistema de notificações
- ✅ Botão scroll-to-top
- ✅ Formulário de contato
- ✅ Acesso admin discreto (triplo clique)

## 🚀 Como Executar

### Desenvolvimento Local

1. **Clone ou baixe o projeto**
   ```bash
   git clone [seu-repositorio]
   cd aimapctus-suite-ai-3
   ```

2. **Abra diretamente no navegador**
   ```bash
   # Abra o index.html diretamente ou use um servidor local
   python -m http.server 8000
   # ou
   npx live-server
   ```

3. **Acesse no navegador**
   ```
   http://localhost:8000
   ```

### Deploy em Produção

Este projeto pode ser hospedado em qualquer serviço de hosting estático:

- **Netlify**: Faça upload da pasta ou conecte com Git
- **Vercel**: Deploy automático via Git
- **GitHub Pages**: Configure nas configurações do repositório
- **AWS S3**: Upload dos arquivos estáticos

## 🔐 Acesso Admin

Para acessar o painel administrativo:

**Método 1 - URL Direta:**
- Acesse `admin.html` diretamente no navegador
- Use as credenciais de demo abaixo

**Método 2 - Botão Discreto:**
- Vá até o final da página principal (footer)
- Clique 3 vezes consecutivas no ícone de engrenagem (⚙️) 
- Sistema de segurança: requer triplo clique em 2 segundos
- Redirecionamento automático após confirmação

**Credenciais de Demo:**
- Usuário: `admin` | Senha: `aimapctus2024`
- Usuário: `administrator` | Senha: `admin123`
- Usuário: `demo` | Senha: `demo`

## 🎨 Personalização

### Cores e Branding
Edite as variáveis CSS em `css/styles.css`:

```css
:root {
    --primary-color: #6366f1;      /* Cor principal */
    --secondary-color: #f59e0b;    /* Cor secundária */
    --accent-color: #10b981;       /* Cor de destaque */
    /* ... outras variáveis */
}
```

### Conteúdo
- Edite o texto diretamente no `index.html`
- Atualize os preços na seção de pricing
- Modifique os depoimentos e estatísticas
- Personalize o FAQ com suas perguntas

### Assets
Adicione seus próprios assets na pasta `assets/`:
- Logo da empresa (`logo.svg`)
- Imagens do dashboard (`hero-dashboard.png`)
- Fotos dos depoimentos
- Favicon personalizado

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: até 767px

## ⚡ Performance

- CSS e JS otimizados
- Imagens com lazy loading
- Fontes com preload
- Animações suaves com CSS
- Código minificado pronto para produção

## 🔧 Funcionalidades Avançadas

### Sistema de Notificações
```javascript
showNotification('Mensagem de sucesso!', 'success');
showNotification('Informação importante', 'info');
showNotification('Atenção necessária', 'warning');
```

### Animações em Scroll
Elementos aparecem automaticamente quando entram na viewport usando Intersection Observer API.

### Toggle de Preços
Sistema automático para alternar entre preços mensais e anuais.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas sobre o código ou implementação:
- Abra uma issue no GitHub
- Entre em contato através do formulário da landing page

## 🚀 Próximos Passos

- [ ] Integração com API de backend
- [ ] Analytics tracking (Google Analytics/GTM)
- [ ] Testes automatizados
- [ ] Otimização para Core Web Vitals
- [ ] Internacionalização (i18n)
- [ ] Dark mode toggle

---

**Desenvolvido com ❤️ para o Aimapctus Suite AI**