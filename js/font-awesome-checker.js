// Font Awesome Icon Checker
// Verifica se os ícones carregaram corretamente e aplica fallbacks

(function() {
    'use strict';
    
    // Aguardar DOM carregar
    document.addEventListener('DOMContentLoaded', function() {
        
        // Aguardar um pouco para as fontes carregarem
        setTimeout(function() {
            checkAndFixIcons();
        }, 1000);
        
        // Verificar novamente após 3 segundos
        setTimeout(function() {
            checkAndFixIcons();
        }, 3000);
    });
    
    function checkAndFixIcons() {
        console.log('🔍 Verificando ícones Font Awesome...');
        
        // Selecionar todos os ícones FA
        const icons = document.querySelectorAll('i[class*="fa-"]');
        let fixedCount = 0;
        
        icons.forEach(function(icon) {
            if (isIconBroken(icon)) {
                fixBrokenIcon(icon);
                fixedCount++;
            }
        });
        
        if (fixedCount > 0) {
            console.log(`⚠️ ${fixedCount} ícones foram corrigidos`);
        } else {
            console.log('✅ Todos os ícones carregaram corretamente');
        }
    }
    
    function isIconBroken(icon) {
        // Verificar se o ícone está renderizando como quadrado
        const computedStyle = window.getComputedStyle(icon, ':before');
        const content = computedStyle.getPropertyValue('content');
        
        // Se não tem content ou é um quadrado vazio
        if (!content || content === 'none' || content === '""') {
            return true;
        }
        
        // Verificar se a fonte foi carregada
        const fontFamily = computedStyle.getPropertyValue('font-family');
        if (!fontFamily.includes('Font Awesome')) {
            return true;
        }
        
        return false;
    }
    
    function fixBrokenIcon(icon) {
        const className = icon.className;
        
        // Fallbacks para ícones mais comuns
        const iconFallbacks = {
            'fa-home': '🏠',
            'fa-user': '👤', 
            'fa-users': '👥',
            'fa-cog': '⚙️',
            'fa-bars': '☰',
            'fa-times': '✕',
            'fa-arrow-left': '←',
            'fa-arrow-right': '→',
            'fa-plus': '+',
            'fa-edit': '✏️',
            'fa-trash': '🗑️',
            'fa-save': '💾',
            'fa-search': '🔍',
            'fa-eye': '👁️',
            'fa-chart-bar': '📊',
            'fa-chart-line': '📈',
            'fa-film': '🎬',
            'fa-video': '🎥',
            'fa-play': '▶️',
            'fa-pause': '⏸️',
            'fa-heart': '❤️',
            'fa-star': '⭐',
            'fa-bell': '🔔',
            'fa-envelope': '✉️',
            'fa-phone': '📞',
            'fa-info-circle': 'ℹ️',
            'fa-check': '✓',
            'fa-exclamation-triangle': '⚠️',
            'fa-facebook': 'f',
            'fa-twitter': 't',
            'fa-instagram': 'i',
            'fa-youtube': 'y',
            'fa-tiktok': 'T',
            'fa-rocket': '🚀',
            'fa-magic': '✨',
            'fa-crown': '👑',
            'fa-shield-alt': '🛡️',
            'fa-database': '🗄️'
        };
        
        // Encontrar qual ícone é baseado na classe
        let iconType = null;
        for (let iconClass in iconFallbacks) {
            if (className.includes(iconClass)) {
                iconType = iconClass;
                break;
            }
        }
        
        if (iconType && iconFallbacks[iconType]) {
            // Aplicar fallback emoji
            icon.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            icon.style.fontWeight = 'normal';
            icon.textContent = iconFallbacks[iconType];
            icon.style.fontSize = '0.9em';
            
            console.log(`🔧 Ícone ${iconType} substituído por ${iconFallbacks[iconType]}`);
        } else {
            // Fallback genérico
            icon.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            icon.textContent = '•';
            icon.style.opacity = '0.7';
        }
    }
    
    // Função para forçar recarga dos ícones
    window.forceIconReload = function() {
        console.log('🔄 Forçando recarga dos ícones...');
        
        // Recarregar CSS do Font Awesome
        const faLinks = document.querySelectorAll('link[href*="font-awesome"]');
        faLinks.forEach(function(link) {
            const newLink = link.cloneNode();
            newLink.href = link.href + '?t=' + Date.now();
            link.parentNode.insertBefore(newLink, link.nextSibling);
            setTimeout(() => link.remove(), 1000);
        });
        
        // Verificar novamente após recarga
        setTimeout(checkAndFixIcons, 2000);
    };
    
    // Adicionar botão de debug (só em desenvolvimento)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(function() {
            const debugBtn = document.createElement('button');
            debugBtn.textContent = '🔧 Fix Icons';
            debugBtn.style.position = 'fixed';
            debugBtn.style.bottom = '10px';
            debugBtn.style.right = '10px';
            debugBtn.style.zIndex = '9999';
            debugBtn.style.padding = '5px 10px';
            debugBtn.style.backgroundColor = '#6366f1';
            debugBtn.style.color = 'white';
            debugBtn.style.border = 'none';
            debugBtn.style.borderRadius = '4px';
            debugBtn.style.fontSize = '12px';
            debugBtn.onclick = function() {
                checkAndFixIcons();
                window.forceIconReload();
            };
            document.body.appendChild(debugBtn);
        }, 2000);
    }
    
})();