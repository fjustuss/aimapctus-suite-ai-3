// Configuração do Aimapctus Suite AI
// Para desenvolvimento local, você pode usar valores de demonstração

// Configuração do Supabase (opcional para demonstração)
window.supabaseConfig = {
    // Para usar Supabase real, substitua pelos seus valores:
    // url: 'https://seu-projeto.supabase.co',
    // anonKey: 'sua-chave-anonima-aqui'
    
    // Configuração de demonstração (não requer Supabase)
    url: 'demo-mode',
    anonKey: 'demo-key',
    isDemoMode: true
};

// Outras configurações da aplicação
window.appConfig = {
    app: {
        name: 'Aimapctus Suite AI',
        version: '1.0.0',
        environment: 'development'
    },
    
    // Configurações de demonstração para o sistema de roteiros
    demo: {
        enabled: true,
        mockData: true
    },
    
    // URLs da API (para futuras integrações)
    api: {
        baseUrl: window.location.origin,
        endpoints: {
            scripts: '/api/scripts',
            categories: '/api/categories',
            prompts: '/api/prompts'
        }
    }
};

// Log de inicialização
console.log('✅ Configuração carregada:', window.appConfig);
console.log('🔧 Modo demonstração ativado - Supabase opcional');