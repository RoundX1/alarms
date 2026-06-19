(function () {
  function toggleMenu(el, arrowSelector) {
    if (!el) return;
    var submenu = el.nextElementSibling;
    var arrow = el.querySelector(arrowSelector);
    el.classList.toggle('expanded');
    if (arrow) arrow.classList.toggle('open');
    if (submenu) submenu.classList.toggle('open');
  }

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function escapeHtml(text) {
    return String(text ?? '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function showToastFallback(msg, type) {
    var colors = { success: '#52c41a', error: '#ff4d4f', info: '#1890ff', warning: '#faad14' };
    var el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:20px;right:20px;padding:10px 20px;background:#fff;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:13px;z-index:9999;border-left:4px solid ' + (colors[type] || colors.info) + ';transition:opacity 0.3s';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 300);
    }, 2500);
  }

  window.PrototypeCommon = {
    toggleMenu: toggleMenu,
    getQueryParam: getQueryParam,
    escapeHtml: escapeHtml,
    showToast: showToastFallback
  };

  window.toggleSubmenu = function (el) {
    toggleMenu(el, '.menu-arrow');
  };

  window.toggleNavSubmenu = function (el) {
    toggleMenu(el, '.nav-menu-arrow');
  };

  window.getQueryParam = getQueryParam;
  window.escapeHtml = escapeHtml;

  if (!window.__prototypeCommonBound) {
    document.addEventListener('click', function (event) {
      var submenuToggle = event.target.closest('[data-submenu-toggle]');
      if (submenuToggle) {
        var toggleType = submenuToggle.getAttribute('data-submenu-toggle');
        if (toggleType === 'nav') {
          window.toggleNavSubmenu(submenuToggle);
        } else {
          window.toggleSubmenu(submenuToggle);
        }
        return;
      }

      var toastTrigger = event.target.closest('[data-toast-message]');
      if (toastTrigger) {
        var message = toastTrigger.getAttribute('data-toast-message') || '';
        var toastType = toastTrigger.getAttribute('data-toast-type') || 'info';
        var toastHandler = typeof window.showToast === 'function' ? window.showToast : showToastFallback;
        toastHandler(message, toastType);
      }
    });
    window.__prototypeCommonBound = true;
  }
})();
