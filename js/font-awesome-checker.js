// Font Awesome Icon Checker - Versão Netlify Optimizada
// Detecta e corrige ícones quebrados de forma mais agressiva

(function() {
    'use strict';
    
    console.log('🚀 Font Awesome Checker carregado - Versão Netlify');
    
    // Aguardar DOM e verificar múltiplas vezes
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔍 Iniciando verificação de ícones...');
        
        // Verificações escalonadas
        setTimeout(checkAndFixIcons, 100);
        setTimeout(checkAndFixIcons, 500);
        setTimeout(checkAndFixIcons, 1000);
        setTimeout(checkAndFixIcons, 2000);
        
        // Observer para novos elementos
        setupMutationObserver();
    });
    
    function checkAndFixIcons() {
        const icons = document.querySelectorAll('i[class*="fa-"]');
        let fixedCount = 0;
        
        console.log(`🔍 Verificando ${icons.length} ícones...`);
        
        icons.forEach(function(icon, index) {
            if (isIconBroken(icon)) {
                fixBrokenIcon(icon);
                fixedCount++;
            }
        });
        
        if (fixedCount > 0) {
            console.log(`⚠️ ${fixedCount} ícones corrigidos de ${icons.length} total`);
        } else {
            console.log(`✅ Todos os ${icons.length} ícones estão OK`);
        }
    }
    
    function isIconBroken(icon) {
        // Método 1: Verificar se é um X ou caractere estranho
        const text = icon.textContent || icon.innerText || '';
        if (text === '×' || text === '✗' || text.includes('') || text === '?') {
            return true;
        }
        
        // Método 2: Verificar computedStyle
        try {
            const style = window.getComputedStyle(icon, ':before');
            const content = style.getPropertyValue('content');
            const fontFamily = style.getPropertyValue('font-family');
            
            // Se não tem content ou fonte errada
            if (!content || content === 'none' || content === '""') {
                return true;
            }
            
            if (!fontFamily.toLowerCase().includes('awesome') && 
                !fontFamily.toLowerCase().includes('fontawesome')) {
                return true;
            }
        } catch(e) {
            return true;
        }
        
        // Método 3: Verificar dimensões
        const rect = icon.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
            return true;
        }
        
        return false;
    }
    
    function fixBrokenIcon(icon) {
        const classes = icon.className;
        
        // Mapa de ícones para símbolos Unicode/Emoji
        const iconMap = {
            'fa-home': '🏠',
            'fa-user': '👤',
            'fa-users': '👥',
            'fa-cog': '⚙',
            'fa-bars': '☰',
            'fa-times': '×',
            'fa-arrow-left': '←',
            'fa-arrow-right': '→',
            'fa-plus': '+',
            'fa-edit': '✎',
            'fa-trash': '🗑',
            'fa-save': '💾',
            'fa-search': '🔍',
            'fa-eye': '👁',
            'fa-chart-bar': '📊',
            'fa-chart-line': '📈',
            'fa-film': '🎬',
            'fa-video': '🎥',
            'fa-play': '▶',
            'fa-pause': '⏸',
            'fa-heart': '♥',
            'fa-star': '★',
            'fa-bell': '🔔',
            'fa-envelope': '✉',
            'fa-check': '✓',
            'fa-check-circle': '✅',
            'fa-exclamation-triangle': '⚠',
            'fa-info-circle': 'ℹ',
            'fa-sign-out-alt': '⤴',
            'fa-sign-in-alt': '⤵',
            'fa-file-alt': '📄',
            'fa-dollar-sign': '$',
            'fa-users-cog': '👥⚙',
            'fa-shield-alt': '🛡',
            'fa-database': '🗄',
            'fa-life-ring': '🛟',
            'fa-user-plus': '👤+',
            'fa-rocket': '🚀',
            'fa-magic': '✨',
            'fa-crown': '👑'
        };
        
        // Encontrar correspondência
        let replacement = '•'; // fallback padrão
        for (let iconClass in iconMap) {
            if (classes.includes(iconClass)) {
                replacement = iconMap[iconClass];
                break;
            }
        }
        
        // Aplicar correção
        icon.style.fontFamily = 'system-ui, Arial, sans-serif';
        icon.style.fontWeight = 'normal';
        icon.style.fontSize = '1em';
        icon.style.lineHeight = '1';
        icon.style.display = 'inline-block';
        icon.textContent = replacement;
        icon.title = `Ícone: ${classes}`;
        
        console.log(`🔧 Corrigido: ${classes} → ${replacement}`);
    }
    
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            let hasNewIcons = false;
            
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        const icons = node.querySelectorAll ? node.querySelectorAll('i[class*="fa-"]') : [];
                        if (icons.length > 0) {
                            hasNewIcons = true;
                        }
                    }
                });
            });
            
            if (hasNewIcons) {
                setTimeout(checkAndFixIcons, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Função global para debug
    window.fixAllIcons = function() {
        console.log('🔄 Forçando correção manual...');
        checkAndFixIcons();
    };
    
    // Botão de debug para Netlify
    if (window.location.hostname.includes('netlify.app') || 
        window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('127.0.0.1')) {
        
        setTimeout(function() {
            const btn = document.createElement('button');
            btn.innerHTML = '🔧 Fix Icons';
            btn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 99999;
                padding: 10px 15px;
                background: #e11d48;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transition: all 0.2s;
            `;
            
            btn.onmouseover = () => btn.style.background = '#be185d';
            btn.onmouseout = () => btn.style.background = '#e11d48';
            
            btn.onclick = function() {
                checkAndFixIcons();
                btn.innerHTML = '✅ Fixed!';
                setTimeout(() => btn.innerHTML = '🔧 Fix Icons', 2000);
            };
            
            document.body.appendChild(btn);
        }, 3000);
    }
    
})();

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